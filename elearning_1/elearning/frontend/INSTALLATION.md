# Installation du front-end (Palier 1)

```bash
npm create vue@latest elearning-front
# Choisir : Router = Yes, Pinia = Yes (le reste : No)
cd elearning-front
npm install axios

# Copier les fichiers de ce dossier frontend/src/ dans elearning-front/src/
npm run dev   # http://localhost:5173
```

Le back-end doit tourner sur http://127.0.0.1:8000.
Si erreur CORS : dans Laravel, config/cors.php -> 'allowed_origins' => ['http://localhost:5173'].
