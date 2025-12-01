import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { getOrders, deleteOrder } from "./Order.api.js";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchData = async () => {
    try {
      const result = await getOrders();
      setOrders(result);
    } catch (err) {
      console.error("Gagal fetch order:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Order</h1>

      {orders.map((o) => (
        <div key={o.id} className="bg-white border rounded-lg p-4 mb-4 shadow">
          <div className="flex justify-between">
            <h3 className="text-lg font-bold">No Resi: {o.no_resi}</h3>
            <button onClick={() => handleDelete(o.id)}>
              <Trash2 className="text-red-600" />
            </button>
          </div>

          <p>Nama Pemesan: {o.nama_pemesan}</p>
          <p>Alamat: {o.alamat}</p>

          <p className="mt-3 font-semibold">Produk:</p>
          <div className="ml-3">
            {o.produk.map((p, i) => (
              <div key={i}>
                {p.nama} x {p.qty} - Rp{p.harga.toLocaleString()}
              </div>
            ))}
          </div>

          <p className="mt-3 font-bold">
            Total: Rp
            {o.produk
              .reduce((acc, p) => acc + p.qty * p.harga, 0)
              .toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}