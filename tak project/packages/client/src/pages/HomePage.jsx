import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-tak-board mb-4">Bienvenue sur TakHub</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          La plateforme communautaire pour apprendre, jouer et discuter du jeu Tak —
          un jeu de stratégie abstrait à 2 joueurs créé par James Ernest et Patrick Rothfuss.
        </p>
        <Link
          to="/jouer"
          className="inline-block mt-6 px-6 py-3 bg-tak-board text-white rounded-md font-semibold hover:opacity-90"
        >
          Jouer en local
        </Link>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <FeatureCard
          title="Moteur Tak complet"
          description="Plateaux de 3x3 à 8x8, pièces plates, murs et capstones, détection de route et victoire aux plats."
        />
        <FeatureCard
          title="Notation PTN"
          description="Importez et exportez vos parties au format Portable Tak Notation."
        />
        <FeatureCard
          title="Communauté"
          description="Blogs, groupes, puzzles et discussions à venir dans les prochains sprints."
        />
      </section>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="font-semibold text-tak-board mb-2">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
