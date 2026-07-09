namespace Minima.Models
{
    // CONTACT-02 : lien "X a ajouté Y à ses contacts"
    public class Contact
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }         // celui qui ajoute
        public int ContactUserId { get; set; }   // celui qui est ajouté
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User Owner { get; set; } = null!;
        public User ContactUser { get; set; } = null!;
    }
}
