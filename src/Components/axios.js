import axios from "axios";

axios.defaults.baseURL = `${import.meta.env.VITE_API_BASE_URL}/api`;

//REQUEST INTERCEPTOR (Attach token)
axios.interceptors.request.use(
  (config) => {
    const stored = sessionStorage.getItem("cooperative-details");
    const credentials = stored ? JSON.parse(stored) : null;

    if (credentials?.token) {
      config.headers.Authorization = `Bearer ${credentials.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (Handle global errors)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      //Skip refresh endpoint
      if (error.config.url.includes("refresh-token")) {
        return Promise.reject(error);
      }

      sessionStorage.removeItem("cooperative-details");
      window.location.href = "/cooperative-signin";
    }

    return Promise.reject(error);
  }
);

export default axios;