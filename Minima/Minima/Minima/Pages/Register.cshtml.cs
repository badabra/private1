using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Minima.Data;
using Minima.Models;
using Minima.Services;

namespace Minima.Pages
{
    public class RegisterModel : PageModel
    {
        private readonly ApplicationDbContext _db;
        private readonly PasswordHashService _hasher;
        private readonly IEmailSender _email;

        public RegisterModel(ApplicationDbContext db, PasswordHashService hasher, IEmailSender email)
        {
            _db = db;
            _hasher = hasher;
            _email = email;
        }

        [BindProperty] public string FirstName { get; set; } = string.Empty;
        [BindProperty] public string LastName { get; set; } = string.Empty;
        [BindProperty] public string Username { get; set; } = string.Empty;
        [BindProperty] public string Email { get; set; } = string.Empty;
        [BindProperty] public string Password { get; set; } = string.Empty;

        public string? ErrorMessage { get; set; }

        public void OnGet() { }

        public async Task<IActionResult> OnPostAsync()
        {
            if (string.IsNullOrWhiteSpace(FirstName) || string.IsNullOrWhiteSpace(LastName) ||
                string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(Email) ||
                string.IsNullOrWhiteSpace(Password))
            {
                ErrorMessage = "Tous les champs sont obligatoires.";
                return Page();
            }

            if (await _db.Users.AnyAsync(u => u.Username == Username))
            {
                ErrorMessage = "Cet identifiant est déjà pris.";
                return Page();
            }

            var email = Email.Trim().ToLower();
            if (await _db.Users.AnyAsync(u => u.Email == email))
            {
                ErrorMessage = "Cette adresse courriel est déjà utilisée.";
                return Page();
            }

            // Compte créé NON vérifié : un code est envoyé par courriel et devra
            // être saisi avant que la connexion soit autorisée.
            var code = VerificationHelper.GenerateCode();
            var user = new User
            {
                FirstName = FirstName.Trim(),
                LastName = LastName.Trim(),
                Username = Username.Trim(),
                Email = email,
                PasswordHash = _hasher.Hash(Password),
                IsEmailVerified = false,
                EmailVerificationCode = code,
                EmailVerificationExpiresAt = DateTime.UtcNow.AddMinutes(VerificationHelper.ExpiryMinutes)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            await VerificationHelper.SendCodeAsync(_email, user, code);

            // Redirection vers la saisie du code
            return RedirectToPage("/VerifyEmail", new { email = user.Email });
        }
    }
}
