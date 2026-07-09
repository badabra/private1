using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Minima.Data;
using Minima.Services;

namespace Minima.Pages
{
    // Mon compte : modification des informations personnelles et du mot de passe
    [Authorize]
    public class ProfileModel : PageModel
    {
        private readonly ApplicationDbContext _db;
        private readonly PasswordHashService _hasher;

        public ProfileModel(ApplicationDbContext db, PasswordHashService hasher)
        {
            _db = db;
            _hasher = hasher;
        }

        public string Username { get; set; } = string.Empty;

        [BindProperty] public string FirstName { get; set; } = string.Empty;
        [BindProperty] public string LastName { get; set; } = string.Empty;
        [BindProperty] public string Email { get; set; } = string.Empty;

        [BindProperty] public string CurrentPassword { get; set; } = string.Empty;
        [BindProperty] public string NewPassword { get; set; } = string.Empty;
        [BindProperty] public string ConfirmNewPassword { get; set; } = string.Empty;

        public string? InfoMessage { get; set; }
        public string? InfoError { get; set; }
        public string? PasswordMessage { get; set; }
        public string? PasswordError { get; set; }

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        public async Task OnGetAsync()
        {
            var user = await _db.Users.FirstAsync(u => u.Id == CurrentUserId);
            Username = user.Username;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Email = user.Email;
        }

        // Modifier prénom / nom / courriel
        public async Task<IActionResult> OnPostInfoAsync()
        {
            var user = await _db.Users.FirstAsync(u => u.Id == CurrentUserId);
            Username = user.Username;

            if (string.IsNullOrWhiteSpace(FirstName) || string.IsNullOrWhiteSpace(LastName) ||
                string.IsNullOrWhiteSpace(Email))
            {
                InfoError = "Tous les champs sont obligatoires.";
                return Page();
            }

            if (!Email.Contains('@'))
            {
                InfoError = "Adresse courriel invalide.";
                return Page();
            }

            var email = Email.Trim().ToLower();
            if (await _db.Users.AnyAsync(u => u.Id != user.Id && u.Email == email))
            {
                InfoError = "Cette adresse courriel est déjà utilisée par un autre compte.";
                return Page();
            }

            user.FirstName = FirstName.Trim();
            user.LastName = LastName.Trim();
            user.Email = email;
            await _db.SaveChangesAsync();

            InfoMessage = "Informations mises à jour avec succès.";
            return Page();
        }

        // Changer le mot de passe (l'actuel est exigé)
        public async Task<IActionResult> OnPostPasswordAsync()
        {
            var user = await _db.Users.FirstAsync(u => u.Id == CurrentUserId);
            Username = user.Username;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Email = user.Email;

            if (!_hasher.Verify(CurrentPassword, user.PasswordHash))
            {
                PasswordError = "Le mot de passe actuel est incorrect.";
                return Page();
            }

            if (string.IsNullOrWhiteSpace(NewPassword) || NewPassword.Length < 6)
            {
                PasswordError = "Le nouveau mot de passe doit contenir au moins 6 caractères.";
                return Page();
            }

            if (NewPassword != ConfirmNewPassword)
            {
                PasswordError = "Les nouveaux mots de passe ne correspondent pas.";
                return Page();
            }

            user.PasswordHash = _hasher.Hash(NewPassword);
            await _db.SaveChangesAsync();

            PasswordMessage = "Mot de passe modifié avec succès.";
            return Page();
        }
    }
}
