import { useEffect, useState } from "react";
import {
  getAllRecipientDonations,
  updateDonationStatus,
} from "../utils/api";

import { Link } from "react-router-dom";

const RequestManagePage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await getAllRecipientDonations();
      console.log(res.data)
      if (res.status === "success") {
        const ownedRequests = res.data.filter(
          (req) => req.donorId === user.id
        );
        setRequests(ownedRequests);
        console.log(requests);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [user.id]);

  const handleDecision = async (id, status) => {
    const confirm = window.confirm(
      `Apakah kamu yakin ingin ${status === "approved" ? "menyetujui" : "menolak"} permintaan ini?`
    );
    if (!confirm) return;

    const res = await updateDonationStatus(id, status);
    if (res.status === "success") {
      alert("Status berhasil diperbarui");
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, donationStatus: status } : r
        )
      );
    } else {
      alert("Gagal memperbarui status");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Permintaan ke Buku Saya</h1>

      {loading ? (
        <p>Memuat...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">Belum ada permintaan masuk.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">ID Buku: {req.donationBookId}</p>
              <p className="text-gray-600 mb-1">
                Peminta: {req.recipientUsername}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Status:{" "}
                <span className="font-semibold">
                  {req.donationStatus.toUpperCase()}
                </span>
              </p>
              <Link className="text-sm text-blue-500" to={`/profile/${req.recipientId}`}>
                Lihat Akun
              </Link>

              {req.donationStatus === "pending" && (
                <div className="space-x-2 mt-4">
                  <button
                    onClick={() => handleDecision(req.id, "approved")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleDecision(req.id, "rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Tolak
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestManagePage;
