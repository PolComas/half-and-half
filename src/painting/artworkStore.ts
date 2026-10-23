import type { RoomView } from "../../shared/contracts";
export interface Artwork {
  id: string;
  png: Blob;
  ideas: { left: string; right: string };
  savedAt: number;
}
let database: Promise<IDBDatabase> | undefined;
function open() {
  return (database ??= new Promise((resolve, reject) => {
    const request = indexedDB.open("half-and-half-artworks", 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("artworks", { keyPath: "id" });
    request.onsuccess = () => {
      request.result.onversionchange = () => {
        request.result.close();
        database = undefined;
      };
      resolve(request.result);
    };
    request.onerror = () => {
      database = undefined;
      reject(request.error);
    };
    request.onblocked = () => {
      database = undefined;
      reject(Error("Local artwork storage is busy."));
    };
  }));
}
export async function recentArtworks(): Promise<Artwork[]> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("artworks", "readonly"),
      request = tx.objectStore("artworks").getAll();
    tx.oncomplete = () =>
      resolve(
        (request.result as Artwork[]).sort((a, b) => b.savedAt - a.savedAt),
      );
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
export async function saveArtwork(artwork: Artwork) {
  if (
    artwork.png.type !== "image/png" ||
    artwork.png.size > 8 * 1024 * 1024 ||
    !artwork.png.size
  )
    throw Error("Invalid artwork.");
  const db = await open();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("artworks", "readwrite"),
      store = tx.objectStore("artworks"),
      existing = store.get(artwork.id);
    existing.onsuccess = () => {
      if (!existing.result) store.put(artwork);
      const all = store.getAll();
      all.onsuccess = () => {
        const items = (all.result as Artwork[]).sort(
          (a, b) => b.savedAt - a.savedAt || b.id.localeCompare(a.id),
        );
        for (const item of items.slice(3)) store.delete(item.id);
      };
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
  window.dispatchEvent(new Event("hh-artworks-changed"));
}
const inFlight = new Map<string, Promise<void>>();
export function archiveRoom(room: RoomView) {
  if (
    room.phase !== "revealed" ||
    !room.finished ||
    !room.partnerFinished ||
    !room.baseId ||
    !room.ideas
  )
    return Promise.reject(Error("Artwork is not revealed."));
  const id = room.baseId;
  const active = inFlight.get(id);
  if (active) return active;
  const promise = (async () => {
    if ((await recentArtworks()).some((a) => a.id === id)) return;
    const response = await fetch(
      `/api/room/result?base=${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );
    if (!response.ok) throw Error("Could not load the finished artwork.");
    await saveArtwork({
      id,
      png: await response.blob(),
      ideas: room.ideas!,
      savedAt: Date.now(),
    });
  })().finally(() => inFlight.delete(id));
  inFlight.set(id, promise);
  return promise;
}
