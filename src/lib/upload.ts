import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";

export async function uploadFile(email: string, file: File) {
  const key = email + "/" + uuidv4();
  const { error } = await supabase.storage
    .from("quoteshack-dev")
    .upload(key, file, {
      contentType: file.type,
    });
  if (error) {
    return error;
  }

  return key;
}

export async function getPresignedUrl(key: string) {
  try {
    const { data, error } = await supabase.storage
      .from("quoteshack-dev")
      .createSignedUrl(key, 60 * 60 * 24 * 30);

    if (error) throw error;
    if (!data?.signedUrl) throw new Error("Could not generate signed URL");

    return data.signedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}
