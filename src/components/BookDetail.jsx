import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getReviewById,
  getComments,
  addComment,
  editComment,
  deleteComment,
  deleteReview,
} from "../utils/api";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, Pencil, Trash2 } from "lucide-react";
import StarRating from "./Star";

const BookDetail = () => {
  const { id } = useParams();
  
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const getBookDetail = async () => {
    const result = await getReviewById(id);
    setReview(result.review);
    console.log(result.review);
  };

  const fetchComments = async () => {
    const res = await getComments(id);
    if (res.status === "success") {
      setComments(res.comments || []);
    }
  };

  useEffect(() => {
    getBookDetail();
    fetchComments();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const res = await addComment(id, newComment);
    if (res.status === "success") {
      setNewComment("");
      fetchComments();
    }
  };

  const handleStartEdit = (index, commentText) => {
    setEditIndex(index);
    setEditText(commentText);
  };

  const handleEditComment = async (e) => {
    e.preventDefault();
    if (!editText.trim()) return;

    const res = await editComment(id, editText);
    if (res.status === "success") {
      setEditIndex(null);
      setEditText("");
      fetchComments();
    }
  };

  const handleDeleteComment = async () => {
    const res = await deleteComment(id);
    if (res.status === "success") {
      fetchComments();
    }
  };

  const handleDeleteReview = async () => {
    const confirmed = confirm("Apakah kamu yakin ingin menghapus review ini?");
    if (!confirmed) return;

    const res = await deleteReview(id);
    if (res.status === "success") {
      alert("Review berhasil dihapus.");
      navigate("/books");
    } else {
      alert("Gagal menghapus review: " + res.message);
    }
  };

  if (!review) return <p className="p-4 text-gray-600">Memuat data...</p>;

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-16 py-4 bg-blue-100/20">
        <Link to={"/books"} className="flex gap-2">
          <ArrowLeft />
          Kembali ke Home
        </Link>
      </div>

      <div className="mt-2 px-8 lg:px-16">
        <h2 className="text-2xl font-semibold text-gray-800">{review.title}</h2>
        <p className="mb-2">{review.author}</p>
        <img
          className="mt-2 w-xs h-100 mb-4 rounded-xl object-cover"
          src={review.cover_url}
          alt={review.title}
        />
        <div className="flex gap-30 items-center">
          <StarRating readOnly={true} value={review.rating || 0} />
          <p className="mt-2 font-bold text-gray-600">{review.publish_year}</p>
        </div>
        <div>
          <p className="mt-2 text-gray-600">Synopsis</p>
          <p>{review.synopsis}</p>
          <p className="text-gray-600 mt-2">Review</p>
          <p>{review.description}</p>
        </div>

        {/* TOMBOL EDIT & DELETE REVIEW */}
        {currentUser?.id === review.owner && (
          <div className="flex gap-3 mt-4">
            <Link
              to={`/edit-review/${id}`}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit Review
            </Link>
            <button
              onClick={handleDeleteReview}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Hapus Review
            </button>
          </div>
        )}
      </div>

      {/* Komentar */}
      <div className="px-8 lg:px-16 mt-10 mb-5">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Komentar
        </h3>

        {comments.length > 0 ? (
          <ul className="space-y-3 mb-6">
            {comments.map((comment, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">
                {editIndex === index ? (
                  <form onSubmit={handleEditComment}>
                    <textarea
                      className="w-full p-2 mb-2 border rounded"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        className="bg-gray-300 px-2 py-1 rounded"
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
                    <p className="text-sm text-gray-800">{comment.comment}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      oleh <span className="font-medium">{comment.username}</span>
                    </p>
                    {comment.username === currentUser?.username && (
                      <div className="flex gap-2 mt-2">
                        <button
                          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                          onClick={() =>
                            handleStartEdit(index, comment.comment)
                          }
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline text-sm flex items-center gap-1"
                          onClick={handleDeleteComment}
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mb-4">Belum ada komentar.</p>
        )}

        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar kamu..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
            rows="3"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Kirim Komentar
          </button>
        </form>
      </div>
    </>
  );
};

export default BookDetail;
