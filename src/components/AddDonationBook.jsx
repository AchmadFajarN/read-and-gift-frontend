import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postDonation } from "../utils/api";
import { ImageIcon, Book } from "lucide-react";
import toast from "react-hot-toast";

const initialForm = {
  title: "",
  author: "",
  publisher: "",
  publishYear: "",
  synopsis: "",
  genre: [],
  bookCondition: "baru",
};

const genreOptions = [
  "Fiksi",
  "Drama",
  "Fantasi",
  "Romantis",
  "Misteri",
  "Non-Fiksi",
];

const AddDonatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const hasChanges =
        Object.keys(form).some((key) => form[key] !== initialForm[key]) ||
        cover !== null;

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
  }, [form, cover]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "publishYear" ? parseInt(value) || "" : value,
    }));
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageLoading(true);
      try {
        const file = e.target.files[0];

        // Validasi ukuran file
        if (file.size > 2 * 1024 * 1024) {
          toast.error("Ukuran file maksimal 2MB");
          return;
        }

        // Validasi tipe file
        if (!file.type.match(/image\/(jpeg|jpg|png)/i)) {
          toast.error("Format file harus PNG, JPG atau JPEG");
          return;
        }

        setCover(file);
      } catch (error) {
        toast.error("Gagal mengupload gambar: " + error.message);
      } finally {
        setImageLoading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Judul buku wajib diisi";
    }

    if (!form.author.trim()) {
      newErrors.author = "Nama penulis wajib diisi";
    }

    if (!form.publisher.trim()) {
      newErrors.publisher = "Penerbit wajib diisi";
    }

    if (form.publishYear) {
      const year = parseInt(form.publishYear);
      const currentYear = new Date().getFullYear();
      if (year > currentYear || year < 1800) {
        newErrors.publishYear = "Tahun terbit tidak valid";
      }
    }

    if (!form.synopsis.trim()) {
      newErrors.synopsis = "Sinopsis wajib diisi";
    }

    if (form.genre.length === 0) {
      newErrors.genre = "Pilih minimal satu genre";
    }

    if (!cover) {
      newErrors.cover = "Cover buku wajib diupload";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm(initialForm);
    setCover(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await postDonation(
        {
          ...form,
          file: cover,
        },
        token
      );

      if (response.status === "success") {
        toast.success("Donasi buku berhasil ditambahkan");
        navigate("/donations");
      } else {
        toast.error(
          "Gagal mengirim donasi: " + (response.message || "Terjadi kesalahan")
        );
      }
    } catch (error) {
      toast.error("Gagal mengirim donasi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="text-center">
          <Book className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Donasikan Buku
          </h1>
          <p className="text-gray-600">
            Berbagi kebahagiaan melalui buku untuk mereka yang membutuhkan
          </p>
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
                name="publishYear"
                value={form.publishYear}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="2024"
                required
              />
              {errors.publishYear && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.publishYear}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Sinopsis
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="synopsis"
                value={form.synopsis}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ringkasan cerita buku"
                rows={4}
                required
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
              {errors.genre && (
                <p className="text-red-500 text-xs mt-1">{errors.genre}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Kondisi Buku
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="bookCondition"
                value={form.bookCondition}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="baru">Baru</option>
                <option value="bekas">Bekas</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Cover Buku
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                    imageLoading ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {imageLoading ? (
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
                    ) : (
                      <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                    )}
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Klik untuk upload</span>{" "}
                      atau drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG atau JPEG (MAX. 2MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={imageLoading}
                  />
                </label>
              </div>
              {cover && (
                <div className="mt-2 relative">
                  <img
                    src={URL.createObjectURL(cover)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => setCover(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
              {errors.cover && (
                <p className="text-red-500 text-xs mt-1">{errors.cover}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Yakin ingin membatalkan?")) {
                    resetForm();
                    navigate("/donations");
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
                    Mengirim...
                  </div>
                ) : (
                  "Kirim Donasi"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDonatePage;
