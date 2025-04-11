import { supabase } from "@/lib/supabase";

export const signup = async (data: any) => {
  try {
    const { data: dt, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw error;
    }

    return dt;
  } catch (error) {
    throw error;
  }
};

export const login = async (data: any) => {
  try {
    const { data: dt, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      throw error;
    }

    return dt;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};
