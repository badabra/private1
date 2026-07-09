namespace Minima.Services
{
    // Abstraction d'envoi de courriel : permet de changer d'implémentation (SMTP, log, etc.)
    public interface IEmailSender
    {
        // Retourne true si le courriel a été remis au serveur SMTP,
        // false si l'envoi n'est pas configuré (permet un repli côté appelant).
        Task<bool> SendAsync(string toEmail, string subject, string htmlBody);
    }
}
