import { useEffect, useState } from "react";
import {
  getReviewBook,
  getLikeStatus,
  likeReview,
  unlikeReview,
} from "../utils/api";
import { Link } from "react-router-dom";
import StarRating from "./Star";
import { ThumbsUp, MessageCircle } from "lucide-react";

export const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [likeState, setLikeState] = useState({}); // { [reviewId]: { liked: true/false, count: number } }

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await getReviewBook(1, 9, "");
      if (res.status === "success") {
        const data = res.data || [];
        console.log("Fetched books:", data);
        setBooks(data);
        setFiltered(data);

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
      }
    };
    fetchBooks();
  }, [userId]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Pencarian */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Cari judul atau penulis buku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Link
          to="/add-review"
          className="inline-block mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          + Tambah Review Buku
        </Link>
      </div>

      {/* Grid Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((book) => {
          const currentLike = likeState[book.id] || {
            liked: false,
            count: book.likes ?? 0,
          };

          return (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <Link to={`/book/${book.id}`}>
                <img
                  src={book.url}
                  alt={book.title}
                  className="w-full h-60 object-cover"
                />
              </Link>
              <div className="p-4">
                <p className="text-sm text-gray-600 my-1">
                  Posted by: {book.username}
                </p>
                <h3 className="text-lg font-semibold text-gray-900">
                  {book.title}
                </h3>
                <p className="text-gray-600 mb-1">by {book.author}</p>
                <p className="text-gray-500 text-sm mb-1">
                  {book.publisher} &middot; {book.publish_year}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  {book.genre?.join(", ")}
                </p>
                <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                  {book.synopsis}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                    <button
                      onClick={() => handleToggleLike(book.id)}
                      className="flex items-center gap-1 hover:text-blue-600 transition"
                    >
                      <ThumbsUp
                        className={`w-4 h-4 ${
                          currentLike.liked ? "text-blue-600 fill-blue-600" : ""
                        }`}
                      />
                      <span>{currentLike.count}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{book.comments ?? 0}</span>
                    </div>
                  </div>
                  <StarRating value={book.rating} />
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            Tidak ada buku ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
