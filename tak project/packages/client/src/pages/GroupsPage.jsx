import { useEffect, useState } from 'react';
import { api, getToken } from '../services/api.js';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const loggedIn = !!getToken();

  useEffect(() => {
    refreshList();
  }, []);

  async function refreshList() {
    try {
      setGroups(await api.listGroups());
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreate() {
    setError('');
    try {
      await api.createGroup({ name, description });
      setName('');
      setDescription('');
      await refreshList();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleJoin(id) {
    setError('');
    try {
      await api.joinGroup(id);
      await refreshList();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLeave(id) {
    setError('');
    try {
      await api.leaveGroup(id);
      await refreshList();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-tak-board">Groupes</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {loggedIn ? (
        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-3">
          <h2 className="font-semibold">Créer un groupe</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du groupe"
            className="w-full border rounded-md px-2 py-1"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnelle)"
            rows={2}
            className="w-full border rounded-md px-2 py-1"
          />
          <button onClick={handleCreate} className="bg-tak-board text-white rounded-md px-4 py-2 font-semibold hover:opacity-90">
            Créer
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Connectez-vous pour créer ou rejoindre un groupe.</p>
      )}

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Groupes thématiques</h2>
        {groups.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun groupe pour le moment.</p>
        ) : (
          <ul className="divide-y">
            {groups.map((g) => (
              <li key={g._id} className="flex items-start justify-between py-3 gap-4">
                <div>
                  <p className="font-medium text-tak-board">{g.name}</p>
                  {g.description && <p className="text-sm text-gray-600">{g.description}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {g.members.length} membre(s) — créé par {g.owner?.username ?? '?'}
                  </p>
                </div>
                {loggedIn && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleJoin(g._id)} className="border rounded-md px-3 py-1 text-sm hover:bg-gray-50">
                      Rejoindre
                    </button>
                    <button onClick={() => handleLeave(g._id)} className="border rounded-md px-3 py-1 text-sm hover:bg-gray-50">
                      Quitter
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
