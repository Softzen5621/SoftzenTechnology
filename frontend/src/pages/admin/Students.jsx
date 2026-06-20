import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./students.css";

import API from "../../services/api";


const indianStates = [

  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];


export default function Students() {

  // ======================================================
  // STATES
  // ======================================================
const navigate = useNavigate();
  const [students, setStudents] =
    useState([]);

  const [sections, setSections] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [importLoading, setImportLoading] =
    useState(false);

  const [importResult, setImportResult] =
    useState(null);

  const [errors, setErrors] =
    useState({});

const [page, setPage] =
  useState(1);

const [limit, setLimit] =
  useState(10);
const [totalPages, setTotalPages] =
  useState(1);
  const [totalStudents, setTotalStudents] =
  useState(0);

  const [showForm, setShowForm] =
  useState(false);

  // ======================================================
  // INITIAL FORM
  // ======================================================

  const initialForm = {

  name: "",

  gender: "",

  dob: "",

  fatherName: "",

  motherName: "",

  parentEmail: "",

  parentMobile: "",

  alternateMobile: "",

  address: "",

  city: "",

  state: "",

  pincode: "",

  sectionId: "",

  admissionDate: "",

  status: "ACTIVE"
};

  const [form, setForm] =
    useState(initialForm);


  // ======================================================
  // FETCH STUDENTS
  // ======================================================

  const fetchStudents =
    async () => {

      try {

     const res =
  await API.get(
   `/students?page=${page}&limit=${limit}`
  );
  console.log(res.data);

        if (
          Array.isArray(
            res.data
          )
        ) {

          setStudents(
            res.data
          );

        } else if (Array.isArray(res.data.students)) {

  setStudents(
    res.data.students
  );

  setTotalPages(
    res.data.totalPages || 0
  );

  setTotalStudents(
  res.data.totalStudents || 0
);

}else {

          setStudents([]);
        }

      } catch (err) {

        console.error(err);

        setStudents([]);
      }
    };


  // ======================================================
  // FETCH CLASSES
  // ======================================================

  const fetchSections =
    async () => {

      try {

        const res =
          await API.get("/sections");


        if (
          Array.isArray(
            res.data
          )
        ) {

          setSections(
            res.data
          );

        } else if (
          Array.isArray(
            res.data.sections
          )
        ) {

          setSections(
            res.data.sections
          );

        } else {

          setSections([]);
        }

      } catch (err) {

        console.error(err);

        setSections([]);
      }
    };


  // ======================================================
  // INITIAL LOAD
  // ======================================================
useEffect(() => {

  fetchStudents();

}, [page, limit]);

useEffect(() => {

  fetchSections();

}, []);
  // ======================================================
  // AGE CALCULATE
  // ======================================================

  const calculateAge =
    (dob) => {

      if (!dob)
        return "";

      const birthDate =
        new Date(dob);

      const today =
        new Date();

      let age =

        today.getFullYear() -

        birthDate.getFullYear();


      const monthDiff =

        today.getMonth() -

        birthDate.getMonth();


      if (

        monthDiff < 0 ||

        (
          monthDiff === 0 &&

          today.getDate() <
          birthDate.getDate()
        )

      ) {

        age--;
      }

      return age < 0
        ? ""
        : age;
    };


  // ======================================================
  // VALIDATION
  // ======================================================

  const validateField =
    (name, value) => {

      let error = "";


      // LETTERS ONLY

if (

  [
    "name",
    "fatherName",
    "motherName",
  ].includes(name)

) {

        if (
          /[^a-zA-Z\s]/.test(
            value
          )
        ) {

          error =
            "Only letters allowed";
        }
      }


      // MOBILE
if (
  ["parentMobile", "alternateMobile"]
    .includes(name)
) {

  if (

    value &&

    !/^[6-9]\d{9}$/.test(
      value
    )

  ) {

    error =
      "Invalid mobile number";
  }
}
      // EMAIL

      if (
        ["email", "parentEmail"]
          .includes(name)
      ) {

        if (

          value &&

          !/^\S+@\S+\.\S+$/.test(
            value
          )

        ) {

          error =
            "Invalid email";
        }
      }

      return error;
      };

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;


      let updatedValue =
        value;


      // ONLY NUMBERS
// ONLY NUMBERS
if (
  ["parentMobile", "alternateMobile"]
    .includes(name)
) {

  updatedValue =
    value.replace(
      /\D/g,
      ""
    );
}

      // ONLY LETTERS

if (

  [
    "name",
    "fatherName",
    "motherName",
  ].includes(name)

)

       {

        updatedValue =
          value.replace(
            /[^a-zA-Z\s]/g,
            ""
          );
      }


      const error =
        validateField(
          name,
          updatedValue
        );


      setForm({

        ...form,

        [name]:
          updatedValue,
      });


      setErrors({

        ...errors,

        [name]:
          error,
      });
    };


  // ======================================================
  // DOB
  // ======================================================

  const handleDobChange =
    (e) => {

      const dob =
        e.target.value;


      setForm({

        ...form,

        dob,

        age:
          calculateAge(dob),
      });
    };


  // ======================================================
  // RESET
  // ======================================================

  const resetForm =
    () => {

      setForm(
        initialForm
      );

      setEditingId(null);

      setErrors({});
    };


  // ======================================================
  // EDIT
  // ======================================================

  const handleEdit =
    (student) => {

      setEditingId(
        student._id
      );


      setForm({

        ...initialForm,

        ...student,

        sectionId:
          student.sectionId
            ?._id || "",
      });
    };


  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete student?"
        );

      if (!confirmDelete)
        return;


      try {

        await API.delete(
          `/students/${id}`
        );

        fetchStudents();

        alert(
          "Student deleted"
        );

      } catch (err) {

        console.error(err);

        alert(
          "Delete failed"
        );
      }
    };


  // ======================================================
  // IMPORT
  // ======================================================

  const handleImport =
    async (e) => {

      try {

        const file =
          e.target.files[0];

        if (!file)
          return;


        setImportLoading(true);


        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );


        const res =
          await API.post(

            "/students/import",

            formData,

            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );


        setImportResult(
          res.data
        );


        alert(

          `Import Completed

Success:
${res.data.successCount}

Failed:
${res.data.failedCount}`
        );


        fetchStudents();

      } catch (err) {

        console.error(err);

        alert(

          err.response?.data
            ?.msg ||

          "Import failed"
        );

      } finally {

        setImportLoading(false);

        e.target.value = "";
      }
    };


  // ======================================================
  // DOWNLOAD SAMPLE
  // ======================================================

  const downloadSample =
    () => {

   const csvContent =
`name,gender,dob,mobile,email,fatherName,motherName,parentEmail,parentMobile,section
Rahul Sharma,Male,2010-05-10,9876543210,student@gmail.com,Ramesh Sharma,Sunita Sharma,parent@gmail.com,9876543211,LKG`;

      const blob =
        new Blob(
          [csvContent],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );


      const link =
        document.createElement(
          "a"
        );


      const url =
        URL.createObjectURL(
          blob
        );


      link.setAttribute(
        "href",
        url
      );


      link.setAttribute(
        "download",
        "student_sample.csv"
      );


      link.style.visibility =
        "hidden";


      document.body.appendChild(
        link
      );

      link.click();

      document.body.removeChild(
        link
      );
    };

// ======================================================
// SUBMIT
// ======================================================

const handleSubmit =
  async () => {

    try {

      setLoading(true);

      setErrors({});

      // ======================================================
      // REQUIRED VALIDATION
      // ======================================================

      const newErrors = {};

      if (!form.name) {

        newErrors.name =
          "Student name required";
      }

      if (!form.gender) {

        newErrors.gender =
          "Gender required";
      }

      if (!form.dob) {

        newErrors.dob =
          "Date of birth required";
      }

      if (!form.parentEmail) {

        newErrors.parentEmail =
          "Parent email required";
      }

      if (!form.sectionId) {

        newErrors.sectionId =
          "Class required";
      }

      // ======================================================
      // SHOW ERRORS
      // ======================================================

      if (
        Object.keys(newErrors).length
      ) {

        setErrors(newErrors);

        setLoading(false);

        return;
      }

      // ======================================================
      // UPDATE STUDENT
      // ======================================================

      if (editingId) {

        await API.put(

          `/students/${editingId}`,

          form
        );

        alert(
          "Student updated successfully"
        );
      }

      // ======================================================
      // ADD STUDENT
      // ======================================================

      else {

        const response =
          await API.post(
            

            "/students",

            form
          );
          console.log(
  "STUDENT RESPONSE:",
  response.data
);

        let message =
          "Student added successfully";

        // ======================================================
        // PARENT CREDENTIALS
        // ======================================================

        if (

          response.data
            ?.parentCredentials

        ) {

          message +=

            `

--------------------------------

Parent Login Created

Email:
${
  response.data
    .parentCredentials
    .email
}

Password:
${
  response.data
    .parentCredentials
    .password
}`;
        }

        alert(message);
      }

      // ======================================================
      // REFRESH
      // ======================================================

      fetchStudents();

      resetForm();

    } catch (err) {

      console.error(err);

      // ======================================================
      // VALIDATION ERRORS
      // ======================================================

      if (

        err.response?.data
          ?.errors

      ) {

        setErrors(

          err.response.data
            .errors
        );

        return;
      }

      // ======================================================
      // NORMAL ERROR
      // ======================================================

      alert(

        err.response?.data
          ?.msg ||

        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };

  // ======================================================
  // FILTER
  // ======================================================

  const filteredStudents =
    students.filter(
      (s) =>

        s.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="students-container">

     <div className="page-header">
  <h1>Students Management</h1>
  <p>
    Manage admissions, student records and academic information
  </p>
</div>


      {/* SEARCH */}

      <input

        className="search"

        placeholder="Search student..."

        value={search}

        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />


      {/* IMPORT */}

      <div className="import-box">

        <button
          className="sample-btn"
          onClick={
            downloadSample
          }
        >

          Download Sample

        </button>

        <button
  className="add-student-btn"
  onClick={() =>
    navigate("/admin/students/add")
  }
>
  + Add Student
</button>

       <button
  className="add-student-btn"
  onClick={() =>
    setShowForm(!showForm)
  }
>
  {showForm
    ? "Close Quick Admission"
    : "+ Quick Admission"}
</button>


        <label className="import-label">

          {
            importLoading

              ? "Importing..."

              : "Import Excel / CSV"
          }


          <input

            type="file"

            accept=".xlsx,.xls,.csv"

            onChange={
              handleImport
            }

            hidden
          />

        </label>

      </div>


      {
        importResult && (

          <div className="import-result">

            <div className="import-stats">

  <div className="import-card">
    <h3>
      {
        (importResult.successCount || 0) +
        (importResult.failedCount || 0)
      }
    </h3>
    <span>Total Rows</span>
  </div>

  <div className="import-card success">
    <h3>
      {importResult.successCount || 0}
    </h3>
    <span>Imported</span>
  </div>

  <div className="import-card failed">
    <h3>
      {importResult.failedCount || 0}
    </h3>
    <span>Failed</span>
  </div>

</div>

            <p>

              ✅ Success:
              {" "}
              {
                importResult.successCount
              }

            </p>

            <p>

  ❌ Failed:
  {" "}
  {
    importResult.failedCount
  }

</p>

{/* {
  importResult?.failedRows?.map(
    (f, i) => (
      <p key={i}>
        Row {f.row}: {f.reason}
      </p>
    )
  )
} */}
<div
  style={{
    marginTop: "15px"
  }}
>

  <details>

    <summary
      style={{
        cursor: "pointer",
        fontWeight: "600",
        color: "#ef4444"
      }}
    >
      View Failed Rows (
      {importResult.failedCount}
      )
    </summary>

    <div
      style={{
        maxHeight: "250px",
        overflowY: "auto",
        marginTop: "10px",
        padding: "10px",
        background: "#fff5f5",
        borderRadius: "8px"
      }}
    >

      {
        importResult?.failedRows?.map(
          (f, i) => (
            <p
              key={i}
              style={{
                margin: "4px 0",
                fontSize: "13px"
              }}
            >
              Row {f.row}: {f.reason}
            </p>
          )
        )
      }

    </div>

  </details>

</div>

          </div>
        )
      }
      {/* FORM */}

{showForm && (

<div className="form-wrapper">
        <div className="form-grid">


          {/* NAME */}

          <div className="input-group">

            <label>
              Student Name
            </label>

            <input

              name="name"

              value={form.name}

              onChange={
                handleChange
              }

              className={
                errors.name
                  ? "input-error"
                  : ""
              }
            />

          </div>


          {/* GENDER */}

          <div className="input-group">

            <label>
              Gender
            </label>

            <select

              name="gender"

              value={form.gender}

              onChange={
                handleChange
              }
            >

              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

            </select>

          </div>


          {/* DOB */}

          <div className="input-group">

            <label>
              Date Of Birth
            </label>

            <input

              type="date"

              value={form.dob}

              onChange={
                handleDobChange
              }
            />

          </div>


          {/* AGE */}

          <div className="input-group">

            <label>
              Age
            </label>

            <input
              value={form.age}
              disabled
            />

          </div>


          {/* STUDENT ID */}

          <div className="input-group">

            <label>
              Student ID
            </label>

            <input
              disabled
              value="Auto Generated"
            />

          </div>

          {/* FATHER */}

          <div className="input-group">

            <label>
              Father Name
            </label>

            <input

              name="fatherName"

              value={
                form.fatherName
              }

              onChange={
                handleChange
              }
            />

          </div>


          {/* MOTHER */}
          {/* PARENT EMAIL */}

<div className="input-group">

  <label>
    Parent Email
  </label>

  <input

    type="email"

    name="parentEmail"

    value={
      form.parentEmail
    }

    onChange={
      handleChange
    }

    className={
      errors.parentEmail
        ? "input-error"
        : ""
    }
  />

</div>

{/* PARENT MOBILE */}

<div className="input-group">

  <label>
    Parent Mobile
  </label>

  <input

    name="parentMobile"

    value={
      form.parentMobile
    }

    onChange={
      handleChange
    }

    maxLength={10}

    className={
      errors.parentMobile
        ? "input-error"
        : ""
    }
  />

</div>

<div className="input-group">

  <label>
    Alternate Mobile
  </label>

  <input

    name="alternateMobile"

    value={form.alternateMobile}

    onChange={handleChange}

    maxLength={10}
  />

</div>

          <div className="input-group">

            <label>
              Mother Name
            </label>

            <input

              name="motherName"

              value={
                form.motherName
              }

              onChange={
                handleChange
              }
            />

          </div>


          {/* SECTION */}

          <div className="input-group">

            <label>
              Class / Section
            </label>

            <select

              name="sectionId"

              value={
                form.sectionId
              }

              onChange={
                handleChange
              }
            >

              <option value="">
                Select Class
              </option>


              {
                Array.isArray(
                  sections
                ) &&

                sections.map(
                  (s) => (

                    <option

                      key={s._id}

                      value={s._id}
                    >

                      {
                        s.displayName
                      }

                    </option>
                  )
                )
              }

            </select>

          </div>

        </div>

        <div className="input-group">

  <label>
    Admission Date
  </label>

  <input

    type="date"

    name="admissionDate"

    value={form.admissionDate}

    onChange={handleChange}
  />

</div>

<div className="input-group">

  <label>
    Status
  </label>

  <select

    name="status"

    value={form.status}

    onChange={handleChange}
  >

    <option value="ACTIVE">
      Active
    </option>

    <option value="INACTIVE">
      Inactive
    </option>

    <option value="TC">
      TC
    </option>

    <option value="ALUMNI">
      Alumni
    </option>

  </select>

</div>

<div className="input-group">

  <label>
    Address
  </label>

  <input

    name="address"

    value={form.address}

    onChange={handleChange}
  />

</div>

<div className="input-group">

  <label>
    City
  </label>

  <input

    name="city"

    value={form.city}

    onChange={handleChange}
  />

</div>

<div className="input-group">

  <label>
    State
  </label>

  <select

    name="state"

    value={form.state}

    onChange={handleChange}
  >

    <option value="">
      Select State
    </option>

    {indianStates.map((state) => (
      <option
        key={state}
        value={state}
      >
        {state}
      </option>
    ))}

  </select>

</div>

<div className="input-group">

  <label>
    PIN Code
  </label>

  <input

    name="pincode"

    value={form.pincode}

    onChange={handleChange}

    maxLength={6}
  />

</div>


        {/* SUBMIT */}

        <button

  type="button"

  className="submit-btn"

  onClick={handleSubmit}

  disabled={loading}
>
          {
            loading

              ? "Please Wait..."

              : editingId

                ? "Update Student"

                : "Add Student"
          }

</button>

      </div>

)}

<div className="student-stats">

<div className="stat-card">
  Total Students: {totalStudents}
</div>

</div>

      {/* TABLE */}
      <div className="table-wrapper">

        <table className="students-table">

          <thead>

            <tr>

              <th>
                Student ID
              </th>

              <th>
                Name
              </th>

              <th>
                Father
              </th>

              <th>
                Class
              </th>

              <th>
                Age
              </th>

              <th>
                Contact
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {
              filteredStudents.map(
                (s) => (

                  <tr key={s._id}>

                    <td>
                      {s.studentId}
                    </td>

                    <td>
                      {s.name}
                    </td>

                    <td>
                      {s.fatherName}
                    </td>

                    <td>

                      {
                        s.sectionId
                          ?.displayName
                      }

                    </td>

                    <td>
                      {s.age}
                    </td>

                    <td>
                      {s.mobile}
                    </td>

                    <td>

<button
  className="edit-btn"
  onClick={() =>
    navigate(
      `/admin/student/${s._id}`
    )
  }
>
  View
</button>

<button
  className="edit-btn"
 onClick={() => {
  setShowForm(true);
  handleEdit(s);
}}>
  Edit
</button>

<button
  className="delete-btn"
  onClick={() =>
    handleDelete(s._id)
  }
>
  Delete
</button>


                    </td>

                  </tr>
                )
              )
            }

          </tbody>

        </table>
<div className="pagination">

  <button
    disabled={page === 1}
    onClick={() =>
      setPage(prev => prev - 1)
    }
  >
    Previous
  </button>

  <span>
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page >= totalPages}
    onClick={() =>
      setPage(prev => prev + 1)
    }
  >
    Next →
  </button>

</div>
      </div>

    </div>
  );
}

