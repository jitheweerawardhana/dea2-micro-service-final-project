import axios from "axios";

// Requests go to the same origin (Next.js dev server) and get
// proxied to the API Gateway via the rewrite rule in next.config.mjs.
// This avoids CORS issues entirely.
const apiGateway = axios.create({
  baseURL: "", // same-origin — Next.js rewrites /api/* to the gateway
  headers: {
    "Content-Type": "application/json",
  },
});

// You can add request/response interceptors here for auth tokens, etc.
apiGateway.interceptors.request.use(
  (config) => {
    // Example: Add Authorization Header if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiGateway;
