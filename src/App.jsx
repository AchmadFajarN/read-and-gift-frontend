import "./style/index.css";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Homepage } from "./components/Homepage";
import { BooksPage } from "./components/BooksPage";
import { PrivateRoute } from "./components/PrivateRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import AddBookReview from "./components/AddBookReview";
import DonatePage from "./components/DonatePage";
import AddDonatePage from "./components/AddDonationBook";
import BookDetail from "./components/BookDetail";
import EditBookReview from "./components/EditBookReview";
import ProfilePage from "./components/ProfilePage";
import MyRequestsPage from "./components/MyRequestPage";
import RequestManagePage from "./components/RequestManagePage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/books"
          element={
            <PrivateRoute>
              <BooksPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-review"
          element={
            <PrivateRoute>
              <AddBookReview />
            </PrivateRoute>
          }
        />
        <Route
          path="edit-review/:id"
          element={
            <PrivateRoute>
              <EditBookReview />
            </PrivateRoute>
          }
        />
        <Route path="/manage-requests" element={<RequestManagePage />} />
        <Route path="/donations" element={<DonatePage />} />
        <Route path="/my-requests" element={<MyRequestsPage />} />
        <Route path="/donate" element={<AddDonatePage />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
