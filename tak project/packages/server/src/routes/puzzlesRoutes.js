import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { listPuzzles, getPuzzle, attemptPuzzle } from '../controllers/puzzlesController.js';

export const puzzlesRouter = Router();

// Bibliothèque de puzzles ouverte à tous (résolution sans authentification).
puzzlesRouter.get('/', asyncHandler(listPuzzles));
puzzlesRouter.get('/:id', asyncHandler(getPuzzle));
puzzlesRouter.post('/:id/attempt', asyncHandler(attemptPuzzle));
