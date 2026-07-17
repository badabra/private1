import { useEffect, useState } from 'react';
import { PLAYER_WHITE } from '@takhub/tak-engine';
import { api } from '../services/api.js';

// Rendu 2D léger d'une position Tak (sommet de chaque pile). Le composant
// Board3D du jeu est trop lourd pour une simple vignette de puzzle.
function PuzzleBoard({ position }) {
  const { size, board } = position;
  const columns = 'abcdefgh'.slice(0, size).split('');
  // board[row][col] : row 0 = rang 1. On affiche du rang le plus haut au plus bas.
  const rows = [...Array(size).keys()].reverse();

  return (
    <div className="inline-block">
      {rows.map((row) => (
        <div key={row} className="flex">
          {columns.map((col, colIdx) => {
            const stack = board[row][colIdx];
            const top = stack[stack.length - 1];
            return (
              <div
                key={col}
                className="w-10 h-10 border border-amber-900/40 flex items-center justify-center text-xs font-bold"
                style={{ background: (row + colIdx) % 2 === 0 ? '#d9b382' : '#c19a6b' }}
                title={`${col}${row + 1}`}
              >
                {top && (
                  <span
                    className={top.color === PLAYER_WHITE ? 'text-white' : 'text-black'}
                    style={{ textShadow: '0 0 2px rgba(0,0,0,0.5)' }}
                  >
                    {top.type}
                    {stack.length > 1 ? stack.length : ''}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function PuzzlesPage() {
  const [puzzles, setPuzzles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [move, setMove] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listPuzzles().then(setPuzzles).catch((err) => setError(err.message));
  }, []);

  async function openPuzzle(id) {
    setError('');
    setResult(null);
    setMove('');
    try {
      setSelected(await api.getPuzzle(id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAttempt() {
    setError('');
    try {
      setResult(await api.attemptPuzzle(selected._id, move.trim()));
    } catch (err) {
      setError(err.message);
    }
  }

  if (selected) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)} className="text-sm text-tak-board hover:underline">
          &larr; Retour à la liste
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="bg-white border rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-tak-board">Puzzle {selected.key}</h1>
            <p className="text-sm text-gray-600">
              {selected.size}x{selected.size} — Trait aux {selected.toMove === PLAYER_WHITE ? 'Blancs' : 'Noirs'} — forcer le gain en {selected.mateIn} coup(s)
            </p>
          </div>

          <PuzzleBoard position={selected.position} />

          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={move}
              onChange={(e) => setMove(e.target.value)}
              placeholder="Votre coup (PTN), ex. c3 ou 3c3>21"
              className="flex-1 border rounded-md px-2 py-1 text-sm"
            />
            <button onClick={handleAttempt} className="bg-tak-board text-white rounded-md px-4 py-2 text-sm font-semibold hover:opacity-90">
              Valider
            </button>
          </div>

          {result && (
            <p className={`text-sm font-medium ${result.correct ? 'text-green-700' : 'text-red-600'}`}>
              {result.correct
                ? `Bravo ! Solution : ${result.solution.join(' ')}`
                : `Raté — ${result.reason}`}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-tak-board">Puzzles</h1>
      <p className="text-gray-600 text-sm">
        Positions à résoudre, générées à partir de vraies parties et validées par le moteur de jeu.
      </p>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        {puzzles.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun puzzle disponible pour le moment.</p>
        ) : (
          <ul className="divide-y">
            {puzzles.map((p) => (
              <li key={p._id} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">
                  <span className="font-medium">{p.key}</span> — {p.size}x{p.size} · mat en {p.mateIn}
                </span>
                <button onClick={() => openPuzzle(p._id)} className="border rounded-md px-3 py-1 text-sm hover:bg-gray-50">
                  Résoudre
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
