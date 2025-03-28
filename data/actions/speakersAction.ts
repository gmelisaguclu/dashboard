"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export interface Speaker {
  id: string;
  name: string;
  title: string;
  photo: string;
  twitter: string | null;
  linkedin: string | null;
  order_index: number;
  created_at: string;
  deleted_at: string | null;
}

export async function fetchSpeakers() {
  try {
    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .order("order_index", { ascending: true })
      .is("deleted_at", null);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching speakers:", error);
    return { data: null, error };
  }
}

export async function createSpeaker(speakerData: {
  name: string;
  title: string;
  photo: string;
  twitter?: string;
  linkedin?: string;
  order_index: number;
}) {
  try {
    const { name, title, photo, twitter, linkedin, order_index } = speakerData;

    const { data, error } = await supabase
      .from("speakers")
      .insert([
        {
          name,
          title,
          photo,
          twitter: twitter || null,
          linkedin: linkedin || null,
          order_index,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/speakers");
    return { data, error: null };
  } catch (error) {
    console.error("Error creating speaker:", error);
    return { data: null, error };
  }
}

export async function updateSpeaker(
  id: string,
  speakerData: {
    name: string;
    title: string;
    photo?: string;
    twitter?: string;
    linkedin?: string;
  }
) {
  try {
    const { name, title, photo, twitter, linkedin } = speakerData;

    const updateData: any = {
      name,
      title,
      twitter: twitter || null,
      linkedin: linkedin || null,
    };

    if (photo) {
      updateData.photo = photo;
    }

    const { data, error } = await supabase
      .from("speakers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/speakers");
    return { data, error: null };
  } catch (error) {
    console.error("Error updating speaker:", error);
    return { data: null, error };
  }
}

export async function deleteSpeaker(id: string) {
  try {
    // Soft delete - just set the deleted_at timestamp
    const { error } = await supabase
      .from("speakers")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/speakers");
    return { error: null };
  } catch (error) {
    console.error("Error deleting speaker:", error);
    return { error };
  }
}

// Photo upload function
export async function uploadSpeakerPhoto(file: File) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExt}`;
    const filePath = `speakers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading photo:", error);
    return { url: null, error };
  }
}

// Get max order index to add new speakers in sequence
export async function getMaxOrderIndex() {
  try {
    const { data, error } = await supabase
      .from("speakers")
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    // If no speakers exist yet, start with 0
    return {
      orderIndex: data?.order_index ? data.order_index + 1 : 0,
      error: null,
    };
  } catch (error) {
    console.error("Error getting max order index:", error);
    return { orderIndex: 0, error };
  }
}

// Validate image file
export async function validateImageFile(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Dosya boyutu 5MB'dan büyük olamaz" };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Sadece resim dosyaları yüklenebilir" };
  }
  return { error: null };
}
