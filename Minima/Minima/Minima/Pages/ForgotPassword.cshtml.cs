using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Minima.Data;
using Minima.Models;
using Minima.Services;

namespace Minima.Pages
{
    public class ForgotPasswordModel : PageModel
    {
        private readonly ApplicationDbContext _db;
        private readonly IEmailSender _email;

        public ForgotPasswordModel(ApplicationDbContext db, IEmailSender email)
        {
            _db = db;
            _email = email;
        }

        [BindProperty]
        public string UsernameOrEmail { get; set; } = string.Empty;

        public bool Submitted { get; set; }

        // Repli : affiché à l'écran seulement si l'envoi par courriel échoue (démo).
        public string? ResetLink { get; set; }

        public void OnGet() { }

        public async Task OnPostAsync()
        {
            Submitted = true;

            var input = (UsernameOrEmail ?? string.Empty).Trim().ToLower();
            if (input.Length == 0) return;

            var user = await _db.Users.FirstOrDefaultAsync(u =>
                u.Username.ToLower() == input || u.Email.ToLower() == input);

            // Message générique dans tous les cas : ne pas révéler si un compte existe.
            if (user == null) return;

            var token = Guid.NewGuid().ToString("N") + Guid.NewGuid().ToString("N");
            _db.PasswordResetTokens.Add(new PasswordResetToken
            {
                UserId = user.Id,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddMinutes(30)
            });
            await _db.SaveChangesAsync();

            var link = Url.Page("/ResetPassword", null, new { token }, Request.Scheme)!;
            var body = $@"<div style='font-family:Arial,sans-serif;color:#111'>
    <h2 style='color:#2563eb'>Réinitialisation de mot de passe</h2>
    <p>Bonjour {WebUtility.HtmlEncode(user.FirstName)},</p>
    <p>Vous avez demandé à réinitialiser votre mot de passe Minima. Cliquez sur le bouton ci-dessous :</p>
    <p><a href='{link}' style='display:inline-block;background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold'>Réinitialiser mon mot de passe</a></p>
    <p style='color:#888;font-size:12px'>Ce lien est valide 30 minutes et à usage unique. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
</div>";

            // Envoi par courriel ; repli à l'écran si le service SMTP est indisponible.
            bool sent;
            try
            {
                sent = await _email.SendAsync(user.Email, "Réinitialisation de votre mot de passe Minima", body);
            }
            catch
            {
                sent = false;
            }

            if (!sent)
                ResetLink = link;
        }
    }
}
