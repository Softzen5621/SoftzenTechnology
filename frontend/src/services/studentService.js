import API from "./api";

export const getStudents = () =>
  API.get("/students");

export const addStudent = (data) =>
  API.post("/students", data);

export const updateStudent = (
  id,
  data
) =>
  API.put(
    `/students/${id}`,
    data
  );

export const deleteStudent = (
  id
) =>
  API.delete(
    `/students/${id}`
  );

export const importStudents = (
  formData
) =>
  API.post(
    "/students/import",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );