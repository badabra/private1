import mongoose from 'mongoose';

/** Connecte Mongoose à MongoDB Atlas (ou à un serveur en mémoire si MONGODB_URI est absent). */
export async function connectDB(uri) {
  if (!uri) {
    // Mode développement sans Atlas : base en mémoire volatile (données perdues au redémarrage)
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({ binary: { version: '7.0.14', arch: 'x64' } });
    const memUri = mongod.getUri();
    console.warn('⚠️  MONGODB_URI absent — base en mémoire (dev uniquement, données non persistées).');
    await mongoose.connect(memUri);
    return mongoose.connection;
  }
  await mongoose.connect(uri);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
