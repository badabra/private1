import mongoose from 'mongoose';

// Commentaire imbriqué dans un article de blog.
const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// Article de blog avec ses commentaires (Sprint 3 — Communauté).
const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 140 },
    body: { type: String, required: true, trim: true, maxlength: 20000 },
    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true }
);

export const Post = mongoose.model('Post', postSchema);
