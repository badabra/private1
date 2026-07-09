using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Minima.Data;
using Minima.Hubs;
using Minima.Models;

namespace Minima.Pages
{
    [Authorize]
    public class ChatModel : PageModel
    {
        private readonly ApplicationDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly IHubContext<ChatHub> _hub;

        public ChatModel(ApplicationDbContext db, IWebHostEnvironment env, IHubContext<ChatHub> hub)
        {
            _db = db;
            _env = env;
            _hub = hub;
        }

        public int MyId { get; set; }
        public User? OtherUser { get; set; }
        public string HistoryJson { get; set; } = "[]";

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        public async Task<IActionResult> OnGetAsync(int userId)
        {
            MyId = CurrentUserId;

            OtherUser = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (OtherUser == null || OtherUser.Id == MyId)
                return RedirectToPage("/Contacts");

            var history = await _db.Messages
                .Where(m => (m.SenderId == MyId && m.ReceiverId == userId) ||
                            (m.SenderId == userId && m.ReceiverId == MyId))
                .Include(m => m.Reactions)
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            // L'encodeur JSON par défaut échappe < et > : le JSON est sûr dans un <script>
            HistoryJson = JsonSerializer.Serialize(history.Select(m => new
            {
                id = m.Id,
                senderId = m.SenderId,
                content = m.IsDeleted ? null : m.Content,
                sentAt = DateTime.SpecifyKind(m.SentAt, DateTimeKind.Utc),
                isDeleted = m.IsDeleted,
                attachmentName = m.IsDeleted ? null : m.AttachmentName,
                attachmentContentType = m.IsDeleted ? null : m.AttachmentContentType,
                reactions = m.Reactions
                    .GroupBy(r => r.Emoji)
                    .Select(g => new { emoji = g.Key, count = g.Count(), users = g.Select(x => x.UserId).ToArray() })
            }));

            return Page();
        }

        // ----- MSG-04 : envoi de fichiers -----

        private const long MaxFileSize = 10 * 1024 * 1024; // 10 Mo

        // Liste blanche d'extensions : bloque .exe, .html, .js, etc.
        private static readonly string[] AllowedExtensions =
            { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".txt", ".zip", ".docx", ".xlsx", ".pptx" };

        // Le type MIME est déduit de l'extension côté serveur (jamais du client,
        // sinon un fichier déclaré "text/html" serait exécuté par le navigateur -> XSS)
        private static string GetContentType(string ext) => ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".pdf" => "application/pdf",
            ".txt" => "text/plain",
            ".zip" => "application/zip",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            _ => "application/octet-stream"
        };

        private string UploadsDir => Path.Combine(_env.ContentRootPath, "App_Data", "uploads");

        public async Task<IActionResult> OnPostUploadAsync(int receiverId, IFormFile? file)
        {
            var myId = CurrentUserId;

            if (file == null || file.Length == 0)
                return BadRequest("Aucun fichier reçu.");
            if (file.Length > MaxFileSize)
                return BadRequest("Fichier trop volumineux (max 10 Mo).");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(ext))
                return BadRequest("Type de fichier non autorisé.");

            if (!await _db.Users.AnyAsync(u => u.Id == receiverId) || receiverId == myId)
                return BadRequest("Destinataire introuvable.");

            // Stocké hors wwwroot avec un nom GUID : jamais accessible publiquement,
            // uniquement via le handler Download qui vérifie l'autorisation.
            Directory.CreateDirectory(UploadsDir);
            var storedName = Guid.NewGuid().ToString("N") + ext;
            var fullPath = Path.Combine(UploadsDir, storedName);
            await using (var fs = System.IO.File.Create(fullPath))
            {
                await file.CopyToAsync(fs);
            }

            var message = new Message
            {
                SenderId = myId,
                ReceiverId = receiverId,
                Content = string.Empty,
                AttachmentPath = storedName,
                AttachmentName = Path.GetFileName(file.FileName),
                AttachmentContentType = GetContentType(ext),
                AttachmentSize = file.Length
            };
            _db.Messages.Add(message);
            await _db.SaveChangesAsync();

            var dto = new
            {
                id = message.Id,
                senderId = message.SenderId,
                receiverId = message.ReceiverId,
                content = (string?)null,
                sentAt = message.SentAt,
                isDeleted = false,
                attachmentName = message.AttachmentName,
                attachmentContentType = message.AttachmentContentType,
                reactions = Array.Empty<object>()
            };

            // Livraison temps réel au destinataire via le hub
            await _hub.Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", dto);

            return new JsonResult(dto);
        }

        // Téléchargement : seul l'expéditeur ou le destinataire du message y a accès
        public async Task<IActionResult> OnGetDownloadAsync(int messageId)
        {
            var myId = CurrentUserId;

            var message = await _db.Messages.FirstOrDefaultAsync(m => m.Id == messageId);
            if (message == null || message.IsDeleted || message.AttachmentPath == null)
                return NotFound();
            if (message.SenderId != myId && message.ReceiverId != myId)
                return Forbid();

            var fullPath = Path.Combine(UploadsDir, message.AttachmentPath);
            if (!System.IO.File.Exists(fullPath))
                return NotFound();

            var contentType = message.AttachmentContentType ?? "application/octet-stream";

            // Images : affichées dans la conversation ; autres fichiers : téléchargés
            if (contentType.StartsWith("image/"))
                return PhysicalFile(fullPath, contentType);
            return PhysicalFile(fullPath, contentType, message.AttachmentName);
        }
    }
}
