import { useState } from 'react';
import { addReview } from '../utils/api';
import { ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const AddBookReview = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'rating' || name === 'publish_year' ? parseInt(value) || '' : value,
    }));
  };

   const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
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
    // Kirim data form ke backend di sini
    const result = await addReview(form, image);

    if (result.status === 'success') {
        alert('Review Berhasil ditambahkan');
        setForm(initialForm);
        setImage(null)
        navigate('/books')
    } 
    console.log(form);
    console.log(result);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Tambah Review Buku</h2>
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
            max={6}
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
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
            <div className="relative flex items-center">
              <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm `text-gray-700"
              />
            </div>
            {image && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Simpan Review
        </button>
      </form>
    </div>
  );
};

export default AddBookReview;