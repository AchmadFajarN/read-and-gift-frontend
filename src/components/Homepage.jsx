import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Gift,
  ArrowRight,
  Star,
  Heart,
  Users,
  TrendingUp,
} from "lucide-react";
import image1 from "../assets/image1.jpeg";
import image2 from "../assets/image2.jpeg";
import image3 from "../assets/image3.jpeg";
import image4 from "../assets/image4.jpeg";

export const Homepage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Review & Rating",
      description:
        "Bagikan pengalaman membaca dan berikan rating untuk buku favorit Anda",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Gift,
      title: "Donasi Buku",
      description:
        "Berikan buku kepada yang membutuhkan dan sebarkan kebahagiaan membaca",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Komunitas",
      description:
        "Bergabung dengan ribuan pecinta buku dari seluruh Indonesia",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-rose-600/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Temukan Buku
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                    Favorit Anda
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-xl">
                  Bergabunglah dengan komunitas pecinta buku untuk berbagi
                  ulasan, menemukan bacaan baru, dan menyebarkan kegembiraan
                  membaca melalui donasi buku.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/books")}
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
                >
                  <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Jelajahi Review Buku</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/donate")}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 border-2 border-gray-200 hover:border-rose-300 hover:text-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Gift className="w-5 h-5" />
                  <span>Donasi Buku</span>
                </button>
              </div>
            </div>

            {/* Hero Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="group relative overflow-hidden rounded-3xl shadow-xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                    <img
                      src={image1}
                      alt="Sampul buku"
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="group relative overflow-hidden rounded-3xl shadow-xl transform -rotate-2 hover:-rotate-3 transition-transform duration-300">
                    <img
                      src={image2}
                      alt="Sampul buku"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <div className="space-y-6 mt-8">
                  <div className="group relative overflow-hidden rounded-3xl shadow-xl transform -rotate-3 hover:-rotate-6 transition-transform duration-300">
                    <img
                      src={image3}
                      alt="Sampul buku"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="group relative overflow-hidden rounded-3xl shadow-xl transform rotate-2 hover:rotate-4 transition-transform duration-300">
                    <img
                      src={image4}
                      alt="Sampul buku"
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-bounce">
                <Star className="w-8 h-8 text-yellow-500 fill-current" />
              </div>
              <div className="absolute bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl animate-pulse">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
              </div>
              <div className="absolute top-1/2 right-8 bg-white rounded-full p-3 shadow-lg animate-bounce delay-500">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Mengapa Memilih
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Read&Give?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Platform terlengkap untuk para pecinta buku dengan fitur-fitur
              unggulan yang memudahkan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent transform hover:-translate-y-2"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${
                      feature.color.split(" ")[1]
                    }, ${feature.color.split(" ")[3]})`,
                  }}
                ></div>

                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Siap Memulai
            <span className="block">Petualangan Membaca?</span>
          </h2>
          <p className="text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Bergabunglah dengan ribuan pembaca yang telah menemukan buku favorit
            mereka melalui Read&Give.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate("/books")}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Mulai Jelajahi Sekarang</span>
            </button>
            <button
              onClick={() => navigate("/donate")}
              className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-white text-white rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-xl"
            >
              <Gift className="w-5 h-5" />
              <span>Mulai Berdonasi</span>
            </button>
          </div>

          <div className="mt-12 text-white/80">
            <p className="text-sm">
              Gratis untuk semua • Tanpa iklan • Komunitas terpercaya
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
