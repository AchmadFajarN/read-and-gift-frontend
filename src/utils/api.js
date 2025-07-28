// api.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let subscribers = [];

function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}

function onRefreshed(newToken) {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth")
    ) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }
      isRefreshing = true;
      try {
        const res = await axios.put(`${BASE_URL}/auth`, {}, { withCredentials: true });
        const newToken = res.data.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        onRefreshed(newToken);
        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default api;


export const handleSignUp = async (
  { username, fullname, password, email, address, no_contact, sosmed_url },
  file
) => {
  try {
    const response = await api.post("/users/register", {
      username,
      fullname,
      password,
      email,
      address,
      no_contact,
      sosmed_url,
    });

    const { id: userId } = response.data.data;

    const formData = new FormData();
    formData.append("image", file);

    const uploadImageProfile = await api.post(
      `/users/${userId}/profileimg`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const { url: imageUrl } = uploadImageProfile.data.data;

    return {
      status: "success",
      message: "akun berhasil dibuat",
      data: {
        userId,
        email: email,
        imageUrl,
      },
    };
  } catch (err) {
    return {
      status: "error",
      message: err.response?.data,
    };
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { userId, accessToken } = response.data.data;
    localStorage.setItem("accessToken", accessToken);

    const user = await api.get(`/user/${userId}`);
    return {
      status: "success",
      data: {
        ...user.data.data,
        accessToken,
      },
    };
  } catch (err) {
    return {
      status: "error",
      message: err.response?.data?.message,
    };
  }
};

export const getReviewBook = async (page, limit, title = "") => {
  try {
    const response = await api.get(
      `/review?page=${page}&limit=${limit}&title=${title}`
    );
    const { result } = response.data.data;
    return {
      status: "success",
      data: result,
    };
  } catch (err) {
    return {
      status: "error",
      message: err.response,
    };
  }
};

export const addReview = async (
  {
    title,
    author,
    publisher,
    publish_year,
    synopsis,
    genre,
    rating,
    description,
  },
  file
) => {
  try {
    const response = await api.post("/review", {
      title,
      author,
      publisher,
      publish_year,
      synopsis,
      genre,
      rating,
      description,
    });

    const { reviewId } = response.data.data;

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      await api.post(`/review/${reviewId}/img`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    return {
      status: "success",
      message: "review berhasil ditambahkan",
    };
  } catch (err) {
    return {
      status: "error",
      message: err.response?.data?.message,
    };
  }
};

export const postDonation = async (
  {
    title,
    author,
    publisher,
    publishYear,
    synopsis,
    genre,
    bookCondition,
    file,
  }
) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("publisher", publisher);
    formData.append("publishYear", publishYear);
    formData.append("synopsis", synopsis);
    formData.append("genre", genre);
    formData.append("bookCondition", bookCondition);
    formData.append("cover", file);

    const response = await api.post("/donations", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      status: "success",
      data: response.data,
    };
  } catch (err) {
    return {
      status: "fail",
      message: err.response?.data?.message || err.message,
    };
  }
};

export const getBookDonate = async (page, limit) => {
  try {
    const response = await api.get(`/donations?page=${page}&limit=${limit}`);
    const { books } = response.data.data;
    return {
      status: "success",
      data: books,
    };
  } catch (err) {
    return {
      status: "error",
      message: err.response?.data,
    };
  }
};

export const getReviewById = async (id) => {
  try {
    const response = await api.get(`/review/${id}`);
    const { review } = response.data.data;
    return {
      status: "success",
      review,
    };
  } catch (err) {
    return {
      status: "fail",
      message: err.response,
    };
  }
};

export const getBookByUserId = async (id) => {
  try {
    const response = await api.get(`/review/user/${id}`);
    const result = response.data.data.result
    return {
      status: 'success',
      review: result
    }
  } catch(err) {
    return {
      status: 'fail',
      message: err.message
    }
  }
}

export const deleteReview = async (id) => {
  try {
    const response = await api.delete(`/review/${id}`);
    return {
      status: "success",
      message: response.data.message,
    };
  } catch (err) {
    return {
      status: "fail",
      message: err.response?.data?.message || err.message,
    };
  }
};

export const editReview = async (id, reviewData) => {
  try {
    const response = await api.put(`/review/${id}`, reviewData);
    return {
      status: "success",
      message: response.data.message,
    };
  } catch (err) {
    return {
      status: "fail",
      message: err.response?.data?.message || err.message,
    };
  }
};


export const likeReview = async (id) => {
  try {
    const response = await api.post(`/like/${id}`);
    return {
      status: "success",
      message: response.data.message,
    };
  } catch (err) {
    return {
      status: "fail",
      message: err.response?.data?.message || err.message,
    };
  }
};

export const unlikeReview = async (id) => {
  try {
    const response = await api.delete(`/like/${id}`);
    return {
      status: "success",
      message: response.data.message,
    };
  } catch (err) {
    return {
      status: "fail",
      message: err.response?.data?.message || err.message,
    };
  }
};

export const getLikeStatus = async (id) => {
  try {
    const response = await api.get(`/like/${id}`);
    return {
      status: 'success',
      likes: response.data.data.likes,
    };
  } catch (err) {
    return {
      status: 'fail',
      message: err.response?.data?.message || err.message,
    };
  }
};

export const addComment = async (reviewId, comment) => {
  try {
    const response = await api.post(`/comment/${reviewId}`, { comment });
    return {
      status: 'success',
      message: response.data.message,
    };
  } catch (err) {
    return {
      status: 'fail',
      message: err.response?.data?.message || err.message,
    };
  }
};

export const getComments = async (reviewId) => {
  try {
    const response = await api.get(`/comment/${reviewId}`);
    return {
      status: 'success',
      comments: response.data.data.comments,
    };
  } catch (err) {
    return {
      status: 'fail',
      message: err.response?.data?.message || err.message,
    };
  }
};

export const editComment = async (reviewId, comment) => {
  try {
    const response = await api.put(`/comment/${reviewId}`, { comment });
    return {
      status: 'success',
      message: response.data.message,
    };
  } catch (err) {
    return {
      status: 'fail',
      message: err.response?.data?.message || err.message,
    };
  }
};


export const deleteComment = async (reviewId) => {
  try {
    const response = await api.delete(`/comment/${reviewId}`);
    return {
      status: 'success',
      message: response.data.message,
    };
  } catch (err) {
    return {
      status: 'fail',
      message: err.response?.data?.message || err.message,
    };
  }
};

export const getDonationBookById = async (id) => {
  try {
    const response = await api.get(`/donations/${id}`);
    return response.data.data.book;
  } catch (error) {
    console.error("Gagal mengambil detail buku:", error);
    throw error;
  }
};

export const requestDonationBook = async (donationBookId) => {
  try {
    const response = await api.post(`/recipient-donations/${donationBookId}/request`);
    return {
      status: "success",
      data: response.data.data,
    };
  } catch (err) {
    return {
      status: "fail",
      message: err.response?.data?.message || err.message,
    };
  }
};

export const getMyRecipientDonations = async (status = "") => {
  try {
    const url = status
      ? `/recipient-donations?status=${status}`
      : `/recipient-donations`;

    const res = await api.get(url);
    return {
      status: "success",
      data: res.data.data,
    };
  } catch (err) {
    return {
      status: "fail",
      message: err.response?.data?.message || err.message,
    };
  }
};

export const getAllRecipientDonations = async () => {
  try {
    const res = await api.get(`/recipient-donations`);
    return {
      status: "success",
      data: res.data.data,
    };
  } catch (err) {
    return {
      status: "fail",
      message: err.response?.data?.message || err.message,
    };
  }
};

export const updateDonationStatus = async (recipientDonationId, status) => {
  try {
    const res = await api.patch(`/recipient-donations/${recipientDonationId}/status`, {
      status,
    });
    return {
      status: "success",
      message: res.data.message,
    };
  } catch (err) {
    return {
      status: "fail",
      message: err.response?.data?.message || err.message,
    };
  }
};

export const getUserById = async(id) => {
  try {
    const res = await api.get(`/user/${id}`);
    return {
      status: 'success',
      data: res.data.data.result
    }
  } catch(err) {
    return {
      message: err.response
    }
  }
}



