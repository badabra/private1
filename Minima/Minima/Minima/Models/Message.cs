namespace Minima.Models
{
    // MSG-01/02/03/04 : message privé entre deux utilisateurs (texte et/ou fichier)
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;   // suppression douce (MSG-03)

        // MSG-04 : pièce jointe (fichier stocké hors wwwroot, servi via un handler autorisé)
        public string? AttachmentPath { get; set; }         // nom de fichier stocké (GUID + extension)
        public string? AttachmentName { get; set; }         // nom original affiché
        public string? AttachmentContentType { get; set; }  // déduit de l'extension côté serveur
        public long? AttachmentSize { get; set; }

        public User Sender { get; set; } = null!;
        public User Receiver { get; set; } = null!;
        public List<MessageReaction> Reactions { get; set; } = new();
    }
}
