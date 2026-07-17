import mongoose from 'mongoose';

// Groupe thématique de la communauté (Sprint 3 — Communauté).
const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 60 },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  },
  { timestamps: true }
);

export const Group = mongoose.model('Group', groupSchema);
