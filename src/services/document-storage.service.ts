import { getSupabaseServerClient } from "@/lib/supabase.server";

export type DocumentType = "Notice" | "Report" | "Newsletter" | "Blog";

export type DocumentRecord = {
  id: string;
  title: string;
  description: string;
  type: DocumentType;
  fileName: string;
  fileType: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
};

// Helper to map Supabase snake_case to your camelCase frontend
function mapDoc(doc: any): DocumentRecord {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    type: doc.type,
    fileName: doc.file_name,
    fileType: doc.file_type,
    fileUrl: doc.file_url,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  };
}

export async function loadDocuments(): Promise<DocumentRecord[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(mapDoc);
}

export async function createDocument({ data }: { data: FormData }): Promise<DocumentRecord> {
  const supabase = getSupabaseServerClient();

  const title = data.get("title") as string;
  const description = data.get("description") as string;
  const type = data.get("type") as DocumentType;
  const file = data.get("file") as File;
  const authorId = data.get("authorId") as string;

  if (!file) throw new Error("No file provided");

  // 1. Upload to Storage
  const filePath = `${authorId}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file);
  if (uploadError) throw new Error(uploadError.message);

  // 2. Get Public URL
  const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath);

  // 3. Save to Database
  const { data: newDoc, error: dbError } = await supabase
    .from("documents")
    .insert({
      title,
      description,
      type,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_type: file.type || "application/octet-stream",
      author_id: authorId,
    })
    .select()
    .single();

  if (dbError) throw new Error(dbError.message);
  return mapDoc(newDoc);
}

export async function updateDocument({ data }: { data: FormData }): Promise<DocumentRecord> {
  const supabase = getSupabaseServerClient();

  const id = data.get("id") as string;
  const title = data.get("title") as string;
  const description = data.get("description") as string;
  const type = data.get("type") as DocumentType;
  const file = data.get("file") as File | null;

  let fileUrl = data.get("existingFileUrl") as string;
  let fileName = data.get("existingFileName") as string;
  let fileType = data.get("existingFileType") as string;

  // If a new file is uploaded, replace the old one
  if (file && file.size > 0) {
    const authorId = data.get("authorId") as string;
    const filePath = `${authorId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file);
    if (uploadError) throw new Error(uploadError.message);

    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath);
    fileUrl = urlData.publicUrl;
    fileName = file.name;
    fileType = file.type || "application/octet-stream";
  }

  const { data: updatedDoc, error } = await supabase
    .from("documents")
    .update({
      title,
      description,
      type,
      file_url: fileUrl,
      file_name: fileName,
      file_type: fileType,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapDoc(updatedDoc);
}

export async function deleteDocument({ data }: { data: string }): Promise<DocumentRecord[]> {
  const supabase = getSupabaseServerClient();
  const docId = data;

  // 1. Get the file path to delete from storage
  const { data: doc } = await supabase
    .from("documents")
    .select("file_url")
    .eq("id", docId)
    .single();
  if (doc?.file_url) {
    const urlParts = doc.file_url.split("/documents/");
    if (urlParts.length > 1) {
      await supabase.storage.from("documents").remove([urlParts[1]]);
    }
  }

  // 2. Delete from Database
  const { error } = await supabase.from("documents").delete().eq("id", docId);
  if (error) throw new Error(error.message);

  return loadDocuments();
}

// Keep your existing preview helper if you have it, or use this one:
export function isPreviewSupported(mimeType: string): boolean {
  return mimeType.startsWith("image/") || mimeType === "application/pdf";
}
