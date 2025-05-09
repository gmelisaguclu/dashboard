import { supabase } from "@/lib/supabase";

export interface Speaker {
  id: string;
  name: string;
  title: string;
  photo?: string;
  twitter?: string;
  linkedin?: string;
  order_index?: number;
  created_at: string;
  deleted_at?: string | null;
}

export async function getSpeakers() {
  try {
    console.log("Fetching speakers...");
    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .is("deleted_at", null)
      .order("order_index", { ascending: true });

    console.log("Speakers fetch result:", { data, error });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching speakers:", error);
    return { data: null, error: "Konuşmacılar yüklenirken bir hata oluştu" };
  }
}

export async function createSpeaker(
  speakerData: Omit<Speaker, "id" | "created_at">
) {
  try {
    console.log("Creating speaker with data:", speakerData);
    // Find the highest order_index and increment by 1
    const { data: existingSpeakers, error: orderError } = await supabase
      .from("speakers")
      .select("order_index")
      .is("deleted_at", null)
      .order("order_index", { ascending: false })
      .limit(1);

    if (orderError) {
      console.error("Error fetching order index:", orderError);
      return {
        data: null,
        error: `Sıralama indeksi alınamadı: ${orderError.message}`,
      };
    }

    console.log("Existing speakers for order index:", existingSpeakers);
    const newOrderIndex =
      existingSpeakers && existingSpeakers.length > 0
        ? (existingSpeakers[0].order_index || 0) + 1
        : 1;

    console.log("Using order index:", newOrderIndex);
    const insertData = {
      name: speakerData.name,
      title: speakerData.title,
      photo: speakerData.photo ?? null,
      twitter: speakerData.twitter ?? null,
      linkedin: speakerData.linkedin ?? null,
      order_index: newOrderIndex,
    };

    console.log("Inserting speaker with data:", insertData);
    const { data, error } = await supabase
      .from("speakers")
      .insert([insertData])
      .select()
      .single();

    console.log("Speaker creation result:", { data, error });
    if (error) {
      console.error("Supabase insert error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    return { data, error: null };
  } catch (error: any) {
    console.error("Error creating speaker:", error);
    return {
      data: null,
      error: `Konuşmacı eklenirken bir hata oluştu: ${
        error?.message || "Bilinmeyen hata"
      }`,
    };
  }
}

export async function updateSpeaker(
  id: string,
  speakerData: Partial<Omit<Speaker, "id" | "created_at">>
) {
  try {
    const updateData: any = {};

    // Only include properties that are defined
    if (speakerData.name !== undefined) updateData.name = speakerData.name;
    if (speakerData.title !== undefined) updateData.title = speakerData.title;
    if (speakerData.photo !== undefined) updateData.photo = speakerData.photo;
    if (speakerData.twitter !== undefined)
      updateData.twitter = speakerData.twitter;
    if (speakerData.linkedin !== undefined)
      updateData.linkedin = speakerData.linkedin;
    if (speakerData.order_index !== undefined)
      updateData.order_index = speakerData.order_index;

    const { data, error } = await supabase
      .from("speakers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating speaker:", error);
    return { data: null, error: "Konuşmacı güncellenirken bir hata oluştu" };
  }
}

export async function deleteSpeaker(id: string) {
  try {
    // Soft delete by setting deleted_at
    const { error } = await supabase
      .from("speakers")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting speaker:", error);
    return { error: "Konuşmacı silinirken bir hata oluştu" };
  }
}

export async function uploadSpeakerPhoto(file: File) {
  try {
    console.log("Uploading photo:", file.name, file.type, file.size);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExt}`;
    const filePath = `speakers/${fileName}`;

    // Doğrudan images bucket'ını kullan
    const bucketName = "images";

    console.log(`Using storage bucket: ${bucketName}, path: ${filePath}`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    console.log("Upload result:", { uploadData, uploadError });

    if (uploadError) {
      console.error("Upload error details:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    console.log("Public URL:", data);

    return { url: data.publicUrl, error: null };
  } catch (error: any) {
    console.error("Error uploading photo:", error);
    return {
      url: null,
      error: `Fotoğraf yüklenirken bir hata oluştu: ${
        error?.message || "Bilinmeyen hata"
      }`,
    };
  }
}
