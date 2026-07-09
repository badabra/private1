using System.Net;
using Minima.Models;

namespace Minima.Services
{
    // Génération et envoi du code de vérification (partagé entre l'inscription et le renvoi de code).
    public static class VerificationHelper
    {
        public const int ExpiryMinutes = 15;
        public const int MaxAttempts = 5;

        // Code numérique à 6 chiffres
        public static string GenerateCode() => Random.Shared.Next(100000, 1000000).ToString();

        public static async Task SendCodeAsync(IEmailSender email, User user, string code)
        {
            var subject = "Votre code de vérification Minima";
            var body = $@"<div style='font-family:Arial,sans-serif;color:#111'>
    <h2 style='color:#2563eb'>Bienvenue sur Minima</h2>
    <p>Bonjour {WebUtility.HtmlEncode(user.FirstName)},</p>
    <p>Pour activer votre compte, entrez ce code de vérification :</p>
    <p style='font-size:30px;font-weight:bold;letter-spacing:6px;color:#111'>{code}</p>
    <p>Ce code expire dans {ExpiryMinutes} minutes.</p>
    <p style='color:#888;font-size:12px'>Si vous n'êtes pas à l'origine de cette inscription, ignorez ce message.</p>
</div>";

            // L'échec d'envoi ne doit pas interrompre l'inscription : l'utilisateur
            // pourra demander un renvoi du code depuis la page de vérification.
            try
            {
                await email.SendAsync(user.Email, subject, body);
            }
            catch (Exception)
            {
                // Journalisé par SmtpEmailSender ; on laisse l'utilisateur poursuivre.
            }
        }
    }
}
