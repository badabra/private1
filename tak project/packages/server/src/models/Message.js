import mongoose from 'mongoose';

// Message de chat rattaché à une partie (Sprint 3 — Communauté).
const messageSchema = new mongoose.Schema(
  {
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
