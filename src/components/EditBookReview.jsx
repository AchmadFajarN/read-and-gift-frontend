import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { editReview, getReviewById } from "../utils/api";
import { Book } from "lucide-react";
import toast from "react-hot-toast";

const initialForm = {
  title: "",
  author: "",
  publisher: "",
  publish_year: "",
  synopsis: "",
  genre: [],
  rating: "",
  description: "",
};

const genreOptions = [
  "Fiksi",
  "Drama",
  "Fantasi",
  "Romantis",
  "Misteri",
  "Non-Fiksi",
];

const EditBookReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Load existing review data
  useEffect(() => {
    const loadReviewData = async () => {
      try {
        setDataLoading(true);
        const result = await getReviewById(id);
        if (result.status === "success") {
          const reviewData = result.review;
          setForm({
            title: reviewData.title || "",
            author: reviewData.author || "",
            publisher: reviewData.publisher || "",
            publish_year: reviewData.publish_year || "",
            synopsis: reviewData.synopsis || "",
            genre: reviewData.genre || [],
            rating: reviewData.rating || "",
            description: reviewData.description || "",
          });
        } else {
          toast.error("Gagal memuat data review");
          navigate("/books");
        }
      } catch (error) {
        toast.error("Gagal memuat data review: " + error.message);
        navigate("/books");
      } finally {
        setDataLoading(false);
      }
    };

    if (id) {
      loadReviewData();
    }
  }, [id, navigate]);

  // Prevent page reload when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const hasChanges = Object.keys(form).some(
        (key) => form[key] !== initialForm[key]
      );

      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "rating" || name === "publish_year"
          ? parseInt(value) || ""
          : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Judul buku wajib diisi";
    }

    if (!form.author.trim()) {
      newErrors.author = "Nama penulis wajib diisi";
    }

    if (!form.rating) {
      newErrors.rating = "Rating wajib dipilih";
    }

    if (form.publish_year) {
      const year = parseInt(form.publish_year);
      const currentYear = new Date().getFullYear();
      if (year > currentYear || year < 1800) {
        newErrors.publish_year = "Tahun terbit tidak valid";
      }
    }

    if (!form.description.trim()) {
      newErrors.description = "Ulasan wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await editReview(id, form);
      console.log("res submit => ", result);

      if (result.status !== "success") {
        toast.error("Gagal memperbarui review: " + result.message);
        return;
      }

      toast.success("Review berhasil diperbarui!");
      navigate("/books");
    } catch (error) {
      toast.error("Gagal memperbarui review: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data review...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <Book className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Review Buku
          </h1>
          <p className="text-gray-600">Perbarui review bukumu</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Judul Buku
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Masukkan judul buku"
                required
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Penulis
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Nama penulis"
                required
              />
              {errors.author && (
                <p className="text-red-500 text-xs mt-1">{errors.author}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Penerbit
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="publisher"
                value={form.publisher}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Nama penerbit"
                required
              />
              {errors.publisher && (
                <p className="text-red-500 text-xs mt-1">{errors.publisher}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tahun Terbit
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="publish_year"
                value={form.publish_year}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="2024"
                required
              />
              {errors.publish_year && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.publish_year}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Sinopsis
              </label>
              <textarea
                name="synopsis"
                value={form.synopsis}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Sinopsis buku"
                rows={3}
              />
              {errors.synopsis && (
                <p className="text-red-500 text-xs mt-1">{errors.synopsis}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Genre
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {genreOptions.map((genre) => (
                  <label
                    key={genre}
                    className={`inline-flex items-center px-3 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                      form.genre.includes(genre)
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    } border`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={form.genre.includes(genre)}
                      onChange={(e) => {
                        const newGenres = e.target.checked
                          ? [...form.genre, genre]
                          : form.genre.filter((g) => g !== genre);
                        setForm((prev) => ({ ...prev, genre: newGenres }));
                      }}
                    />
                    <span className="text-sm">{genre}</span>
                  </label>
                ))}
              </div>
              {form.genre.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Pilih minimal satu genre
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Rating
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, rating: value }))
                    }
                    className={`w-10 h-10 rounded-full transition-all duration-200 ${
                      form.rating === value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Ulasan Lengkap
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ulasan lengkap tentang buku ini"
                rows={4}
                required
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Yakin ingin membatalkan perubahan?")) {
                    navigate("/books");
                  }
                }}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Memperbarui...
                  </div>
                ) : (
                  "Perbarui Review"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookReview;
