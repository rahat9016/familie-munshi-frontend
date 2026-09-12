/**
 * IndexedDB store for full-size image data URLs.
 *
 * localStorage caps out around 5MB per origin, which one 1920px photo can
 * nearly fill once base64 inflates it — so records keep a small thumbnail
 * inline and park the full preview here, where the quota is orders of
 * magnitude larger.
 */

const DB_NAME = "familie-munshi-images";
const DB_VERSION = 1;
const STORE = "images";

const isSupported = () =>
  typeof window !== "undefined" && "indexedDB" in window;

let dbPromise: Promise<IDBDatabase> | null = null;

const openDb = () => {
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) {
          request.result.createObjectStore(STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error ?? new Error("Could not open the image store"));
    }).catch((error) => {
      // A failed open must not poison every later call (private mode, etc.).
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
};

const run = async <T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = action(tx.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Image store request failed"));
  });
};

export const putImage = async (id: string, dataUrl: string) => {
  if (!isSupported()) return;
  await run("readwrite", (store) => store.put(dataUrl, id));
};

/** Returns `null` when the image is missing or the store is unavailable, so
 *  callers can fall back to the inline thumbnail. */
export const getImage = async (id: string): Promise<string | null> => {
  if (!isSupported()) return null;
  try {
    const value = await run<string | undefined>("readonly", (store) =>
      store.get(id)
    );
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
};

export const getImages = async (ids: string[]) => {
  const entries = await Promise.all(
    ids.map(async (id) => [id, await getImage(id)] as const)
  );
  return Object.fromEntries(
    entries.filter((entry): entry is [string, string] => entry[1] !== null)
  );
};

export const deleteImage = async (id: string) => {
  if (!isSupported()) return;
  try {
    await run("readwrite", (store) => store.delete(id));
  } catch {
    // A leftover blob is harmless — never block the UI on cleanup.
  }
};
