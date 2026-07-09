import { PLAYER_WHITE, VALID_SIZES, RESULT } from '@takhub/tak-engine';
import MovePanel from './MovePanel.jsx';

const RESULT_LABELS = {
  [RESULT.ROAD_WHITE]: 'Victoire par route — Blanc',
  [RESULT.ROAD_BLACK]: 'Victoire par route — Noir',
  [RESULT.FLAT_WHITE]: 'Victoire aux plats — Blanc',
  [RESULT.FLAT_BLACK]: 'Victoire aux plats — Noir',
  [RESULT.DRAW]: 'Match nul',
};

export default function Controls({
  state,
  size,
  onSizeChange,
  onNewGame,
  placeType,
  setPlaceType,
  selected,
  hand,
  spread,
  pending,
  onCancelSelection,
  ptnInput,
  setPtnInput,
  onPlayPtn,
  ptnError,
  history,
}) {
  const isOver = state.result !== RESULT.ONGOING;
  const turnLabel = state.turn === PLAYER_WHITE ? 'Blanc' : 'Noir';
  const reserves = state.reserves[state.turn];

  return (
    <div className="space-y-4 w-full max-w-sm">
      <div className="bg-white border rounded-lg p-4 shadow-sm space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Taille du plateau
          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="mt-1 w-full border rounded-md px-2 py-1"
          >
            {VALID_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} x {s}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={onNewGame}
          className="w-full bg-tak-board text-white rounded-md py-2 font-semibold hover:opacity-90"
        >
          Nouvelle partie
        </button>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm space-y-2">
        {isOver ? (
          <p className="font-semibold text-tak-board">
            Partie terminée : {RESULT_LABELS[state.result] ?? state.result}
          </p>
        ) : (
          <p>
            Au tour de : <span className="font-semibold">{turnLabel}</span>
          </p>
        )}
        <p className="text-sm text-gray-600">
          Réserves : {reserves.stones} pierre(s), {reserves.capstones} capstone(s)
        </p>
        {!isOver && state.history.length < 2 && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
            ⚠ Règle d'échange : {state.history.length === 0 ? 'Blanc' : 'Noir'} doit placer une pierre{' '}
            <strong>{state.history.length === 0 ? 'Noire' : 'Blanche'}</strong> (pierre adverse) pour ce premier coup.
          </p>
        )}
      </div>

      {!isOver && (
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <MovePanel
            placeType={placeType}
            setPlaceType={setPlaceType}
            selected={selected}
            hand={hand}
            spread={spread}
            pending={pending}
            onCancelSelection={onCancelSelection}
          />
        </div>
      )}

      <div className="bg-white border rounded-lg p-4 shadow-sm space-y-2">
        <p className="text-sm font-medium text-gray-700">Coup avancé (notation PTN)</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={ptnInput}
            onChange={(e) => setPtnInput(e.target.value)}
            placeholder="ex. 3c3&gt;21"
            className="flex-1 border rounded-md px-2 py-1 text-sm"
          />
          <button onClick={onPlayPtn} disabled={isOver} className="border rounded-md px-3 py-1 text-sm hover:bg-gray-50">
            Jouer
          </button>
        </div>
        {ptnError && <p className="text-sm text-red-600">{ptnError}</p>}
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-2">Historique des coups</p>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun coup joué.</p>
        ) : (
          <ol className="text-sm text-gray-700 list-decimal list-inside space-y-0.5 max-h-40 overflow-y-auto">
            {history.map((move, i) => (
              <li key={i}>{move}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
