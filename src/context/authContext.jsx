import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  // -----------------------
  // LOGIN
  // -----------------------
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Ambil session terbaru
    const { data: sessionData } = await supabase.auth.getSession();

    setUser(sessionData.session?.user || null);

    return sessionData.session?.user;
  };

  // -----------------------
  // LOGOUT
  // -----------------------
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // -----------------------
  // FETCH SESSION AWAL
  // -----------------------
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // -----------------------
  // FETCH PROFILE
  // -----------------------
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);

      // gunakan maybeSingle agar tidak crash saat row belum ada
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) console.log("Profile error:", error.message);

      setProfile(data || null);
      setProfileLoading(false);
    };

    fetchProfile();
  }, [user]);

  // -----------------------
  // RETURN CONTEXT
  // -----------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}