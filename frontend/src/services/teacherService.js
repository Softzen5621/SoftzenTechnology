import axios from "axios";

// ======================================================
// API INSTANCE
// ======================================================

const API = axios.create({

  baseURL:
    `${import.meta.env.VITE_API_URL}`,
});

// ======================================================
// GET TOKEN
// ======================================================

const getToken = () => {

  try {

    const authData =
      JSON.parse(

        localStorage.getItem(
          "erp_auth"
        )
      );

    return authData?.token;

  } catch (error) {

    console.log(
      "TOKEN PARSE ERROR:",
      error
    );

    return null;
  }
};

// ======================================================
// AUTH CONFIG
// ======================================================

const authConfig = () => ({

  headers: {

    Authorization:
      `Bearer ${getToken()}`
  },
});

// ======================================================
// CREATE TEACHER
// ======================================================

export const createTeacher =
  async (teacherData) => {

    try {

      console.log(
        "CREATE TEACHER PAYLOAD:"
      );

      console.log(

        JSON.stringify(

          teacherData,

          null,

          2
        )
      );

      const response =
        await API.post(

          "/teachers",

          teacherData,

          authConfig()
        );

      console.log(
        "CREATE TEACHER SUCCESS:"
      );

      console.log(
        response.data
      );

      return response.data;

    } catch (error) {

      console.log(
        "CREATE TEACHER ERROR:"
      );

      console.log(error);

      console.log(
        "BACKEND RESPONSE:"
      );

      console.log(

        JSON.stringify(

          error.response?.data,

          null,

          2
        )
      );

      console.log(
        "STATUS:"
      );

      console.log(
        error.response?.status
      );

      throw error;
    }
  };

// ======================================================
// GET ALL TEACHERS
// ======================================================

export const getTeachers =
  async () => {

    const response =
      await API.get(

        "/teachers",

        authConfig()
      );

    return response.data;
  };

// ======================================================
// GET SINGLE TEACHER
// ======================================================

export const getSingleTeacher =
  async (id) => {

    const response =
      await API.get(

        `/teachers/${id}`,

        authConfig()
      );

    return response.data;
  };

// ======================================================
// UPDATE TEACHER
// ======================================================

export const updateTeacher =
  async (

    id,

    teacherData

  ) => {

    const response =
      await API.put(

        `/teachers/${id}`,

        teacherData,

        authConfig()
      );

    return response.data;
  };

// ======================================================
// DELETE TEACHER
// ======================================================

export const deleteTeacher =
  async (id) => {

    const response =
      await API.delete(

        `/teachers/${id}`,

        authConfig()
      );

    return response.data;
  };

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetTeacherPassword =
  async (id) => {

    const response =
      await API.put(

        `/teachers/reset-password/${id}`,

        {},

        authConfig()
      );

    return response.data;
  };

// ======================================================
// DOWNLOAD SAMPLE
// ======================================================

export const downloadTeacherSample =
  async () => {

    const response =
      await API.get(

        "/teachers/sample",

        {

          ...authConfig(),

          responseType:
            "blob"
        }
      );

    return response.data;
  };

// ======================================================
// IMPORT TEACHERS
// ======================================================

export const importTeachersExcel =
  async (formData) => {

    const response =
      await API.post(

        "/teachers/import",

        formData,

        {

          headers: {

            Authorization:
              `Bearer ${getToken()}`,

            "Content-Type":
              "multipart/form-data"
          }
        }
      );

    return response.data;
  };

// ======================================================
// EXPORT
// ======================================================

export default API;