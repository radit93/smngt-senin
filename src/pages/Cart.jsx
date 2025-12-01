// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";
import { Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      const { data, error } = await supabase
        .from("cart")
        .select(`
          id,
          quantity,
          product (
            id,
            name,
            price
          )
        `)
        .eq("user_id", user.id);

      if (!error) setItems(data);
      setLoading(false);
    };

    fetchCart();
  }, [user]);

  const deleteItem = async (id) => {
    await supabase.from("cart").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalHarga = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  if (loading) return <div className="p-6 text-center">Memuat keranjang...</div>;

  return (
    <main className="p-6 max-w-3xl mx-auto">

      {/* Header atas */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeft size={18} />
        Kembali
      </button>

      <h1 className="text-3xl font-bold mb-6 tracking-wide">Keranjang Belanja</h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-600 p-10 border rounded-lg bg-white shadow-sm">
          Keranjangmu masih kosong.
        </div>
      ) : (
        <>
          {/* List produk */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-5 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
              >
                {/* Gambar produk */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>

                {/* Detail produk */}
                <div className="flex-1">
                  <h2 className="font-semibold text-[15px] leading-snug">
                    {item.product.name}
                  </h2>

                  <p className="text-sm text-gray-700 mt-1">
                    Rp {Number(item.product.price).toLocaleString("id-ID")}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Jumlah: {item.quantity}
                  </p>
                </div>

                {/* Tombol hapus */}
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Bagian checkout */}
          <div className="mt-10 border-t pt-6 flex items-center justify-between">
            <div className="text-lg font-semibold tracking-wide">
              Total: Rp {totalHarga.toLocaleString("id-ID")}
            </div>

            <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition">
              Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}