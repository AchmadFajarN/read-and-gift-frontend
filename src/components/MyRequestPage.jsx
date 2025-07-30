import { useEffect, useState } from "react";
import { getMyRecipientDonations } from "../utils/api";
import {
  Clock,
  CheckCircle,
  XCircle,
  Book,
  Filter,
  User,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const MyRequestsPage = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const statusConfig = {
    pending: {
      label: "Menunggu",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      bgColor: "bg-yellow-50",
    },
    approved: {
      label: "Disetujui",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
      bgColor: "bg-green-50",
    },
    rejected: {
      label: "Ditolak",
      icon: XCircle,
      color: "bg-red-100 text-red-800 border-red-200",
      bgColor: "bg-red-50",
    },
  };

  useEffect(() => {
    const fetchAllRequests = async () => {
      setLoading(true);
      const res = await getMyRecipientDonations();
      if (res.status === "success") {
        setAllRequests(res.data);
      } else {
        alert("Gagal memuat data permintaan");
      }
      setLoading(false);
    };

    fetchAllRequests();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredRequests(allRequests);
    } else {
      setFilteredRequests(
        allRequests.filter((req) => req.donationStatus === statusFilter)
      );
    }
  }, [statusFilter, allRequests]);

  const getStatusCount = (status) => {
    if (status === "all") return allRequests.length;
    return allRequests.filter((req) => req.donationStatus === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <Book className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Permintaan Saya
          </h1>
          <p className="text-blue-100 text-lg">
            Kelola dan pantau status permintaan donasi buku Anda
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Filter Status
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "all", label: "Semua" },
              { value: "pending", label: "Menunggu" },
              { value: "approved", label: "Disetujui" },
              { value: "rejected", label: "Ditolak" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  statusFilter === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="text-sm font-medium text-gray-900">
                  {option.label}
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {getStatusCount(option.value)}
                </div>
                {statusFilter === option.value && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat permintaan...</p>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Book className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusFilter === "all"
                ? "Belum ada permintaan"
                : `Tidak ada permintaan ${statusFilter}`}
            </h3>
            <p className="text-gray-500 mb-6">
              Mulai jelajahi buku donasi dan ajukan permintaan untuk buku yang
              Anda inginkan
            </p>
            <button
              onClick={() => (window.location.href = "/donate-page")}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              <Book className="w-4 h-4 mr-2" />
              Jelajahi Buku Donasi
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((req) => {
              const status =
                statusConfig[req.donationStatus] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {req.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <User className="w-4 h-4" />
                          <span className="text-sm">
                            Donatur: {req.donorUsername || `ID: ${req.donorId}`}
                          </span>
                          <Link
                            to={`/profile/${req.donorId}`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Lihat Profil
                          </Link>
                        </div>
                      </div>

                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${status.color}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div
                      className={`rounded-xl p-4 ${status.bgColor} border border-gray-100`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            ID Permintaan:
                          </span>
                          <span className="text-gray-600 ml-2">#{req.id}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Status:
                          </span>
                          <span className="text-gray-600 ml-2 capitalize">
                            {req.donationStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Messages */}
                    {req.donationStatus === "approved" && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">
                            Permintaan Disetujui!
                          </span>
                        </div>
                        <p className="text-green-700 text-sm mt-1">
                          Silakan hubungi donatur untuk mengatur pengambilan
                          buku.
                          <Link
                            to={`/profile/${req.donorId}`}
                            className="ml-1 font-medium text-green-800 hover:text-green-900 underline"
                          >
                            Klik di sini untuk melihat kontak donatur.
                          </Link>
                        </p>
                      </div>
                    )}

                    {req.donationStatus === "rejected" && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center gap-2 text-red-800">
                          <XCircle className="w-5 h-5" />
                          <span className="font-medium">
                            Permintaan Ditolak
                          </span>
                        </div>
                        <p className="text-red-700 text-sm mt-1">
                          Jangan menyerah! Coba ajukan permintaan untuk buku
                          lainnya.
                        </p>
                      </div>
                    )}

                    {req.donationStatus === "pending" && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <Clock className="w-5 h-5" />
                          <span className="font-medium">
                            Menunggu Persetujuan
                          </span>
                        </div>
                        <p className="text-yellow-700 text-sm mt-1">
                          Permintaan Anda sedang ditinjau oleh donatur.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequestsPage;
