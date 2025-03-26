import { supabase } from "@/lib/supabase";

export interface FAQ {
  id: string;
  question_text: string;
  answer_text: string;
  created_at: string;
  updated_at: string | null;
}

export async function getFAQs() {
  try {
    const { data, error } = await supabase
      .from("faq")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return { data: null, error: "FAQs yüklenirken bir hata oluştu" };
  }
}

export async function createFAQ(question: string, answer: string) {
  try {
    const { data, error } = await supabase
      .from("faq")
      .insert([
        {
          question_text: question,
          answer_text: answer,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return { data: null, error: "FAQ eklenirken bir hata oluştu" };
  }
}

export async function updateFAQ(id: string, question: string, answer: string) {
  try {
    const { data, error } = await supabase
      .from("faq")
      .update({
        question_text: question,
        answer_text: answer,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return { data: null, error: "FAQ güncellenirken bir hata oluştu" };
  }
}

export async function deleteFAQ(id: string) {
  try {
    const { error } = await supabase.from("faq").delete().eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return { error: "FAQ silinirken bir hata oluştu" };
  }
}
