import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";

export default function ProfileAdmin() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      // Ambil user yang sedang login
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Fetch data profile dari tabel "profiles"
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (err) {
      console.error("Gagal fetch profil admin:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Profile Admin</h1>
        <p>Sedang memuat...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Profile Admin</h1>
        <p>Data profil tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Admin</h1>

      <div className="bg-white shadow rounded-xl p-6 max-w-md">
        <p className="text-gray-600 text-sm mb-1">Username</p>
        <p className="font-semibold text-lg mb-4">
          {profile.usernames || "Tidak ada username"}
        </p>

        <p className="text-gray-600 text-sm mb-1">Email</p>
        <p className="font-semibold text-lg mb-4">
          {profile.email || "Tidak ada email"}
        </p>

        <p className="text-gray-600 text-sm mb-1">Alamat</p>
        <p className="font-semibold text-lg mb-4">
          {profile.alamat || "Tidak ada alamat"}
        </p>

        <p className="text-gray-600 text-sm mb-1">No HP</p>
        <p className="font-semibold text-lg mb-4">
          {profile.no_hp || "Tidak ada no hp"}
        </p>

        <p className="text-gray-600 text-sm mb-1">Role</p>
        <p className="font-semibold text-lg">
          {profile.role || "Tidak ada role"}
        </p>
      </div>
    </div>
  );
}