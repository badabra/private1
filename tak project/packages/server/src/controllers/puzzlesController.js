import { TakGame } from '@takhub/tak-engine';
import { generateSamplePuzzles, isWinningMove } from '@takhub/puzzle-gen';
import { Puzzle } from '../models/Puzzle.js';

/**
 * Amorce la bibliothèque de puzzles à partir des parties d'exemple embarquées
 * dans @takhub/puzzle-gen si la collection est vide. Permet d'avoir des
 * puzzles jouables sans exécuter la CLI au préalable. Idempotent (upsert par
 * clé). En production, on remplacerait ce jeu d'exemple par un import de
 * puzzles générés à partir d'une vraie base de parties.
 */
export async function seedPuzzlesIfEmpty() {
  const count = await Puzzle.estimatedDocumentCount();
  if (count > 0) return count;

  const generated = generateSamplePuzzles();
  if (generated.length === 0) return 0;

  await Puzzle.bulkWrite(
    generated.map((p) => ({
      updateOne: {
        filter: { key: p.id },
        update: {
          $setOnInsert: {
            key: p.id,
            size: p.size,
            toMove: p.toMove,
            mateIn: p.mateIn,
            position: p.position,
            solution: p.solution,
            source: p.source,
          },
        },
        upsert: true,
      },
    }))
  );
  return Puzzle.estimatedDocumentCount();
}

/** GET /api/puzzles — liste des puzzles (sans la solution). */
export async function listPuzzles(req, res) {
  await seedPuzzlesIfEmpty();
  const puzzles = await Puzzle.find()
    .select('key size toMove mateIn createdAt')
    .sort({ mateIn: 1, createdAt: 1 });
  return res.json(puzzles);
}

/** GET /api/puzzles/:id — position d'un puzzle à résoudre (sans la solution). */
export async function getPuzzle(req, res) {
  const puzzle = await Puzzle.findById(req.params.id).select('-solution');
  if (!puzzle) {
    return res.status(404).json({ error: 'Puzzle introuvable.' });
  }
  return res.json(puzzle);
}

/**
 * POST /api/puzzles/:id/attempt — vérifie une tentative de résolution.
 * Body: { move: "<coup PTN>" }. Le moteur valide la légalité du coup puis
 * confirme s'il force effectivement le gain à la profondeur attendue.
 */
export async function attemptPuzzle(req, res) {
  const { move } = req.body || {};
  if (!move || !move.trim()) {
    return res.status(400).json({ error: 'Un coup est requis.' });
  }

  const puzzle = await Puzzle.findById(req.params.id);
  if (!puzzle) {
    return res.status(404).json({ error: 'Puzzle introuvable.' });
  }

  const engine = TakGame.fromState(puzzle.position);
  const trimmed = move.trim();

  // Vérifie d'abord la légalité en tentant le coup sur une copie.
  const probe = engine.clone();
  try {
    probe.play(trimmed);
  } catch (err) {
    return res.status(200).json({ correct: false, reason: `Coup illégal : ${err.message}` });
  }

  // Correct si le coup correspond à la solution enregistrée, ou s'il force lui
  // aussi le gain à la même profondeur (transposition acceptable).
  const matchesSolution = trimmed === puzzle.solution[0];
  const forcesWin = matchesSolution || Boolean(isWinningMove(engine, trimmed, puzzle.mateIn));

  if (forcesWin) {
    return res.json({ correct: true, solution: puzzle.solution });
  }
  return res.json({ correct: false, reason: 'Ce coup ne force pas le gain.' });
}
