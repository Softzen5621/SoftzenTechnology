import axios from "axios";

// ======================================================
// BASE URL
// ======================================================

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  `${import.meta.env.VITE_API_URL}`;

// ======================================================
// API INSTANCE
// ======================================================

const API = axios.create({

  baseURL: BASE_URL,

  headers: {

    "Content-Type":
      "application/json",
  },

  withCredentials: false,
});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

API.interceptors.request.use(

  (config) => {

    try {

      // ================================================
      // GET AUTH DATA
      // ================================================

      const storedAuth =
        localStorage.getItem(
          "erp_auth"
        );

      if (!storedAuth)
        return config;

      // ================================================
      // PARSE AUTH
      // ================================================

      const authData =
        JSON.parse(storedAuth);

      const token =
        authData?.token;

      // ================================================
      // ATTACH TOKEN
      // ================================================

      if (token) {

        config.headers.Authorization =
          `Bearer ${token}`;
      }

      return config;

    } catch (error) {

      console.error(
        "REQUEST INTERCEPTOR ERROR:",
        error
      );

      return config;
    }
  },

  (error) => {

    return Promise.reject(
      error
    );
  }
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

API.interceptors.response.use(

  (response) =>
    response,

  (error) => {

    // ================================================
    // NETWORK ERROR
    // ================================================

    if (!error.response) {

      console.error(
        "NETWORK ERROR"
      );

      return Promise.reject(
        error
      );
    }

    // ================================================
    // UNAUTHORIZED
    // ================================================

    if (

      error.response.status ===
      401

    ) {

      console.warn(
        "SESSION EXPIRED"
      );

      // REMOVE ONLY AUTH

      localStorage.removeItem(
        "erp_auth"
      );

      sessionStorage.removeItem(
        "erp_auth"
      );

      // SAFE REDIRECT

      if (

        window.location.pathname !==
        "/"

      ) {

        window.location.replace(
          "/"
        );
      }
    }

    // ================================================
    // SERVER ERROR LOG
    // ================================================

    console.error(

      "API ERROR:",

      error.response?.data?.message ||

      error.message
    );

    return Promise.reject(
      error
    );
  }
);

// ======================================================
// EXPORT
// ======================================================

export default API;