import { Post } from '../models/Post.js';

/** GET /api/blogs — liste des articles (sans le corps complet), les plus récents d'abord. */
export async function listPosts(req, res) {
  const posts = await Post.find()
    .populate('author', 'username')
    .select('title author comments createdAt updatedAt')
    .sort({ createdAt: -1 });
  // On expose seulement le nombre de commentaires dans la liste.
  const summary = posts.map((p) => ({
    _id: p._id,
    title: p.title,
    author: p.author,
    commentCount: p.comments.length,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
  return res.json(summary);
}

/** POST /api/blogs — publie un nouvel article. */
export async function createPost(req, res) {
  const { title, body } = req.body || {};
  if (!title || !title.trim() || !body || !body.trim()) {
    return res.status(400).json({ error: 'Titre et contenu sont requis.' });
  }

  const post = await Post.create({
    author: req.userId,
    title: title.trim(),
    body: body.trim(),
  });
  await post.populate('author', 'username');
  return res.status(201).json(post);
}

/** GET /api/blogs/:id — article complet avec ses commentaires. */
export async function getPost(req, res) {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username')
    .populate('comments.author', 'username');
  if (!post) {
    return res.status(404).json({ error: 'Article introuvable.' });
  }
  return res.json(post);
}

/** POST /api/blogs/:id/comments — ajoute un commentaire à un article. */
export async function addComment(req, res) {
  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Le commentaire ne peut pas être vide.' });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Article introuvable.' });
  }

  post.comments.push({ author: req.userId, text: text.trim() });
  await post.save();
  await post.populate('author', 'username');
  await post.populate('comments.author', 'username');
  return res.status(201).json(post);
}
