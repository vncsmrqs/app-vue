import { openDB } from 'idb';

const DB_NAME = 'auth-db';
const STORE_NAME = 'session';

interface SessionData {
  accessToken: string;
  refreshToken: string;
  simulatedUserToken?: string;
}

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveSession(data: SessionData) {
  const db = await getDB();
  await db.put(STORE_NAME, data, 'tokens');
}

export async function getSession(): Promise<SessionData | null> {
  const db = await getDB();
  return (await db.get(STORE_NAME, 'tokens')) || null;
}

export async function clearSession() {
  const db = await getDB();
  await db.delete(STORE_NAME, 'tokens');
}
