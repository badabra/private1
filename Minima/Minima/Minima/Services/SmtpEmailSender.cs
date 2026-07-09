using System.Net;
using System.Net.Mail;

namespace Minima.Services
{
    // Envoi réel de courriels via SMTP. La configuration est lue depuis la section "Email"
    // de appsettings.json (host, port, identifiants). Compatible Gmail, Mailtrap, etc.
    public class SmtpEmailSender : IEmailSender
    {
        private readonly IConfiguration _config;
        private readonly ILogger<SmtpEmailSender> _logger;

        public SmtpEmailSender(IConfiguration config, ILogger<SmtpEmailSender> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task<bool> SendAsync(string toEmail, string subject, string htmlBody)
        {
            var host = _config["Email:SmtpHost"];

            // Tant que le SMTP n'est pas configuré, on journalise au lieu de planter :
            // l'inscription reste possible et le code apparaît dans la console du serveur.
            if (string.IsNullOrWhiteSpace(host))
            {
                _logger.LogWarning(
                    "SMTP non configuré (Email:SmtpHost vide). Courriel NON envoyé à {To}. Sujet : {Subject}",
                    toEmail, subject);
                return false;
            }

            var port = int.Parse(_config["Email:SmtpPort"] ?? "587");
            var user = _config["Email:SmtpUser"];
            var password = _config["Email:SmtpPassword"];
            var fromEmail = _config["Email:FromEmail"] ?? user ?? "no-reply@minima.local";
            var fromName = _config["Email:FromName"] ?? "Minima";
            var enableSsl = bool.Parse(_config["Email:EnableSsl"] ?? "true");

            using var message = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(toEmail);

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(user, password),
                EnableSsl = enableSsl
            };

            await client.SendMailAsync(message);
            _logger.LogInformation("Courriel envoyé à {To}. Sujet : {Subject}", toEmail, subject);
            return true;
        }
    }
}
