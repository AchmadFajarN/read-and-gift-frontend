import { useState, useRef, useEffect } from "react";
import { BookOpen, User, LogOut, Home, List } from "lucide-react";
import { APP_CONFIG } from "../constants";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Ambil data user dari localStorage jika ada
  const user = (() => {
    try {
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  const isAuthenticated = !!user;

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo dan nama aplikasi */}
            <Link to="/" className="flex items-center space-x-2 cursor-pointer">
              <BookOpen className="w-8 h-8 text-blue-700" />
              <h1 className="text-2xl font-bold text-gray-900">
                {APP_CONFIG.NAME}
              </h1>
            </Link>

            {/* Link navigasi utama */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-blue-700 bg-blue-50"
              >
                <Home className="w-5 h-5" />
                <span>Beranda</span>
              </Link>
              <Link
                to="/books"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-700"
              >
                <BookOpen className="w-5 h-5" />
                <span>Telusuri Buku</span>
              </Link>
              <Link
                to="/donations"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-green-700"
              >
                <List className="w-5 h-5" />
                <span>Daftar Donasi</span>
              </Link>
            </div>

            {/* Aksi pengguna (login/profile menu) */}
            <div
              className="flex items-center space-x-4 relative"
              ref={dropdownRef}
            >
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-none"
                  >
                    <img
                      src={user.url}
                      alt={user.fullname}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.username}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 top-10 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to={`/profile/${user?.id}`}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profil
                      </Link>
                      <Link
                        to="/my-requests"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Permintaan Saya
                      </Link>
                      <Link
                        to="/manage-requests"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        Permintaan Masuk
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
