using System.Collections.Concurrent;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Minima.Data;
using Minima.Models;

namespace Minima.Hubs
{
    // Hub SignalR : messagerie en temps réel (Sprint 2)
    // L'utilisateur est identifié par la claim NameIdentifier du jeton JWT (cookie auth_token).
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _db;

        // Utilisateurs en ligne : userId -> nombre de connexions actives (onglets)
        private static readonly ConcurrentDictionary<int, int> _online = new();

        public ChatHub(ApplicationDbContext db)
        {
            _db = db;
        }

        private int CurrentUserId =>
            int.Parse(Context.User!.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // MSG-06 : statut en ligne / hors ligne
        public override async Task OnConnectedAsync()
        {
            var userId = CurrentUserId;
            var count = _online.AddOrUpdate(userId, 1, (_, c) => c + 1);
            if (count == 1)
                await Clients.All.SendAsync("UserOnline", userId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = CurrentUserId;
            var count = _online.AddOrUpdate(userId, 0, (_, c) => c - 1);
            if (count <= 0)
            {
                _online.TryRemove(userId, out _);
                await Clients.All.SendAsync("UserOffline", userId);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public List<int> GetOnlineUsers() => _online.Keys.ToList();

        // MSG-01 (envoi) + MSG-02 (réception en temps réel)
        public async Task<object> SendMessage(int receiverId, string content)
        {
            var senderId = CurrentUserId;
            content = (content ?? string.Empty).Trim();

            if (content.Length == 0 || content.Length > 2000)
                throw new HubException("Message vide ou trop long (max 2000 caractères).");

            if (!await _db.Users.AnyAsync(u => u.Id == receiverId))
                throw new HubException("Destinataire introuvable.");

            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
                SentAt = DateTime.UtcNow
            };
            _db.Messages.Add(message);
            await _db.SaveChangesAsync();

            var dto = new
            {
                id = message.Id,
                senderId = message.SenderId,
                receiverId = message.ReceiverId,
                content = message.Content,
                sentAt = message.SentAt,
                isDeleted = false,
                attachmentName = (string?)null,
                attachmentContentType = (string?)null,
                reactions = Array.Empty<object>()
            };

            // Livraison instantanée au destinataire (toutes ses connexions)
            await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", dto);

            // Renvoyé à l'expéditeur pour affichage immédiat
            return dto;
        }

        // MSG-03 : suppression douce, seul l'expéditeur peut supprimer son message
        public async Task DeleteMessage(int messageId)
        {
            var userId = CurrentUserId;
            var message = await _db.Messages.FirstOrDefaultAsync(m => m.Id == messageId);

            if (message == null || message.SenderId != userId)
                throw new HubException("Suppression non autorisée.");

            message.IsDeleted = true;
            await _db.SaveChangesAsync();

            await Clients.Users(message.SenderId.ToString(), message.ReceiverId.ToString())
                .SendAsync("MessageDeleted", message.Id);
        }

        // MSG-06 : indicateur « en train d'écrire »
        public async Task Typing(int receiverId)
        {
            await Clients.User(receiverId.ToString()).SendAsync("Typing", CurrentUserId);
        }

        // MSG-05 : réagir à un message avec un émoji (clic = ajouter, re-clic = retirer)
        private static readonly string[] AllowedEmojis = { "👍", "❤️", "😂", "😮", "😢" };

        public async Task ToggleReaction(int messageId, string emoji)
        {
            if (!AllowedEmojis.Contains(emoji))
                throw new HubException("Émoji non autorisé.");

            var userId = CurrentUserId;
            var message = await _db.Messages
                .FirstOrDefaultAsync(m => m.Id == messageId && !m.IsDeleted);

            if (message == null || (message.SenderId != userId && message.ReceiverId != userId))
                throw new HubException("Réaction non autorisée.");

            var existing = await _db.MessageReactions.FirstOrDefaultAsync(r =>
                r.MessageId == messageId && r.UserId == userId && r.Emoji == emoji);

            if (existing != null)
                _db.MessageReactions.Remove(existing);
            else
                _db.MessageReactions.Add(new MessageReaction
                {
                    MessageId = messageId,
                    UserId = userId,
                    Emoji = emoji
                });

            await _db.SaveChangesAsync();

            // État agrégé des réactions du message, envoyé aux deux participants
            var all = await _db.MessageReactions
                .Where(r => r.MessageId == messageId)
                .ToListAsync();
            var reactions = all
                .GroupBy(r => r.Emoji)
                .Select(g => new { emoji = g.Key, count = g.Count(), users = g.Select(x => x.UserId).ToArray() })
                .ToList();

            await Clients.Users(message.SenderId.ToString(), message.ReceiverId.ToString())
                .SendAsync("ReactionsUpdated", new { messageId, reactions });
        }
    }
}
