import { useState } from 'react';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';


const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginHandler = async () => {
  setLoading(true);
  try {
    const result = await login(form);
    if (result.status === 'success' && result.data.accessToken) {
      localStorage.setItem('token', result.data.accessToken);
      localStorage.setItem('user', JSON.stringify(result.data.result));
   
      navigate('/books');
    }
    if (result.status === 'error') {
      setErrorMessage(true);
    }
    console.log(result);
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    loginHandler();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <BookOpen className="w-10 h-10 text-blue-700 mb-2" />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Masuk ke Read&Give</h2>
          <p className="text-gray-500 text-center">Selamat datang kembali! Silakan login untuk melanjutkan.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
                placeholder="Masukkan email Anda"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 border-gray-300"
                placeholder="Masukkan password Anda"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        <p className='text-xs text-red-600'>{errorMessage && 'email atau password salah'}</p>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum punya akun?
            <Link to={'/register'}
              className="ml-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
              type="button"
            >
              Daftar
            </Link>
          </p>
        </div>
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200" type="button" disabled={loading}>
            Lupa password Anda?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;