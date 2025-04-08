import { supabase } from "@/lib/supabase";

export enum PartnerType {
  MAIN = "main",
  DIAMOND = "diamond",
  GOLD = "gold",
  SILVER = "silver",
}

export interface Partner {
  id: string;
  title: string;
  logo?: string;
  link?: string;
  type: PartnerType;
  created_at: string;
  deleted_at?: string | null;
}

export async function getPartners() {
  try {
    console.log("Fetching partners...");
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .is("deleted_at", null)
      .order("type", { ascending: true });

    console.log("Partners fetch result:", { data, error });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching partners:", error);
    return { data: null, error: "Sponsorlar yüklenirken bir hata oluştu" };
  }
}

export async function getPartnersByType(type: PartnerType) {
  try {
    console.log(`Fetching partners of type ${type}...`);
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("type", type)
      .is("deleted_at", null);

    console.log("Partners fetch result:", { data, error });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching partners of type ${type}:`, error);
    return {
      data: null,
      error: `${type} sponsorları yüklenirken bir hata oluştu`,
    };
  }
}

export async function createPartner(
  partnerData: Omit<Partner, "id" | "created_at">
) {
  try {
    console.log("Creating partner with data:", partnerData);

    const insertData = {
      title: partnerData.title,
      logo: partnerData.logo ?? null,
      link: partnerData.link ?? null,
      type: partnerData.type,
    };

    console.log("Inserting partner with data:", insertData);
    const { data, error } = await supabase
      .from("partners")
      .insert([insertData])
      .select()
      .single();

    console.log("Partner creation result:", { data, error });
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
    console.error("Error creating partner:", error);
    return {
      data: null,
      error: `Sponsor eklenirken bir hata oluştu: ${
        error?.message || "Bilinmeyen hata"
      }`,
    };
  }
}

export async function updatePartner(
  id: string,
  partnerData: Partial<Omit<Partner, "id" | "created_at">>
) {
  try {
    const updateData: any = {};

    // Only include properties that are defined
    if (partnerData.title !== undefined) updateData.title = partnerData.title;
    if (partnerData.logo !== undefined) updateData.logo = partnerData.logo;
    if (partnerData.link !== undefined) updateData.link = partnerData.link;
    if (partnerData.type !== undefined) updateData.type = partnerData.type;

    const { data, error } = await supabase
      .from("partners")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating partner:", error);
    return {
      data: null,
      error: `Sponsor güncellenirken bir hata oluştu: ${
        error?.message || "Bilinmeyen hata"
      }`,
    };
  }
}

export async function deletePartner(id: string) {
  try {
    // Soft delete by setting deleted_at
    const { error } = await supabase
      .from("partners")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting partner:", error);
    return {
      error: `Sponsor silinirken bir hata oluştu: ${
        error?.message || "Bilinmeyen hata"
      }`,
    };
  }
}

export async function uploadPartnerLogo(file: File) {
  try {
    console.log("Uploading logo:", file.name, file.type, file.size);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExt}`;
    const filePath = `partners/${fileName}`;

    // Images bucket'ını kullan
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
    console.error("Error uploading logo:", error);
    return {
      url: null,
      error: `Logo yüklenirken bir hata oluştu: ${
        error?.message || "Bilinmeyen hata"
      }`,
    };
  }
}

export async function updatePartnerOrder(
  partnerId: string,
  newOrderIndex: number,
  partnerType: PartnerType
) {
  try {
    const { data: currentPartner, error: fetchError } = await supabase
      .from("partners")
      .select("*")
      .eq("id", partnerId)
      .single();

    if (fetchError) throw fetchError;
    if (!currentPartner) throw new Error("Sponsor bulunamadı");

    // Yeni index eski indexten büyükse, aradaki elemanların indexini 1 azalt
    // Yeni index eski indexten küçükse, aradaki elemanların indexini 1 artır
    const currentOrderIndex = currentPartner.order_index;

    if (currentOrderIndex === newOrderIndex) {
      return { error: null }; // Değişiklik yok
    }

    // Supabase transaction yok, sırayla işlem yapmalıyız
    if (currentOrderIndex < newOrderIndex) {
      // Aşağı taşıma (eski index < yeni index)
      // Her bir etkilenen elemanı tek tek güncelle
      const { data: affectedItems, error: fetchRangeError } = await supabase
        .from("partners")
        .select("id, order_index")
        .eq("type", partnerType)
        .gt("order_index", currentOrderIndex)
        .lte("order_index", newOrderIndex)
        .is("deleted_at", null);

      if (fetchRangeError) throw fetchRangeError;

      // Her birini tek tek güncelle
      for (const item of affectedItems || []) {
        const { error: updateItemError } = await supabase
          .from("partners")
          .update({ order_index: item.order_index - 1 })
          .eq("id", item.id);

        if (updateItemError) throw updateItemError;
      }
    } else {
      // Yukarı taşıma (eski index > yeni index)
      const { data: affectedItems, error: fetchRangeError } = await supabase
        .from("partners")
        .select("id, order_index")
        .eq("type", partnerType)
        .lt("order_index", currentOrderIndex)
        .gte("order_index", newOrderIndex)
        .is("deleted_at", null);

      if (fetchRangeError) throw fetchRangeError;

      // Her birini tek tek güncelle
      for (const item of affectedItems || []) {
        const { error: updateItemError } = await supabase
          .from("partners")
          .update({ order_index: item.order_index + 1 })
          .eq("id", item.id);

        if (updateItemError) throw updateItemError;
      }
    }

    // Taşınan elemanın yeni indexini ayarla
    const { error: updateTargetError } = await supabase
      .from("partners")
      .update({ order_index: newOrderIndex })
      .eq("id", partnerId);

    if (updateTargetError) throw updateTargetError;

    return { error: null };
  } catch (error: any) {
    console.error("Error updating partner order:", error);
    return {
      error: `Sponsor sıralaması güncellenirken bir hata oluştu: ${
        error?.message || "Bilinmeyen hata"
      }`,
    };
  }
}
