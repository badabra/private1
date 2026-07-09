import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RESULT } from '@takhub/tak-engine';
import { api, getToken } from '../services/api.js';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) return;
    api.me().then((data) => setUser(data.user)).catch((err) => setError(err.message));
    api.listMyGames().then(setGames).catch((err) => setError(err.message));
  }, []);

  if (!getToken()) {
    return (
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-tak-board mb-2">Profil</h1>
        <p className="text-gray-600">Connectez-vous pour voir votre profil et l'historique de vos parties.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-tak-board">Profil</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {user && (
        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-1">
          <p className="font-semibold">{user.username}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <div className="flex gap-4 text-sm mt-2">
            <span className="text-green-700">Victoires : {user.stats.wins}</span>
            <span className="text-red-700">Défaites : {user.stats.losses}</span>
            <span className="text-gray-600">Nulles : {user.stats.draws}</span>
          </div>
        </div>
      )}

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Historique des parties</h2>
        {games.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune partie jouée pour le moment.</p>
        ) : (
          <ul className="divide-y">
            {games.map((g) => (
              <li key={g._id} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">
                  {g.size}x{g.size} — {g.players.white?.username ?? '?'} vs {g.players.black?.username ?? '?'}
                  {' — '}
                  <span className="font-medium">{outcomeFor(g, user)}</span>
                </span>
                <button onClick={() => navigate(`/partie/${g._id}`)} className="border rounded-md px-3 py-1 text-sm hover:bg-gray-50">
                  Voir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function outcomeFor(game, user) {
  if (game.status !== 'finished') return 'En cours';
  if (game.result === RESULT.DRAW) return 'Match nul';

  const isWhite = game.players.white?._id === user._id;
  const whiteWon = game.result === RESULT.ROAD_WHITE || game.result === RESULT.FLAT_WHITE;
  const won = isWhite ? whiteWon : !whiteWon;
  return won ? 'Victoire' : 'Défaite';
}
