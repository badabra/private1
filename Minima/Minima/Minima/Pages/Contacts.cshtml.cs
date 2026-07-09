using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Minima.Data;
using Minima.Models;

namespace Minima.Pages
{
    [Authorize]
    public class ContactsModel : PageModel
    {
        private readonly ApplicationDbContext _db;

        public ContactsModel(ApplicationDbContext db)
        {
            _db = db;
        }

        [BindProperty] public string SearchTerm { get; set; } = string.Empty;

        public List<User> SearchResults { get; set; } = new();
        public List<Contact> MyContacts { get; set; } = new();
        public HashSet<int> MyContactIds { get; set; } = new();
        public string? ErrorMessage { get; set; }

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        public async Task OnGetAsync()
        {
            await LoadContactsAsync();
        }

        // CONTACT-01 : recherche d'un utilisateur par identifiant, nom ou courriel
        public async Task OnPostSearchAsync()
        {
            await LoadContactsAsync();

            var term = (SearchTerm ?? string.Empty).Trim();
            if (term.Length == 0)
            {
                ErrorMessage = "Entrez un identifiant ou un nom à rechercher.";
                return;
            }

            var me = CurrentUserId;
            SearchResults = await _db.Users
                .Where(u => u.Id != me &&
                       (u.Username.Contains(term) ||
                        u.FirstName.Contains(term) ||
                        u.LastName.Contains(term) ||
                        u.Email.Contains(term)))
                .OrderBy(u => u.Username)
                .Take(10)
                .ToListAsync();

            if (SearchResults.Count == 0)
                ErrorMessage = "Aucun utilisateur trouvé.";
        }

        // CONTACT-02 : ajout d'un contact
        public async Task<IActionResult> OnPostAddAsync(int userId)
        {
            var me = CurrentUserId;

            var alreadyContact = await _db.Contacts
                .AnyAsync(c => c.OwnerId == me && c.ContactUserId == userId);
            var targetExists = await _db.Users.AnyAsync(u => u.Id == userId);

            if (!alreadyContact && targetExists && userId != me)
            {
                _db.Contacts.Add(new Contact { OwnerId = me, ContactUserId = userId });
                await _db.SaveChangesAsync();
                TempData["SuccessMessage"] = "Contact ajouté.";
            }

            return RedirectToPage();
        }

        private async Task LoadContactsAsync()
        {
            var me = CurrentUserId;
            MyContacts = await _db.Contacts
                .Where(c => c.OwnerId == me)
                .Include(c => c.ContactUser)
                .OrderBy(c => c.ContactUser.Username)
                .ToListAsync();
            MyContactIds = MyContacts.Select(c => c.ContactUserId).ToHashSet();
        }
    }
}
