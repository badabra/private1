import { useEffect, useState } from 'react';
import { api, getToken } from '../services/api.js';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [comment, setComment] = useState('');
  const loggedIn = !!getToken();

  useEffect(() => {
    refreshList();
  }, []);

  async function refreshList() {
    try {
      setPosts(await api.listPosts());
    } catch (err) {
      setError(err.message);
    }
  }

  async function openPost(id) {
    setError('');
    try {
      setSelected(await api.getPost(id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreate() {
    setError('');
    try {
      await api.createPost({ title, body });
      setTitle('');
      setBody('');
      await refreshList();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleComment() {
    setError('');
    try {
      const updated = await api.addComment(selected._id, comment);
      setSelected(updated);
      setComment('');
      await refreshList();
    } catch (err) {
      setError(err.message);
    }
  }

  if (selected) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)} className="text-sm text-tak-board hover:underline">
          &larr; Retour aux articles
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <article className="bg-white border rounded-lg p-6 shadow-sm space-y-2">
          <h1 className="text-2xl font-bold text-tak-board">{selected.title}</h1>
          <p className="text-sm text-gray-500">
            par {selected.author?.username ?? '?'} — {new Date(selected.createdAt).toLocaleDateString()}
          </p>
          <p className="whitespace-pre-wrap text-gray-800">{selected.body}</p>
        </article>

        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-3">
          <h2 className="font-semibold">Commentaires ({selected.comments.length})</h2>
          {selected.comments.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun commentaire pour le moment.</p>
          ) : (
            <ul className="divide-y">
              {selected.comments.map((c) => (
                <li key={c._id} className="py-2">
                  <p className="text-sm text-gray-800">{c.text}</p>
                  <p className="text-xs text-gray-500">
                    {c.author?.username ?? '?'} — {new Date(c.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {loggedIn ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="flex-1 border rounded-md px-2 py-1 text-sm"
              />
              <button onClick={handleComment} className="border rounded-md px-3 py-1 text-sm hover:bg-gray-50">
                Commenter
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Connectez-vous pour commenter.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-tak-board">Blog</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {loggedIn ? (
        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-3">
          <h2 className="font-semibold">Écrire un article</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre"
            className="w-full border rounded-md px-2 py-1"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Contenu de l'article..."
            rows={5}
            className="w-full border rounded-md px-2 py-1"
          />
          <button onClick={handleCreate} className="bg-tak-board text-white rounded-md px-4 py-2 font-semibold hover:opacity-90">
            Publier
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Connectez-vous pour publier un article.</p>
      )}

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Articles</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun article pour le moment.</p>
        ) : (
          <ul className="divide-y">
            {posts.map((p) => (
              <li key={p._id} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">
                  <button onClick={() => openPost(p._id)} className="font-medium text-tak-board hover:underline">
                    {p.title}
                  </button>
                  <span className="text-gray-500"> — {p.author?.username ?? '?'} · {p.commentCount} commentaire(s)</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
