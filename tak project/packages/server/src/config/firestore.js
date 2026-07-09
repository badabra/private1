import admin from 'firebase-admin';

let db = null;
let initialized = false;

/**
 * Initialise Firestore si les variables FIREBASE_* sont présentes dans
 * l'environnement, sinon retourne null. La synchronisation temps réel
 * devient alors un complément optionnel : le polling REST côté client reste
 * le mécanisme de repli garanti de fonctionner sans configuration Firebase.
 */
function getFirestoreDb() {
  if (initialized) return db;
  initialized = true;

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    return null;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
  db = admin.firestore();
  return db;
}

/** Pousse l'état courant d'une partie vers Firestore (best-effort, ne lève jamais). */
export async function syncGameToFirestore(game) {
  const firestoreDb = getFirestoreDb();
  if (!firestoreDb) return;

  try {
    await firestoreDb
      .collection('games')
      .doc(String(game._id))
      .set({
        state: game.state,
        status: game.status,
        result: game.result,
        updatedAt: Date.now(),
      });
  } catch (err) {
    console.error('Échec de la synchronisation Firestore :', err.message);
  }
}
