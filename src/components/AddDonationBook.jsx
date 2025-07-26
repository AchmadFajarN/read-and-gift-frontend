import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postDonation } from '../utils/api';
import { Image as ImageIcon } from 'lucide-react';

const initialForm = {
  title: '',
  author: '',
  publisher: '',
  publishYear: '',
  synopsis: '',
  genre: '',
  bookCondition: 'baru',
};

const AddDonatePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setCover(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const token = localStorage.getItem('token'); 

    const response = await postDonation(
      {
        ...form,
        file: cover,
      },
      token
    );

    setLoading(false);

    if (response.status === 'success') {
      navigate('/donations'); // arahkan ke halaman daftar donasi
    } else {
      setErrorMsg(response.message || 'Gagal mengirim donasi');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Donasikan Buku</h2>
      {errorMsg && <p className="text-red-500 mb-4 text-center">{errorMsg}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: 'Judul Buku', name: 'title', type: 'text' },
          { label: 'Penulis', name: 'author', type: 'text' },
          { label: 'Penerbit', name: 'publisher', type: 'text' },
          { label: 'Tahun Terbit', name: 'publishYear', type: 'number' },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sinopsis</label>
          <textarea
            name="synopsis"
            value={form.synopsis}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
          <input
            type="text"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Misal: Fiksi, Misteri"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Buku</label>
          <select
            name="bookCondition"
            value={form.bookCondition}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          >
            <option value="baru">Baru</option>
            <option value="bekas">Bekas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Buku</label>
          <div className="relative flex items-center">
            <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700"
              required
            />
          </div>
          {cover && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(cover)}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? 'Mengirim...' : 'Kirim Donasi'}
        </button>
      </form>
    </div>
  );
};

export default AddDonatePage;
