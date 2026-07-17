import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { seedPuzzlesIfEmpty } from '../controllers/puzzlesController.js';

/**
 * Amorce la collection de puzzles dans la base configurée (MONGODB_URI).
 * Utilisation : `npm run seed:puzzles --workspace=@takhub/server`.
 * Idempotent : ne fait rien si des puzzles existent déjà.
 */
async function main() {
  await connectDB(process.env.MONGODB_URI);
  const total = await seedPuzzlesIfEmpty();
  console.log(`Bibliothèque de puzzles : ${total} puzzle(s) au total.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Échec du seed des puzzles :', err);
  process.exit(1);
});
