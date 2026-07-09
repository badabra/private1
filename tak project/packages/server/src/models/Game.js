import mongoose from 'mongoose';
import { VALID_SIZES, RESULT } from '@takhub/tak-engine';

const gameSchema = new mongoose.Schema(
  {
    size: { type: Number, required: true, enum: VALID_SIZES },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    joinCode: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ['waiting', 'ongoing', 'finished'], default: 'waiting' },
    result: { type: String, default: RESULT.ONGOING },
    players: {
      white: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      black: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
    // Snapshot complet de l'état du moteur (board, réserves, tour, etc.)
    state: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Game = mongoose.model('Game', gameSchema);
