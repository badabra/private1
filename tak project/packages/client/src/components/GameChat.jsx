import { useEffect, useRef, useState } from 'react';
import { api, getToken } from '../services/api.js';

const POLL_INTERVAL_MS = 3000;

/** Chat d'une partie : lecture publique, écriture réservée aux connectés.
 * Rafraîchi par polling (même filet de sécurité que le reste de la partie). */
export default function GameChat({ gameId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const listRef = useRef(null);
  const loggedIn = !!getToken();

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const data = await api.listMessages(gameId);
        if (active) setMessages(data);
      } catch {
        // rafraîchissement silencieux
      }
    }
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [gameId]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setError('');
    try {
      const msg = await api.postMessage(gameId, trimmed);
      setMessages((prev) => [...prev, msg]);
      setText('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm space-y-2">
      <p className="text-sm font-medium text-gray-700">Chat</p>
      <div ref={listRef} className="max-h-48 overflow-y-auto space-y-1 text-sm">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun message.</p>
        ) : (
          messages.map((m) => (
            <p key={m._id} className="text-gray-800">
              <span className="font-semibold text-tak-board">{m.author?.username ?? '?'} :</span> {m.text}
            </p>
          ))
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {loggedIn ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Votre message..."
            className="flex-1 border rounded-md px-2 py-1 text-sm"
          />
          <button onClick={handleSend} className="border rounded-md px-3 py-1 text-sm hover:bg-gray-50">
            Envoyer
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-500">Connectez-vous pour discuter.</p>
      )}
    </div>
  );
}
