import { useEffect, useState } from "react";
import { getBookDonate } from "../utils/api";
import { Link } from "react-router-dom";
import { requestDonationBook } from "../utils/api";


const DonatePage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await getBookDonate(1, 30);
      console.log(res);
      if (res.status === "success") {
        setBooks(res.data || []);
      } else {
        setBooks([]);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(books);
    } else {
      setFiltered(
        books.filter(
          (book) =>
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, books]);

  const handleRequest = async (bookId) => {
  const confirm = window.confirm("Apakah kamu yakin ingin meminta buku ini?");
  if (!confirm) return;

  const res = await requestDonationBook(bookId);
  if (res.status === "success") {
    alert("Permintaan donasi berhasil dikirim!");
  } else {
    alert(`Gagal mengirim permintaan: ${res.message}`);
  }
};

   return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Pencarian */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Cari judul atau penulis buku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Link
          to="/donate"
          className="my-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          + Tambah Donasi Buku
        </Link>
      </div>

      {/* Grid Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((book, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          >
            <div className="flex mb-8">
              <img
                src={book.donationCoverPath}
                alt={book.title}
                className="rounded-xl w-40 h-60 object-cover flex-2"
              />
              <div className="p-4 flex-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {book.title}
                </h3>
                <p className="text-gray-600 mb-1">by {book.author}</p>
                <p className="text-gray-500 text-sm mb-1">
                  {book.publisher} &middot; {book.publish_year}
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  {book.genre && book.genre.join(", ")}
                </p>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {book.synopsis}
                </p>
              </div>
            </div>
            <button onClick={() => handleRequest(book.id)} className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                Request Buku
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            Tidak ada buku ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};

export default DonatePage;
