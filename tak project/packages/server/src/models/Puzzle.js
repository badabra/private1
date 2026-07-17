import mongoose from 'mongoose';
import { VALID_SIZES } from '@takhub/tak-engine';

// Puzzle Tak (position à résoudre), généré par @takhub/puzzle-gen puis
// persisté pour être servi au client (Sprint 3 — Communauté).
const puzzleSchema = new mongoose.Schema(
  {
    // Identifiant stable issu du générateur (ex. "g0-mate-in-1-p6"), sert de
    // clé d'upsert pour ne pas dupliquer les puzzles à chaque amorçage.
    key: { type: String, required: true, unique: true },
    size: { type: Number, required: true, enum: VALID_SIZES },
    toMove: { type: Number, required: true },
    mateIn: { type: Number, required: true },
    // Snapshot de l'état du moteur (board, réserves, tour, etc.).
    position: { type: mongoose.Schema.Types.Mixed, required: true },
    // Ligne gagnante en notation PTN. Jamais renvoyée au client tant qu'il
    // n'a pas résolu (voir puzzlesController).
    solution: { type: [String], required: true },
    source: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export const Puzzle = mongoose.model('Puzzle', puzzleSchema);
