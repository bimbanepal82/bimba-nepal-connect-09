export type DocumentType = "Notice" | "Report" | "Newsletter";

export interface DocumentRecord {
  id: string;
  title: string;
  description: string;
  type: DocumentType;
  fileName: string;
  fileType: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "bimba_nepal_documents_v1";

export function loadDocuments(): DocumentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DocumentRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDocuments(documents: DocumentRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

export function getDocumentById(id: string): DocumentRecord | undefined {
  return loadDocuments().find((document) => document.id === id);
}

export function createDocument(document: Omit<DocumentRecord, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const record: DocumentRecord = {
    ...document,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const documents = loadDocuments();
  const next = [record, ...documents];
  saveDocuments(next);
  return record;
}

export function updateDocument(
  id: string,
  update: Partial<Omit<DocumentRecord, "id" | "createdAt">>,
) {
  const documents = loadDocuments();
  let updated: DocumentRecord | undefined;
  const next = documents.map((document) => {
    if (document.id !== id) return document;
    updated = {
      ...document,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });
  if (updated) {
    saveDocuments(next);
  }
  return updated;
}

export function deleteDocument(id: string) {
  const documents = loadDocuments();
  const next = documents.filter((document) => document.id !== id);
  saveDocuments(next);
  return next;
}

export function isPreviewSupported(fileType: string) {
  return fileType.startsWith("image/") || fileType === "application/pdf";
}
