import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Image as ImageIcon, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { handleSignUp } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigation = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [sosmedUrls, setSosmedUrls] = useState(['']);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    address: '',
    no_contact: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSosmedChange = (idx, value) => {
    const newUrls = [...sosmedUrls];
    newUrls[idx] = value;
    setSosmedUrls(newUrls);
  };

  const addSosmedField = () => setSosmedUrls([...sosmedUrls, '']);
  const removeSosmedField = (idx) => setSosmedUrls(sosmedUrls.filter((_, i) => i !== idx));

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const signup = async() => {
    setLoading(true);
    const newUser = {
      ...form,
      sosmed_url: sosmedUrls
    }

    const result = await handleSignUp(newUser, image);
    console.log(result);
    try {
      if (result.status === 'success') {
        navigation('/login')
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    signup()
  };

  return (
    <div className="my-8 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <User className="w-10 h-10 text-blue-700 mb-2" />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Daftar Akun Baru</h2>
          <p className="text-gray-500 text-center">Isi data berikut untuk membuat akun baru.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Username"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Nama Lengkap"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Email"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Alamat"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">No. Kontak</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                name="no_contact"
                value={form.no_contact}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                placeholder="Nomor Kontak"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sosial Media</label>
            {sosmedUrls.map((url, idx) => (
              <div className="flex items-center mb-2" key={idx}>
                <div className="relative w-full">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                    placeholder="URL Sosial Media"
                    value={url}
                    onChange={e => handleSosmedChange(idx, e.target.value)}
                  />
                </div>
                {sosmedUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSosmedField(idx)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Hapus
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSosmedField}
              className="mt-1 text-blue-600 hover:text-blue-800 text-sm"
            >
              + Tambah Sosmed
            </button>
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
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60"
          >
            { loading? 'memuat...' : 'daftar' }
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Sudah punya akun?
            <Link
              to="/login"
              className="ml-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;