// ponytail: minimal IndexedDB wrapper via idb — one store, no migrations needed for Phase 1
import { openDB } from 'idb';

const DB_NAME = 'statusgiziku';
const STORE_NAME = 'records';
const DB_VERSION = 1;

let dbPromise;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllRecords() {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function addRecord(record) {
  const db = await getDb();
  const data = { ...record, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  const id = await db.add(STORE_NAME, data);
  return { ...data, id };
}

export async function updateRecord(record) {
  const db = await getDb();
  const data = { ...record, updatedAt: new Date().toISOString() };
  await db.put(STORE_NAME, data);
  return data;
}

export async function deleteRecord(id) {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

export async function getRecord(id) {
  const db = await getDb();
  return db.get(STORE_NAME, id);
}
