import { supabase } from "@/lib/supabase";

export interface TeamMember {
  id: string;
  photo?: string;
  name: string;
  title: string;
  twitter?: string;
  linkedin?: string;
  telegram?: string;
  order_index?: number;
  created_at: string;
  deleted_at?: string | null;
}

export async function getTeamMembers() {
  try {
    console.log("Fetching team members...");
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .is("deleted_at", null)
      .order("order_index", { ascending: true });

    console.log("Team members fetch result:", { data, error });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching team members:", error);
    return { data: null, error: "Takım üyeleri yüklenirken bir hata oluştu" };
  }
}

export async function createTeamMember(
  teamMemberData: Omit<TeamMember, "id" | "created_at">
) {
  try {
    console.log("Creating team member with data:", teamMemberData);
    // Find the highest order_index and increment by 1
    const { data: existingMembers, error: orderError } = await supabase
      .from("teams")
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

    console.log("Existing team members for order index:", existingMembers);
    const newOrderIndex =
      existingMembers && existingMembers.length > 0
        ? (existingMembers[0].order_index || 0) + 1
        : 1;

    console.log("Using order index:", newOrderIndex);
    const insertData = {
      name: teamMemberData.name,
      title: teamMemberData.title,
      photo: teamMemberData.photo ?? null,
      twitter: teamMemberData.twitter ?? null,
      linkedin: teamMemberData.linkedin ?? null,
      telegram: teamMemberData.telegram ?? null,
      order_index: newOrderIndex,
    };

    console.log("Inserting team member with data:", insertData);
    const { data, error } = await supabase
      .from("teams")
      .insert([insertData])
      .select()
      .single();

    console.log("Team member creation result:", { data, error });
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
    console.error("Error creating team member:", error);
    return {
      data: null,
      error: `Takım üyesi eklenirken bir hata oluştu: ${
        error?.message || "Bilinmeyen hata"
      }`,
    };
  }
}

export async function updateTeamMember(
  id: string,
  teamMemberData: Partial<Omit<TeamMember, "id" | "created_at">>
) {
  try {
    const updateData: any = {};

    // Only include properties that are defined
    if (teamMemberData.name !== undefined)
      updateData.name = teamMemberData.name;
    if (teamMemberData.title !== undefined)
      updateData.title = teamMemberData.title;
    if (teamMemberData.photo !== undefined)
      updateData.photo = teamMemberData.photo;
    if (teamMemberData.twitter !== undefined)
      updateData.twitter = teamMemberData.twitter;
    if (teamMemberData.linkedin !== undefined)
      updateData.linkedin = teamMemberData.linkedin;
    if (teamMemberData.telegram !== undefined)
      updateData.telegram = teamMemberData.telegram;
    if (teamMemberData.order_index !== undefined)
      updateData.order_index = teamMemberData.order_index;

    const { data, error } = await supabase
      .from("teams")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating team member:", error);
    return {
      data: null,
      error: `Takım üyesi güncellenirken bir hata oluştu: ${
        error?.message || "Bilinmeyen hata"
      }`,
    };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    // Soft delete by setting deleted_at
    const { error } = await supabase
      .from("teams")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting team member:", error);
    return {
      error: `Takım üyesi silinirken bir hata oluştu: ${
        error?.message || "Bilinmeyen hata"
      }`,
    };
  }
}

export async function uploadTeamMemberPhoto(file: File) {
  try {
    console.log("Uploading photo:", file.name, file.type, file.size);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExt}`;
    const filePath = `teams/${fileName}`;

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
