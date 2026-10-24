import axios from "axios";

// Automatically use Render URL in production if VITE_API_URL is missing
const baseURL = import.meta.env.VITE_API_URL || 'https://ai-interview-guide-and-resume-builder.onrender.com';

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Needed if you are using cookies/sessions for auth
});

// Interceptor to inject bearer token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function register({ username, email, password }) {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password
  });

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", {
    email,
    password
  });

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
}

export async function logout() {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data;
  } finally {
    localStorage.removeItem("token");
  }
}

export async function getMe() {
  const response = await api.get("/api/auth/get-me");
  return response.data;
}
