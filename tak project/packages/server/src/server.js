import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 4000;

async function main() {
  await connectDB(process.env.MONGODB_URI);
  console.log('Connecté à MongoDB.');

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`API TakHub à l'écoute sur http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Échec du démarrage du serveur :', err.message);
  process.exit(1);
});
