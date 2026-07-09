using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Minima.Data;
using Minima.Services;

namespace Minima.Pages
{
    public class LoginModel : PageModel
    {
        private readonly ApplicationDbContext _db;
        private readonly PasswordHashService _hasher;
        private readonly JwtTokenService _jwt;

        public LoginModel(ApplicationDbContext db, PasswordHashService hasher, JwtTokenService jwt)
        {
            _db = db;
            _hasher = hasher;
            _jwt = jwt;
        }

        [BindProperty] public string UsernameOrEmail { get; set; } = string.Empty;
        [BindProperty] public string Password { get; set; } = string.Empty;

        public string? ErrorMessage { get; set; }
        public string? UnverifiedEmail { get; set; }

        public void OnGet() { }

        public async Task<IActionResult> OnPostAsync()
        {
            var input = UsernameOrEmail.Trim().ToLower();
            var user = await _db.Users.FirstOrDefaultAsync(u =>
                u.Username.ToLower() == input || u.Email.ToLower() == input);

            if (user == null || !_hasher.Verify(Password, user.PasswordHash))
            {
                ErrorMessage = "Identifiant ou mot de passe incorrect.";
                return Page();
            }

            if (user.IsBlocked)
            {
                ErrorMessage = "Votre compte a été bloqué. Contactez un administrateur.";
                return Page();
            }

            // La connexion est refusée tant que l'adresse courriel n'est pas vérifiée.
            if (!user.IsEmailVerified)
            {
                ErrorMessage = "Votre adresse courriel n'a pas encore été vérifiée.";
                UnverifiedEmail = user.Email;
                return Page();
            }

            var token = _jwt.GenerateToken(user);
            Response.Cookies.Append("auth_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddHours(1)
            });

            return RedirectToPage("/Dashboard");
        }
    }
}
