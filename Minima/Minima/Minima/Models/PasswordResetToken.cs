namespace Minima.Models
{
    // Mot de passe oublié : jeton de réinitialisation à usage unique, durée limitée
    public class PasswordResetToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool Used { get; set; } = false;

        public User User { get; set; } = null!;
    }
}
