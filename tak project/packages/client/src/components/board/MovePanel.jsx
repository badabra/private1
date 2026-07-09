import { FLAT, WALL, CAP } from '@takhub/tak-engine';

const PIECE_LABELS = {
  [FLAT]: 'Plat',
  [WALL]: 'Mur',
  [CAP]: 'Capstone',
};

/**
 * Panneau d'aide au coup, partagé entre le jeu local et en ligne. Il est
 * entièrement piloté par l'état du hook `useTakMove` : choix du type de pièce
 * quand rien n'est sélectionné, puis suivi de la prise/des dépôts pendant un
 * déplacement (la bulle de choix du nombre s'affiche, elle, sur le plateau).
 */
export default function MovePanel({
  placeType,
  setPlaceType,
  selected,
  hand,
  spread,
  pending,
  onCancelSelection,
}) {
  return (
    <div className="space-y-2">
      {/* Aucune sélection : le plateau décide de l'action ; ici on choisit
          seulement le type de la prochaine pièce posée. */}
      {!selected && (
        <>
          <p className="text-sm font-medium text-gray-700">Type de pièce à placer</p>
          <div className="flex gap-2">
            {[FLAT, WALL, CAP].map((type) => (
              <PieceButton
                key={type}
                label={PIECE_LABELS[type]}
                active={placeType === type}
                onClick={() => setPlaceType(type)}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Cliquez une case vide pour y placer une pièce, ou une de vos piles pour la déplacer.
          </p>
        </>
      )}

      {/* Une pile est sélectionnée : un déplacement est en cours. */}
      {selected && (
        <>
          {/* Étape 1 : la bulle demande combien de pièces prendre */}
          {pending?.type === 'pickup' && (
            <p className="text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
              Choisissez dans la bulle combien de pièces <strong>prendre</strong> de{' '}
              <span className="font-semibold">{pending.cell}</span> (max {pending.max}).
            </p>
          )}

          {/* Étape 2 : main prête, choisir la première destination */}
          {hand != null && !spread && !pending && (
            <>
              <p className="text-sm text-gray-700">
                En main : <span className="font-semibold">{hand}</span> pièce(s) depuis{' '}
                <span className="font-semibold">{selected}</span>
              </p>
              <p className="text-xs text-gray-500">
                Cliquez une case verte adjacente pour choisir combien y poser. Toutes les pièces en
                main devront être posées (règle du jeu).
              </p>
            </>
          )}

          {/* Récapitulatif des dépôts confirmés */}
          {spread && spread.drops.length > 0 && (
            <p className="text-sm text-gray-700">
              Dépôts :{' '}
              <span className="font-mono font-semibold">
                {spread.path.map((sq, i) => `${sq}×${spread.drops[i]}`).join('  ')}
              </span>
            </p>
          )}

          {/* Étape 3 : la bulle demande combien poser sur la case cliquée */}
          {pending?.type === 'drop' && (
            <p className="text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
              Choisissez dans la bulle combien de pièces <strong>poser</strong> sur{' '}
              <span className="font-semibold">{pending.cell}</span> (max {pending.max}).
            </p>
          )}

          {/* Entre deux dépôts : continuer en ligne jusqu'à vider la main */}
          {spread && spread.drops.length > 0 && !pending && hand > 0 && (
            <p className="text-xs text-gray-500">
              Encore <span className="font-semibold">{hand}</span> pièce(s) en main — cliquez la case
              suivante en ligne pour continuer (la dernière se pose toute seule).
            </p>
          )}

          <button onClick={onCancelSelection} className="text-sm text-gray-500 underline">
            Tout annuler
          </button>
        </>
      )}
    </div>
  );
}

function PieceButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-md py-1 text-sm font-medium border ${
        active ? 'bg-tak-board text-white border-tak-board' : 'hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
