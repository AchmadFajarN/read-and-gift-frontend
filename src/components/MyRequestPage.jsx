import { useEffect, useState } from "react";
import { getMyRecipientDonations } from "../utils/api";

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const statusParam = statusFilter === "all" ? "" : statusFilter;
      const res = await getMyRecipientDonations(statusParam);
      if (res.status === "success") {
        setRequests(res.data);
      } else {
        alert("Gagal memuat data permintaan");
      }
      setLoading(false);
    };

    fetchRequests();
  }, [statusFilter]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Permintaan Saya</h1>

      <div className="mb-6">
        <select
          className="border border-gray-300 px-4 py-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="pending">Menunggu</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>

      {loading ? (
        <p>Memuat...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">Belum ada permintaan buku.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req.id}
              className="p-4 border rounded shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">{req.title}</h2>
              <p className="text-gray-600">Status: {req.donationStatus}</p>
              <p className="text-gray-500 text-sm mt-1">
                Donatur ID: {req.donorId}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRequestsPage;
