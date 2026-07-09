import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const db = config.apiKey && config.projectId ? getFirestore(initializeApp(config)) : null;

/**
 * S'abonne aux mises à jour temps réel d'une partie via Firestore.
 * Si Firebase n'est pas configuré (clés manquantes), ne fait rien et
 * retourne un no-op : le polling REST de GamePage reste alors le seul
 * mécanisme de mise à jour, ce qui garantit que l'appli fonctionne même
 * sans configuration Firebase.
 */
export function subscribeToGame(gameId, onUpdate) {
  if (!db) return () => {};
  return onSnapshot(doc(db, 'games', gameId), (snapshot) => {
    if (snapshot.exists()) onUpdate(snapshot.data());
  });
}
