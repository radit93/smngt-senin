// src/pages/Wishlist.jsx
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";
import { ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadWishlist() {
      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          id,
          product (
            id,
            name,
            price
          )
        `)
        .eq("user_id", user.id);

      if (!error) setItems(data);
      setLoading(false);
    }

    loadWishlist();
  }, [user]);

  const removeItem = async (id) => {
    await supabase.from("wishlist").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // TAMBAH KE KERANJANG DARI WISHLIST
  const addToCart = async (productId) => {
    const { data: exist } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (exist) {
      await supabase
        .from("cart")
        .update({ quantity: exist.quantity + 1 })
        .eq("id", exist.id);
      return;
    }

    await supabase.from("cart").insert([
      {
        user_id: user.id,
        product_id: productId,
        quantity: 1,
      },
    ]);
  };

  if (loading) {
    return <div className="p-6 text-center">Memuat wishlist...</div>;
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">

      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeft size={18} /> Kembali
      </button>

      <h1 className="text-3xl font-bold mb-6 tracking-wide">Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-600 p-10 border rounded-lg bg-white shadow-sm">
          Wishlist masih kosong.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-5 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Placeholder gambar */}
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>

              {/* Detail Produk */}
              <div className="flex-1">
                <h2 className="font-semibold text-[15px] leading-snug">
                  {item.product.name}
                </h2>

                <p className="text-sm text-gray-700 mt-1">
                  Rp {Number(item.product.price).toLocaleString("id-ID")}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-3">

                {/* Tambah ke Keranjang */}
                <button
                  onClick={() => addToCart(item.product.id)}
                  className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
                >
                  <ShoppingCart size={18} />
                </button>

                {/* Hapus Wishlist */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}