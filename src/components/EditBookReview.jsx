import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { editReview } from '../utils/api';

const initialForm = {
  title: '',
  author: '',
  publisher: '',
  publish_year: '',
  synopsis: '',
  genre: [],
  rating: '',
  description: '',
};

const genreOptions = ['Fiksi', 'Drama', 'Fantasi', 'Romantis', 'Misteri', 'Non-Fiksi'];

const EditBookReview = () => {
  const { id } = useParams(); // ID review dari URL
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenreChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setForm((prev) => ({
      ...prev,
      genre: selected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await editReview(id, form);
    setLoading(false);

    if (res.status === 'success') {
      alert('Review berhasil diperbarui!');
      navigate(`/review/books`);
    } else {
      alert(`Gagal memperbarui review: ${res.message}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Review Buku</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul Buku</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Judul Buku"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Penulis"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label>
          <input
            type="text"
            name="publisher"
            value={form.publisher}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Penerbit"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Terbit</label>
          <input
            type="number"
            name="publish_year"
            value={form.publish_year}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="2024"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sinopsis</label>
          <textarea
            name="synopsis"
            value={form.synopsis}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Sinopsis buku"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
          <select
            name="genre"
            multiple
            value={form.genre}
            onChange={handleGenreChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          >
            {genreOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <small className="text-gray-500">* Tekan Ctrl (atau Cmd di Mac) untuk memilih lebih dari satu genre</small>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <input
            type="number"
            name="rating"
            min={1}
            max={5}
            value={form.rating}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="1-5"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ulasan Lengkap</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Ulasan lengkap tentang buku ini."
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Review'}
        </button>
      </form>
    </div>
  );
};

export default EditBookReview;
