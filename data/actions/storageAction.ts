import { supabase } from "@/lib/supabase";

async function uploadFile(file: File) {
  const { data, error } = await supabase.storage
    .from("images")
    .upload("file_path", file);
  if (error) {
    throw error;
  } else {
    return data;
  }
}
