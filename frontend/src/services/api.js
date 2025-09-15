import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Pizza API funkce
export const pizzaAPI = {
  getAll: () => api.get("/pizzas"),
  getById: (id) => api.get(`pizzas/${id}`),
  create: (pizzaData) => api.post("/pizzas", pizzaData),
  update: (id, pizzaData) => api.put(`/pizzas/${id}, pizzaData`),
  delete: (id) => api.delete(`/pizzas/${id}`),
};

// Order API funkce
export const orderAPI = {
  create: (orderData) => api.post("/orders", orderData),
  getUserOrders: () => api.get("/orders"),
  getAllOrders: () => api.get("/orders/all"),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Reservation API funkce
export const reservationAPI = {
  create: (reservationData) => api.post("/reservations", reservationData),
  getAll: () => api.get("/reservations"),
  updateStatus: (id, status) =>
    api.put(`/reservations/${id}/status`, { status })
};

export default api;
