import { useEffect, useState } from "react";
import {
  getUserById,
  getBookByUserId,
  getLikeStatus,
  likeReview,
  unlikeReview,
} from "../utils/api";
import { Link, useParams } from "react-router-dom";
import {
  ThumbsUp,
  MessageCircle,
  User,
  MapPin,
  Phone,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import StarRating from "./Star";

const ProfilePage = () => {
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [likeState, setLikeState] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    if (id) {
      fetchUserProfile();
      fetchUserReviews();
    }

    console.log(user);
  }, [id, user]);

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

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat profil pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Profile Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={user.url || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {user.fullname}
              </h1>
              <p className="text-blue-100 text-lg mb-4">@{user.username}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-blue-100 mb-6">
                {user.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-semibold">
                    {reviewCount} Review Buku
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {user.no_contact && (
                  <a
                    href={`tel:${user.no_contact}`}
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/30 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{user.no_contact}</span>
                  </a>
                )}

                {user.sosmed_url && user.sosmed_url.length > 0 && (
                  <div className="flex gap-2">
                    {user.sosmed_url.slice(0, 2).map((link, index) => {
                      const finalLink = link.startsWith("http")
                        ? link
                        : `https://${link}`;
                      return (
                        <a
                          key={index}
                          href={finalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/30 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">
                            Social Media {index + 1}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Buku yang Direview
          </h2>
          <p className="text-gray-600">
            Lihat koleksi review buku dari {user.fullname}
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Review
            </h3>
            <p className="text-gray-500">
              {user.fullname} belum memberikan review untuk buku apapun.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reviews.map((review) => {
              const like = likeState[review.id] || {
                liked: false,
                count: 0,
              };

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <Link to={`/book/${review.id}`} className="block">
                    <div className="relative overflow-hidden">
                      <img
                        src={review.cover_url}
                        alt={review.title}
                        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <BookOpen className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    {/* Book Title and Author */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {review.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-medium">
                        oleh {review.author}
                      </p>
                    </div>

                    {/* Publisher and Year */}
                    <div className="text-xs text-gray-500 mb-3">
                      <span>{review.publisher}</span>
                      {review.publish_year && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{review.publish_year}</span>
                        </>
                      )}
                    </div>

                    {/* Genre Tags */}
                    {review.genre && review.genre.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {review.genre.slice(0, 2).map((genre, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                          >
                            {genre}
                          </span>
                        ))}
                        {review.genre.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            +{review.genre.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Synopsis */}
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                      {review.synopsis}
                    </p>

                    {/* Rating and Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleLike(review.id);
                          }}
                          className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <ThumbsUp
                            className={`w-4 h-4 ${
                              like.liked ? "text-blue-600 fill-blue-600" : ""
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {like.count}
                          </span>
                        </button>

                        <div className="flex items-center gap-1 text-gray-500">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {review.comments || 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <StarRating value={review.rating} />
                      </div>
                    </div>
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

export default ProfilePage;
