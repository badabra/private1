import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/index.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api', apiRouter);

  // Gestion centralisée des erreurs.
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Erreur interne du serveur.' });
  });

  return app;
}
