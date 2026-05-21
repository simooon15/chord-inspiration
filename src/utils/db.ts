/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const DB_NAME = 'and-xian-inspiration-db';
const STORE_NAME = 'audio_memos';

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveAudioMemo(id: string, blob: Blob): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put({ id, blob });
    
    transaction.oncomplete = () => {
      resolve();
    };
    
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
}

export async function getAudioMemo(id: string): Promise<Blob | null> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result ? request.result.blob : null);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('IndexedDB access failed:', error);
    return null;
  }
}

export async function deleteAudioMemo(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
    
    transaction.oncomplete = () => {
      resolve();
    };
    
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
}
