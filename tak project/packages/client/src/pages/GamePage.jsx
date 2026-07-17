import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { PLAYER_WHITE, PLAYER_BLACK, RESULT } from '@takhub/tak-engine';
import { api } from '../services/api.js';
import { subscribeToGame } from '../services/firebase.js';
import Board from '../components/board/Board3D.jsx';
import MovePanel from '../components/board/MovePanel.jsx';
import GameChat from '../components/GameChat.jsx';
import { useTakMove } from '../hooks/useTakMove.js';

const POLL_INTERVAL_MS = 2000;

const RESULT_LABELS = {
  [RESULT.ROAD_WHITE]: 'Victoire par route — Blanc',
  [RESULT.ROAD_BLACK]: 'Victoire par route — Noir',
  [RESULT.FLAT_WHITE]: 'Victoire aux plats — Blanc',
  [RESULT.FLAT_BLACK]: 'Victoire aux plats — Noir',
  [RESULT.DRAW]: 'Match nul',
};

/** Page d'une partie en ligne : reçoit l'id de partie via l'URL, interroge le
 * serveur (qui fait autorité sur l'état) et affiche le plateau en lecture
 * seule pour les spectateurs ou jouable pour les deux participants. */
export default function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [ptnInput, setPtnInput] = useState('');

  useEffect(() => {
    api.me().then(setUser).catch(() => setUser(null));
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getGame(id);
      setGame(data);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  // Mise à jour instantanée via Firestore quand Firebase est configuré ; le
  // polling ci-dessus reste actif comme filet de sécurité dans tous les cas.
  useEffect(() => {
    return subscribeToGame(id, (data) => {
      setGame((prev) => (prev ? { ...prev, state: data.state, status: data.status, result: data.result } : prev));
    });
  }, [id]);

  const isWhite = !!(user && game?.players?.white?._id === user.user?._id);
  const isBlack = !!(user && game?.players?.black?._id === user.user?._id);
  const isParticipant = isWhite || isBlack;
  const myColor = isWhite ? PLAYER_WHITE : isBlack ? PLAYER_BLACK : null;
  const isMyTurn = isParticipant && game?.status === 'ongoing' && game.state.turn === myColor;

  // Envoie le coup au serveur (autorité) ; l'état revient par la réponse ou la
  // synchro Firestore. Retourne true si le coup a été accepté.
  const submitMove = useCallback(
    async (moveStr) => {
      setError('');
      try {
        const updated = await api.playMove(id, moveStr);
        setGame(updated);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      }
    },
    [id]
  );

  // État de repli tant que la partie n'est pas chargée, pour garder l'ordre des
  // hooks stable (le hook de coup doit toujours être appelé).
  const boardState = game?.state ?? { size: 5, board: [], turn: PLAYER_WHITE, result: 'ONGOING' };

  const move = useTakMove({
    state: boardState,
    canAct: isMyTurn,
    commitMove: submitMove,
  });

  function handlePlayPtn() {
    const trimmed = ptnInput.trim();
    if (!trimmed) return;
    submitMove(trimmed).then((ok) => {
      if (ok) {
        setPtnInput('');
        move.clearSelection();
      }
    });
  }

  if (!game) {
    return <p className="text-gray-600">Chargement de la partie...</p>;
  }

  const isOver = game.status === 'finished';
  const whiteName = game.players.white?.username ?? 'En attente...';
  const blackName = game.players.black?.username ?? 'En attente...';

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex-1 flex justify-center">
        <Board
          state={game.state}
          selected={move.selected}
          legalTargets={move.legalTargets}
          onSquareClick={move.handleSquareClick}
          pending={move.pending}
          onPickCount={move.handlePickCount}
          onCancelDrop={move.handleCancelPicker}
        />
      </div>

      <div className="space-y-4 w-full max-w-sm">
        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-1">
          <p>
            <span className="font-semibold">Blanc :</span> {whiteName}
          </p>
          <p>
            <span className="font-semibold">Noir :</span> {blackName}
          </p>
          {!isParticipant && (
            <p className="text-sm text-gray-500 italic">Mode spectateur (lecture seule)</p>
          )}
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-2">
          {isOver ? (
            <p className="font-semibold text-tak-board">
              Partie terminée : {RESULT_LABELS[game.result] ?? game.result}
            </p>
          ) : game.status === 'waiting' ? (
            <p className="text-gray-600">En attente d'un second joueur...</p>
          ) : (
            <p>
              Au tour de : <span className="font-semibold">{game.state.turn === PLAYER_WHITE ? 'Blanc' : 'Noir'}</span>
              {isParticipant && !isMyTurn && <span className="text-sm text-gray-500"> (pas votre tour)</span>}
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {isMyTurn && (
          <div className="bg-white border rounded-lg p-4 shadow-sm space-y-3">
            <MovePanel
              placeType={move.placeType}
              setPlaceType={move.setPlaceType}
              selected={move.selected}
              hand={move.hand}
              spread={move.spread}
              pending={move.pending}
              onCancelSelection={move.clearSelection}
            />

            <div className="flex gap-2">
              <input
                type="text"
                value={ptnInput}
                onChange={(e) => setPtnInput(e.target.value)}
                placeholder="Coup avancé (PTN), ex. 3c3>21"
                className="flex-1 border rounded-md px-2 py-1 text-sm"
              />
              <button onClick={handlePlayPtn} className="border rounded-md px-3 py-1 text-sm hover:bg-gray-50">
                Jouer
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-2">Historique des coups</p>
          {game.state.history.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun coup joué.</p>
          ) : (
            <ol className="text-sm text-gray-700 list-decimal list-inside space-y-0.5 max-h-40 overflow-y-auto">
              {game.state.history.map((mv, i) => (
                <li key={i}>{mv}</li>
              ))}
            </ol>
          )}
        </div>

        <GameChat gameId={id} />
      </div>
    </div>
  );
}
