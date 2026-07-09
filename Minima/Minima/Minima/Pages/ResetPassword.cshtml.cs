using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Minima.Data;
using Minima.Models;
using Minima.Services;

namespace Minima.Pages
{
    public class ResetPasswordModel : PageModel
    {
        private readonly ApplicationDbContext _db;
        private readonly PasswordHashService _hasher;

        public ResetPasswordModel(ApplicationDbContext db, PasswordHashService hasher)
        {
            _db = db;
            _hasher = hasher;
        }

        [BindProperty(SupportsGet = true)] public string Token { get; set; } = string.Empty;
        [BindProperty] public string Password { get; set; } = string.Empty;
        [BindProperty] public string ConfirmPassword { get; set; } = string.Empty;

        public bool TokenValid { get; set; }
        public string? ErrorMessage { get; set; }

        public async Task OnGetAsync()
        {
            TokenValid = await FindValidTokenAsync() != null;
        }

        public async Task<IActionResult> OnPostAsync()
        {
            var reset = await FindValidTokenAsync();
            TokenValid = reset != null;
            if (reset == null)
                return Page();

            if (string.IsNullOrWhiteSpace(Password) || Password.Length < 6)
            {
                ErrorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
                return Page();
            }

            if (Password != ConfirmPassword)
            {
                ErrorMessage = "Les mots de passe ne correspondent pas.";
                return Page();
            }

            var user = await _db.Users.FirstAsync(u => u.Id == reset.UserId);
            user.PasswordHash = _hasher.Hash(Password);
            reset.Used = true; // usage unique
            await _db.SaveChangesAsync();

            TempData["SuccessMessage"] = "Mot de passe réinitialisé avec succès ! Connectez-vous.";
            return RedirectToPage("/Login");
        }

        private async Task<PasswordResetToken?> FindValidTokenAsync()
        {
            if (string.IsNullOrEmpty(Token)) return null;
            return await _db.PasswordResetTokens.FirstOrDefaultAsync(t =>
                t.Token == Token && !t.Used && t.ExpiresAt > DateTime.UtcNow);
        }
    }
}
