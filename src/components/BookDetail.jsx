import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getReviewById,
  getComments,
  addComment,
  editComment,
  deleteComment,
  deleteReview,
} from "../utils/api";
import { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  MessageCircle,
  Pencil,
  Trash2,
  User,
  Calendar,
  BookOpen,
} from "lucide-react";
import StarRating from "./Star";
import toast from "react-hot-toast";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Memoize functions to prevent infinity loop
  const getBookDetail = useCallback(async () => {
    try {
      const result = await getReviewById(id);
      setReview(result.review);
    } catch (error) {
      toast.error("Gagal memuat detail buku");
      console.error(error);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await getComments(id);
      if (res.status === "success") {
        setComments(res.comments || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([getBookDetail(), fetchComments()]);
    };

    loadData();
  }, [getBookDetail, fetchComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const res = await addComment(id, newComment);
      if (res.status === "success") {
        setNewComment("");
        await fetchComments();
        toast.success("Komentar berhasil ditambahkan");
      } else {
        toast.error("Gagal menambahkan komentar");
      }
    } catch (error) {
      toast.error("Gagal menambahkan komentar. " + error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleStartEdit = (index, commentText) => {
    setEditIndex(index);
    setEditText(commentText);
  };

  const handleEditComment = async (e) => {
    e.preventDefault();
    if (!editText.trim()) return;

    try {
      const res = await editComment(id, editText);
      if (res.status === "success") {
        setEditIndex(null);
        setEditText("");
        await fetchComments();
        toast.success("Komentar berhasil diupdate");
      } else {
        toast.error("Gagal mengupdate komentar");
      }
    } catch (error) {
      toast.error("Gagal mengupdate komentar." + error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;

    try {
      const res = await deleteComment(commentId);
      if (res.status === "success") {
        await fetchComments();
        toast.success("Komentar berhasil dihapus");
      } else {
        toast.error("Gagal menghapus komentar");
      }
    } catch (error) {
      toast.error("Gagal menghapus komentar." + error);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm("Apakah kamu yakin ingin menghapus review ini?"))
      return;

    try {
      const res = await deleteReview(id);
      if (res.status === "success") {
        toast.success("Review berhasil dihapus");
        navigate("/books");
      } else {
        toast.error("Gagal menghapus review: " + res.message);
      }
    } catch (error) {
      toast.error("Gagal menghapus review." + error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Review tidak ditemukan</p>
          <Link
            to="/books"
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/books"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Book Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <img
                className="w-48 h-72 object-cover rounded-xl shadow-md mx-auto lg:mx-0"
                src={review.cover_url}
                alt={review.title}
              />
            </div>

            {/* Book Info */}
            <div className="flex-grow">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {review.title}
                </h1>
                <p className="text-lg text-gray-600 mb-4">by {review.author}</p>

                {/* Rating and Year */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <StarRating readOnly={true} value={review.rating || 0} />
                    <span className="text-sm text-gray-500">
                      ({review.rating}/5)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{review.publish_year}</span>
                  </div>
                </div>

                {/* Genre Tags */}
                {review.genre && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {review.genre.map((g, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {currentUser?.id === review.owner && (
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/edit-review/${id}`}
                    className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Review
                  </Link>
                  <button
                    onClick={handleDeleteReview}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Synopsis and Review */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sinopsis
              </h3>
              <p className="text-gray-700 leading-relaxed">{review.synopsis}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Review
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {review.description}
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Komentar ({comments.length})
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tulis komentar kamu..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows="3"
                required
              />
            </div>
            <button
              type="submit"
              disabled={commentLoading}
              className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {commentLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Mengirim...
                </>
              ) : (
                "Kirim Komentar"
              )}
            </button>
          </form>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                >
                  {editIndex === index ? (
                    <form onSubmit={handleEditComment} className="space-y-3">
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows="3"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                          onClick={() => {
                            setEditIndex(null);
                            setEditText("");
                          }}
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {comment.username}
                          </span>
                        </div>
                        {comment.username === currentUser?.username && (
                          <div className="flex gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-700 transition-colors duration-200 p-1"
                              onClick={() =>
                                handleStartEdit(index, comment.comment)
                              }
                              title="Edit komentar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-700 transition-colors duration-200 p-1"
                              onClick={() => handleDeleteComment(comment.id)}
                              title="Hapus komentar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {comment.comment}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Belum ada komentar. Jadilah yang pertama berkomentar!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
