import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VALID_SIZES } from '@takhub/tak-engine';
import { api, getToken } from '../services/api.js';

export default function LobbyPage() {
  const navigate = useNavigate();
  const [size, setSize] = useState(5);
  const [visibility, setVisibility] = useState('public');
  const [publicGames, setPublicGames] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const loggedIn = !!getToken();

  useEffect(() => {
    refreshList();
    const interval = setInterval(refreshList, 4000);
    return () => clearInterval(interval);
  }, []);

  async function refreshList() {
    try {
      setPublicGames(await api.listPublicGames());
    } catch {
      // ignore les échecs de rafraîchissement silencieux
    }
  }

  async function handleCreate() {
    setError('');
    try {
      const game = await api.createGame({ size, visibility });
      if (game.visibility === 'private') {
        window.alert(`Code de la partie privée : ${game.joinCode}`);
      }
      navigate(`/partie/${game._id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleJoin(id) {
    setError('');
    try {
      await api.joinGame(id);
      navigate(`/partie/${id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleJoinByCode() {
    setError('');
    try {
      const game = await api.joinByCode(joinCode.trim());
      navigate(`/partie/${game._id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-tak-board">Jouer en ligne</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {loggedIn ? (
        <>
          <div className="bg-white border rounded-lg p-4 shadow-sm space-y-3">
            <h2 className="font-semibold">Créer une partie</h2>
            <div className="flex gap-3 flex-wrap items-end">
              <label className="block text-sm font-medium text-gray-700">
                Taille
                <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-1 border rounded-md px-2 py-1 block">
                  {VALID_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s} x {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Visibilité
                <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="mt-1 border rounded-md px-2 py-1 block">
                  <option value="public">Publique</option>
                  <option value="private">Privée (par code)</option>
                </select>
              </label>
              <button onClick={handleCreate} className="bg-tak-board text-white rounded-md px-4 py-2 font-semibold hover:opacity-90">
                Créer
              </button>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm space-y-3">
            <h2 className="font-semibold">Rejoindre par code</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="ex. A1B2C3"
                className="flex-1 border rounded-md px-2 py-1"
              />
              <button onClick={handleJoinByCode} className="border rounded-md px-4 py-2 hover:bg-gray-50">
                Rejoindre
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-gray-600">
            Connectez-vous pour créer ou rejoindre une partie. Vous pouvez tout de même regarder
            les parties publiques en cours ci-dessous, en mode spectateur.
          </p>
        </div>
      )}

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Parties publiques</h2>
        {publicGames.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune partie publique pour le moment.</p>
        ) : (
          <ul className="divide-y">
            {publicGames.map((g) => (
              <li key={g._id} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">
                  {g.size}x{g.size} — {g.players.white?.username ?? '?'}
                  {g.players.black ? ` vs ${g.players.black.username}` : ' (en attente d\'un adversaire)'}
                </span>
                {g.status === 'waiting' && loggedIn ? (
                  <button onClick={() => handleJoin(g._id)} className="border rounded-md px-3 py-1 text-sm hover:bg-gray-50">
                    Rejoindre
                  </button>
                ) : (
                  <button onClick={() => navigate(`/partie/${g._id}`)} className="border rounded-md px-3 py-1 text-sm hover:bg-gray-50">
                    Regarder
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
