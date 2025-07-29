import { useEffect, useState } from "react";
import {
  getReviewBook,
  getLikeStatus,
  likeReview,
  unlikeReview,
} from "../utils/api";
import { Link } from "react-router-dom";
import StarRating from "./Star";
import {
  ThumbsUp,
  MessageCircle,
  Book,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [likeState, setLikeState] = useState({});
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const booksPerPage = 3;

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const user = (() => {
    try {
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const res = await getReviewBook(currentPage, booksPerPage, "");
      if (res.status === "success") {
        const data = res.data || [];
        console.log("Fetched books:", res);
        setBooks(data);
        setTotalBooks(res.totalItem || 0);
        setTotalPages(Math.ceil((res.totalItem || 0) / booksPerPage));

        // Get like status untuk semua buku
        const statusPromises = data.map((book) => getLikeStatus(book.id));
        const allStatuses = await Promise.all(statusPromises);

        const newLikeState = {};
        allStatuses.forEach((res, i) => {
          if (res.status === "success") {
            const likesArr = res.likes || [];
            const liked = likesArr.some((like) => like.user_id === userId);
            newLikeState[data[i].id] = {
              liked,
              count: likesArr.length,
            };
          }
        });

        setLikeState(newLikeState);
      } else {
        setBooks([]);
        setTotalBooks(0);
        setTotalPages(1);
      }
      setLoading(false);
    };
    fetchBooks();
  }, [userId, currentPage]);

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

  const handleToggleLike = async (bookId) => {
    const state = likeState[bookId] || { liked: false, count: 0 };
    if (state.liked) {
      const res = await unlikeReview(bookId);
      if (res.status === "success") {
        setLikeState((prev) => ({
          ...prev,
          [bookId]: {
            liked: false,
            count: Math.max(0, state.count - 1),
          },
        }));
      }
    } else {
      const res = await likeReview(bookId);
      if (res.status === "success") {
        setLikeState((prev) => ({
          ...prev,
          [bookId]: {
            liked: true,
            count: state.count + 1,
          },
        }));
      }
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white py-16 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Book className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Review Buku
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Temukan dan bagikan review buku favoritmu bersama komunitas
              pecinta literatur
            </p>

            {totalBooks > 0 && (
              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Book className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {totalBooks} review buku tersedia
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
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Cari judul atau penulis buku..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Link
            to="/add-review"
            className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Review Buku
          </Link>
        </div>

        {/* Pagination Info */}
        {!loading && totalBooks > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Menampilkan {(currentPage - 1) * booksPerPage + 1} -{" "}
              {Math.min(currentPage * booksPerPage, totalBooks)} dari{" "}
              {totalBooks} review buku
            </p>
            <p className="text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat review buku...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Book Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filtered.map((book) => {
                const currentLike = likeState[book.id] || {
                  liked: false,
                  count: book.likes ?? 0,
                };

                return (
                  <div
                    key={book.id}
                    className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
                  >
                    <Link to={`/book/${book.id}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={book.url}
                          alt={book.title}
                          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <StarRating value={book.rating} />
                        </div>
                      </div>
                    </Link>

                    <div className="p-6">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <img
                            src={user?.url || "/default-avatar.png"}
                            alt={book.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {book.username}
                          </span>
                          <p className="text-xs text-gray-500">Reviewer</p>
                        </div>
                      </div>

                      {/* Book Info */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 font-medium">
                        oleh {book.author}
                      </p>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {book.genre?.slice(0, 3).map((g) => (
                          <span
                            key={g}
                            className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100"
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

                      <p className="text-gray-700 text-sm line-clamp-2 mb-6 leading-relaxed">
                        {book.synopsis}
                      </p>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleToggleLike(book.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                              currentLike.liked
                                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                            }`}
                          >
                            <ThumbsUp
                              className={`w-4 h-4 ${
                                currentLike.liked ? "fill-current" : ""
                              }`}
                            />
                            <span className="text-sm font-medium">
                              {currentLike.count}
                            </span>
                          </button>
                          <div className="flex items-center gap-2 text-gray-500 px-3 py-2">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">
                              {book.comments ?? 0}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 font-medium">
                            {book.publisher}
                          </p>
                          <p className="text-xs text-gray-400">
                            {book.publish_year}
                          </p>
                        </div>
                      </div>
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
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-4 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
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
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
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
                      className="px-4 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
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
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                  <Book className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {search
                    ? "Tidak ada buku ditemukan"
                    : "Tidak ada review buku ditemukan"}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  {search
                    ? "Coba cari dengan kata kunci lain atau reset pencarian"
                    : "Coba cari dengan kata kunci lain atau tambah review pertama"}
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
                    to="/add-review"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Review Pertama
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

export default BooksPage;
