"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export interface AboutImage {
  id: string;
  name: string;
  image_url: string;
  order_index: number;
}

export async function fetchAboutImages() {
  try {
    const { data, error } = await supabase
      .from("about_images")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching images:", error);
    return { data: null, error };
  }
}

export async function uploadAboutImage(
  file: File,
  name: string,
  orderIndex: number
) {
  try {
    // Önce bu pozisyonda resim var mı kontrol et
    const { data: existingImage, error: checkError } = await supabase
      .from("about_images")
      .select("*")
      .eq("order_index", orderIndex)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    // Eğer bu pozisyonda resim varsa, önce onu sil
    if (existingImage) {
      const filePath = existingImage.image_url.split("/").pop();
      await supabase.storage.from("images").remove([`about/${filePath}`]);
      await supabase.from("about_images").delete().eq("id", existingImage.id);
    }

    // Yeni resmi yükle
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${name
      .toLowerCase()
      .replace(/\s+/g, "-")}.${fileExt}`;
    const filePath = `about/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    const { error: dbError } = await supabase.from("about_images").insert([
      {
        name,
        image_url: publicUrl,
        order_index: orderIndex,
      },
    ]);

    if (dbError) throw dbError;

    revalidatePath("/dashboard/about");
    return { error: null };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { error };
  }
}

export async function deleteAboutImage(id: string, imageUrl: string) {
  try {
    const filePath = imageUrl.split("/").pop();

    const { error: storageError } = await supabase.storage
      .from("images")
      .remove([`about/${filePath}`]);

    if (storageError) throw storageError;

    const { error: dbError } = await supabase
      .from("about_images")
      .delete()
      .eq("id", id);

    if (dbError) throw dbError;

    revalidatePath("/dashboard/about");
    return { error: null };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { error };
  }
}

export async function validateImageFile(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Dosya boyutu 5MB'dan büyük olamaz" };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Sadece resim dosyaları yüklenebilir" };
  }
  return { error: null };
}

export async function handleImageUpload(formData: FormData, cardIndex: number) {
  const file = formData.get("file") as File;
  const name = formData.get("name") as string;

  if (!file || !name.trim()) {
    return { error: "Lütfen resim adı ve resim seçiniz" };
  }

  const validation = await validateImageFile(file);
  if (validation.error) {
    return validation;
  }

  return await uploadAboutImage(file, name, cardIndex);
}

export async function updateAboutImage(
  id: string,
  name: string,
  file: File | null,
  orderIndex: number
) {
  try {
    // Get current image
    const { data: currentImage, error: getError } = await supabase
      .from("about_images")
      .select("*")
      .eq("id", id)
      .single();

    if (getError) throw getError;

    let imageUrl = currentImage.image_url;

    // If a new file was uploaded, update the image
    if (file) {
      // Delete the old file
      const oldFilePath = currentImage.image_url.split("/").pop();
      await supabase.storage.from("images").remove([`about/${oldFilePath}`]);

      // Upload new file
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${name
        .toLowerCase()
        .replace(/\s+/g, "-")}.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Update the database record
    const { error: updateError } = await supabase
      .from("about_images")
      .update({
        name,
        image_url: imageUrl,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    revalidatePath("/dashboard/about");
    return { error: null };
  } catch (error) {
    console.error("Error updating image:", error);
    return { error };
  }
}

export async function handleImageUpdate(
  formData: FormData,
  imageId: string,
  orderIndex: number
) {
  const file = formData.get("file") as File | null;
  const name = formData.get("name") as string;

  if (!name.trim()) {
    return { error: "Lütfen resim adı giriniz" };
  }

  // If a file is provided, validate it
  if (file && file.size > 0) {
    const validation = await validateImageFile(file);
    if (validation.error) {
      return validation;
    }
    return await updateAboutImage(imageId, name, file, orderIndex);
  }

  // If no file, just update the name
  return await updateAboutImage(imageId, name, null, orderIndex);
}
