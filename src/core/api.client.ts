import axios from "axios";

// 1. Kita buat "Instance" (Kurir Khusus)
// Di sini kita set Base URL-nya sekali saja.
export const apiClient = axios.create({
  baseURL: "http://127.0.0.1:3000/api/v1", // Sama seperti variabel baseUrl kamu tadi
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari LocalStorage (atau tempat simpan lain)
    const token = localStorage.getItem("token"); 
    
    // Kalau ada token, tempel ke Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Opsional tapi berguna)
// Kalau token kadaluarsa (401), kita bisa otomatis logout user di sini.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token tidak valid/kadaluarsa
      console.error("Unauthorized! Redirecting to login...");
      // localStorage.removeItem("token");
      // window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);


