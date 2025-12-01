import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useAuth } from "../../context/authContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading, logout, updateProfile } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");

  useEffect(() => {
    if (profile) {
      setUsername(profile.usernames || "");
      setPass(profile.pass || "");
      setAlamat(profile.alamat || "");
      setNoHp(profile.no_hp || "");
    }
  }, [profile]);

  // JANGAN KOSONG – kasih minimal loading
  if (loading) return <p className="p-6">Loading...</p>;
  // Ini sebenernya tidak akan kejadian karena sudah di-filter di ProtectedRoute,
  // tapi buat jaga-jaga aja.
  if (!user) return <p className="p-6">Tidak ada user.</p>;

  const handleSave = async () => {
    try {
      await updateProfile({
        usernames: username,
        pass,
        alamat,
        no_hp: noHp,
      });
      alert("Data berhasil diperbarui!");
      setEditMode(false);
    } catch (err) {
      alert("Gagal update: " + err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={() => setEditMode(!editMode)}
        >
          <Pencil size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* EMAIL */}
        <div>
          <label>Email</label>
          <input
            className="w-full border p-2 rounded bg-gray-100"
            value={profile?.email || ""}
            disabled
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label>Password</label>
          <input
            disabled={!editMode}
            className={`w-full border p-2 rounded ${
              !editMode && "bg-gray-100"
            }`}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>

        {/* USERNAME */}
        <div>
          <label>Username</label>
          <input
            disabled={!editMode}
            className={`w-full border p-2 rounded ${
              !editMode && "bg-gray-100"
            }`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* ALAMAT */}
        <div>
          <label>Alamat</label>
          <input
            disabled={!editMode}
            className={`w-full border p-2 rounded ${
              !editMode && "bg-gray-100"
            }`}
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
          />
        </div>

        {/* NO HP */}
        <div>
          <label>No HP</label>
          <input
            disabled={!editMode}
            className={`w-full border p-2 rounded ${
              !editMode && "bg-gray-100"
            }`}
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
          />
        </div>

        {editMode ? (
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            Simpan
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
