using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Security.Claims;

namespace Minima.Pages
{
    // AUTH-04 : [Authorize] exige un jeton JWT valide (middleware dans Program.cs).
    // Sans jeton valide, l'utilisateur est redirigé vers /Login.
    [Authorize]
    public class DashboardModel : PageModel
    {
        public string Username { get; set; } = string.Empty;

        public void OnGet()
        {
            Username = User.FindFirstValue(ClaimTypes.Name) ?? "Utilisateur";
        }
    }
}
