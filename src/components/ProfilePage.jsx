import { useEffect, useState } from "react";
import {
  getUserById,
  getBookByUserId,
  getLikeStatus,
  likeReview,
  unlikeReview,
} from "../utils/api";
import { Link, useParams } from "react-router-dom";
import { ThumbsUp, MessageCircle } from "lucide-react";
import StarRating from "./Star";

const ProfilePage = () => {
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [likeState, setLikeState] = useState({});
  const [user, setUser] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await getUserById(id);
        if (res.status === "success") {
          setUser(res.data);
        }
        console.log(res);
      } catch (err) {
        console.error("Gagal mengambil data user:", err.message);
      }
    };

    const fetchUserReviews = async () => {
      const result = await getBookByUserId(id);
      if (result.status === "success") {
        const data = result.review || [];
        setReviews(data);
        setReviewCount(data.length);

        const likeStatuses = await Promise.all(
          data.map((review) => getLikeStatus(review.id))
        );

        const likeData = {};
        likeStatuses.forEach((res, i) => {
          if (res.status === "success") {
            const likesArr = res.likes || [];
            const liked = likesArr.some((l) => l.user_id === id);
            likeData[data[i].id] = {
              liked,
              count: likesArr.length,
            };
          }
        });

        setLikeState(likeData);
      } else {
        console.error("Gagal mengambil review:", result.message);
      }
    };

    if (id) {
      fetchUserProfile();
      fetchUserReviews();
    }

    console.log(user);
  }, [id]);

  const handleToggleLike = async (reviewId) => {
    const state = likeState[reviewId] || { liked: false, count: 0 };

    if (state.liked) {
      const res = await unlikeReview(reviewId);
      if (res.status === "success") {
        setLikeState((prev) => ({
          ...prev,
          [reviewId]: { liked: false, count: Math.max(0, state.count - 1) },
        }));
      }
    } else {
      const res = await likeReview(reviewId);
      if (res.status === "success") {
        setLikeState((prev) => ({
          ...prev,
          [reviewId]: { liked: true, count: state.count + 1 },
        }));
      }
    }
  };

  if (!user) return <p>Memuat data pengguna...</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col items-center p-6 shadow-lg">
        <img
          src={user.url}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white"
        />
        <h2 className="text-xl font-semibold">{user.fullname}</h2>
        <p className="text-gray-400">@{user.username}</p>
        <p className="mt-2 text-sm text-center">{user.address}</p>

        <div className="mt-4 text-sm text-center">
          <span className="font-semibold">{reviewCount}</span> Review Buku
        </div>

        <div className="mt-6 w-full">
          <ul className="space-y-2">
            <li className="block px-4 py-2 hover:bg-gray-700 rounded">
              {user.no_contact}
            </li>
         
              {user.sosmed_url.map((link, index) => {
                const finalLink = link.startsWith("http") ? link : `https://${link}`;
                return (
                  <li key={index}>
                      <a
                        href={finalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 hover:bg-gray-700 rounded"
                      >
                        Link Sosmed ke-{index}
                      </a>
                  </li>

                );
              })}
          </ul>
        </div>
      </aside>

      {/* List Card */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Buku yang direview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => {
            const like = likeState[review.id] || {
              liked: false,
              count: 0,
            };

            return (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <Link to={`/book/${review.id}`}>
                  <img
                    src={review.cover_url}
                    alt={review.title}
                    className="w-full h-60 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <p className="text-sm text-gray-600 my-1">
                    Posted by: {review.username}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {review.title}
                  </h3>
                  <p className="text-gray-600 mb-1">by {review.author}</p>
                  <p className="text-gray-500 text-sm mb-1">
                    {review.publisher} &middot; {review.publish_year}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    {review.genre.join(", ")}
                  </p>
                  <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                    {review.synopsis}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                      <button
                        onClick={() => handleToggleLike(review.id)}
                        className="flex items-center gap-1 hover:text-blue-600 transition"
                      >
                        <ThumbsUp
                          className={`w-4 h-4 ${
                            like.liked ? "text-blue-600 fill-blue-600" : ""
                          }`}
                        />
                        <span>{like.count}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{review.comments ?? 0}</span>
                      </div>
                    </div>
                    <StarRating value={review.rating} />
                  </div>
                </div>
              </div>
            );
          })}
          {reviews.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              Tidak ada review ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
