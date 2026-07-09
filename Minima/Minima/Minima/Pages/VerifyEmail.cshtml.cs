using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Minima.Data;
using Minima.Services;

namespace Minima.Pages
{
    // Saisie du code de vérification reçu par courriel. Accessible sans connexion
    // (l'utilisateur n'est pas encore autorisé à se connecter tant qu'il n'est pas vérifié).
    public class VerifyEmailModel : PageModel
    {
        private readonly ApplicationDbContext _db;
        private readonly IEmailSender _email;

        public VerifyEmailModel(ApplicationDbContext db, IEmailSender email)
        {
            _db = db;
            _email = email;
        }

        [BindProperty(SupportsGet = true)] public string Email { get; set; } = string.Empty;
        [BindProperty] public string Code { get; set; } = string.Empty;

        public string? ErrorMessage { get; set; }
        public string? InfoMessage { get; set; }

        public IActionResult OnGet()
        {
            if (string.IsNullOrWhiteSpace(Email))
                return RedirectToPage("/Register");
            return Page();
        }

        // Vérification du code saisi
        public async Task<IActionResult> OnPostAsync()
        {
            var email = Email.Trim().ToLower();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                ErrorMessage = "Compte introuvable.";
                return Page();
            }
            if (user.IsEmailVerified)
            {
                TempData["SuccessMessage"] = "Votre adresse est déjà vérifiée. Connectez-vous.";
                return RedirectToPage("/Login");
            }
            if (user.EmailVerificationExpiresAt == null || user.EmailVerificationExpiresAt < DateTime.UtcNow)
            {
                ErrorMessage = "Le code a expiré. Cliquez sur « Renvoyer un code ».";
                return Page();
            }
            if (user.EmailVerificationAttempts >= VerificationHelper.MaxAttempts)
            {
                ErrorMessage = "Trop de tentatives. Cliquez sur « Renvoyer un code ».";
                return Page();
            }

            if (Code.Trim() != user.EmailVerificationCode)
            {
                user.EmailVerificationAttempts++;
                await _db.SaveChangesAsync();
                var left = VerificationHelper.MaxAttempts - user.EmailVerificationAttempts;
                ErrorMessage = $"Code incorrect. Il vous reste {left} tentative(s).";
                return Page();
            }

            // Succès : compte activé
            user.IsEmailVerified = true;
            user.EmailVerificationCode = null;
            user.EmailVerificationExpiresAt = null;
            user.EmailVerificationAttempts = 0;
            await _db.SaveChangesAsync();

            TempData["SuccessMessage"] = "Adresse vérifiée avec succès ! Vous pouvez vous connecter.";
            return RedirectToPage("/Login");
        }

        // Renvoi d'un nouveau code
        public async Task<IActionResult> OnPostResendAsync()
        {
            var email = Email.Trim().ToLower();
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                ErrorMessage = "Compte introuvable.";
                return Page();
            }
            if (user.IsEmailVerified)
            {
                TempData["SuccessMessage"] = "Votre adresse est déjà vérifiée. Connectez-vous.";
                return RedirectToPage("/Login");
            }

            var code = VerificationHelper.GenerateCode();
            user.EmailVerificationCode = code;
            user.EmailVerificationExpiresAt = DateTime.UtcNow.AddMinutes(VerificationHelper.ExpiryMinutes);
            user.EmailVerificationAttempts = 0;
            await _db.SaveChangesAsync();

            await VerificationHelper.SendCodeAsync(_email, user, code);

            InfoMessage = "Un nouveau code a été envoyé à votre adresse courriel.";
            return Page();
        }
    }
}
