import { useEffect, useState } from "react";
import { getBookDonate } from "../utils/api";
import { Link } from "react-router-dom";
import { requestDonationBook } from "../utils/api";
import {
  Book,
  Search,
  Plus,
  Heart,
  Gift,
  ChevronLeft,
  ChevronRight,
  User,
  Ban,
} from "lucide-react";

const DonatePage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const booksPerPage = 3;

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const res = await getBookDonate(currentPage, booksPerPage);
      console.log(res);
      if (res.status === "success") {
        setBooks(res.data || []);
        setTotalBooks(res.totalItem || 0);
        setTotalPages(Math.ceil((res.totalItem || 0) / booksPerPage));
      } else {
        setBooks([]);
        setTotalBooks(0);
        setTotalPages(1);
      }
      setLoading(false);
    };
    fetchBooks();
  }, [currentPage]);

  useEffect(() => {
    if (!search) {
      setFiltered(books);
    } else {
      setFiltered(
        books.filter(
          (book) =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, books]);

  const handleRequest = async (bookId) => {
    const confirm = window.confirm("Apakah kamu yakin ingin meminta buku ini?");
    if (!confirm) return;

    setRequesting((prev) => ({ ...prev, [bookId]: true }));

    const res = await requestDonationBook(bookId);
    if (res.status === "success") {
      alert("Permintaan donasi berhasil dikirim!");
    } else {
      alert(`Gagal mengirim permintaan: ${res.message}`);
    }

    setRequesting((prev) => ({ ...prev, [bookId]: false }));
  };

  const isOwnBook = (book) => {
    console.log("isOwnBook", book);
    return book.owner === currentUser.id;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const showPages = 5; // Number of page numbers to show

    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-rose-500 via-pink-600 to-orange-500 text-white py-16 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Gift className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-rose-100 bg-clip-text text-transparent">
              Donasi Buku
            </h1>
            <p className="text-xl text-rose-100 max-w-3xl mx-auto leading-relaxed">
              Bantu mereka menemukan harapan lewat halaman demi halaman. Berbagi
              buku adalah berbagi pengetahuan dan inspirasi.
            </p>

            {totalBooks > 0 && (
              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Book className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {totalBooks} buku tersedia untuk donasi
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10 items-center justify-between">
          <div className="w-full lg:w-2/3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Cari judul atau penulis buku untuk donasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Link
            to="/donate"
            className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Donasi Buku
          </Link>
        </div>

        {/* Pagination Info */}
        {!loading && totalBooks > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Menampilkan {(currentPage - 1) * booksPerPage + 1} -{" "}
              {Math.min(currentPage * booksPerPage, totalBooks)} dari{" "}
              {totalBooks} buku
            </p>
            <p className="text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat buku donasi...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Book Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filtered.map((book, idx) => {
                const isOwn = isOwnBook(book);

                return (
                  <div
                    key={idx}
                    className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={book.donationCoverPath}
                        alt={book.title}
                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        {isOwn ? (
                          <User className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Heart className="w-5 h-5 text-rose-500" />
                        )}
                      </div>

                      {isOwn && (
                        <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          Buku Anda
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {/* Book Info */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 font-medium">
                        oleh {book.author}
                      </p>

                      {/* Donor Info */}
                      {book.donorUsername && (
                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                          <User className="w-3 h-3" />
                          <span>Didonasikan oleh: {book.donorUsername}</span>
                        </div>
                      )}

                      {/* Genres */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {book.genre?.slice(0, 3).map((g) => (
                          <span
                            key={g}
                            className="px-3 py-1 bg-gradient-to-r from-rose-50 to-orange-50 text-rose-700 rounded-full text-xs font-medium border border-rose-100"
                          >
                            {g}
                          </span>
                        ))}
                        {book.genre?.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            +{book.genre.length - 3}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-3 mb-6 leading-relaxed">
                        {book.synopsis}
                      </p>

                      {/* Publisher Info */}
                      <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          <p className="font-medium">{book.publisher}</p>
                          <p className="text-xs">{book.publish_year}</p>
                        </div>
                        <div className="flex items-center gap-1 text-rose-500">
                          <Gift className="w-4 h-4" />
                          <span className="text-xs font-medium">Tersedia</span>
                        </div>
                      </div>

                      {/* Request Button */}
                      {isOwn ? (
                        <div className="w-full py-3 px-4 rounded-2xl font-semibold bg-gray-100 text-gray-500 text-center border-2 border-dashed border-gray-300">
                          <div className="flex items-center justify-center gap-2">
                            <Ban className="w-4 h-4" />
                            Tidak Dapat Request Buku Sendiri
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRequest(book.id)}
                          disabled={requesting[book.id]}
                          className={`w-full py-3 px-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                            requesting[book.id]
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
                          }`}
                        >
                          {requesting[book.id] ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                              Mengirim...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Heart className="w-4 h-4" />
                              Request Buku
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-xl transition-colors ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-4 py-2 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                  </>
                )}

                {generatePageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      page === currentPage
                        ? "bg-rose-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-4 py-2 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-xl transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
                  <Book className="w-12 h-12 text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {search
                    ? "Tidak ada buku ditemukan"
                    : "Tidak ada buku donasi ditemukan"}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  {search
                    ? "Coba cari dengan kata kunci lain atau reset pencarian"
                    : "Coba cari dengan kata kunci lain atau jadilah yang pertama untuk berdonasi"}
                </p>
                {search ? (
                  <button
                    onClick={() => setSearch("")}
                    className="inline-flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Reset Pencarian
                  </button>
                ) : (
                  <Link
                    to="/donate"
                    className="inline-flex items-center px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Donasi Buku Pertama
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DonatePage;
