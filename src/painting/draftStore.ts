import type { Settings } from "./model";
export interface Draft {
  key: string;
  revision: number;
  pixels: Uint8ClampedArray;
  undo: Uint8ClampedArray | null;
  settings: Settings;
  commitId?: string;
  finalRevision?: number;
}
let database: Promise<IDBDatabase> | undefined;
function open() {
  return (database ??= new Promise((resolve, reject) => {
    const request = indexedDB.open("half-and-half-drafts", 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("drafts", { keyPath: "key" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      database = undefined;
      reject(request.error);
    };
    request.onblocked = () => {
      database = undefined;
      reject(new Error("Draft storage is busy."));
    };
  }));
}
export async function readDraft(key: string): Promise<Draft | undefined> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", "readonly"),
      request = tx.objectStore("drafts").get(key);
    tx.oncomplete = () => resolve(request.result as Draft | undefined);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
export async function writeDraft(draft: Draft) {
  const db = await open();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("drafts", "readwrite");
    tx.objectStore("drafts").put(draft);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
// Each caller hands over a snapshot. A later write can never be overtaken by an older one.
export class DraftSaver {
  private tail: Promise<void> = Promise.resolve();
  private last: Draft | undefined;
  constructor(
    private write: (draft: Draft) => Promise<void>,
    private status: (
      state: "saving" | "saved" | "error",
      revision: number,
    ) => void,
  ) {}
  save(draft: Draft) {
    this.last = draft;
    this.status("saving", draft.revision);
    const next = this.tail.catch(() => {}).then(() => this.write(draft));
    this.tail = next;
    void next.then(
      () => {
        if (this.last === draft) this.status("saved", draft.revision);
      },
      () => {
        if (this.last === draft) this.status("error", draft.revision);
      },
    );
    return next;
  }
  flush() {
    return this.tail;
  }
}
