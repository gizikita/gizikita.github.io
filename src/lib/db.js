// ponytail: minimal IndexedDB wrapper via idb — one store, no migrations needed for Phase 1
import { openDB } from 'idb';

const DB_NAME = 'gizikita';
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

// Hapus semua records
export async function deleteAllRecords() {
  const db = await getDb();
  const all = await db.getAll(STORE_NAME);
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await Promise.all(all.map(r => tx.store.delete(r.id)));
  await tx.done;
}

export async function getRecord(id) {
  const db = await getDb();
  return db.get(STORE_NAME, id);
}

// Bulk import with duplicate name+birthDate detection
// Returns { added, skipped, records: addedRecord[] }
export async function importRecords(records) {
  const db = await getDb();
  const existing = await db.getAll(STORE_NAME);
  let added = 0, skipped = 0;
  const addedRecords = [];

  for (const rec of records) {
    const dup = existing.find(e =>
      e.name?.toLowerCase().trim() === rec.name?.toLowerCase().trim() &&
      (rec.birthDate ? e.birthDate === rec.birthDate : e.umurBulan === rec.umurBulan)
    );
    if (dup) { skipped++; continue; }

    const data = {
      ...rec,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const id = await db.add(STORE_NAME, data);
    addedRecords.push({ ...data, id });
    added++;
  }

  return { added, skipped, records: addedRecords };
}
