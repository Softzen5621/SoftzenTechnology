import {
  useState
} from "react";

export default function Exams() {

  // ======================
  // STATES
  // ======================

  const [examForm, setExamForm] =
    useState({

      examName: "",

      className: "",

      startDate: "",

      endDate: "",

      description: ""
    });

  const [exams, setExams] =
    useState([]);

  // ======================
  // HANDLE CHANGE
  // ======================

  const handleChange =
    (e) => {

      setExamForm({

        ...examForm,

        [e.target.name]:
          e.target.value
      });
    };

  // ======================
  // SUBMIT
  // ======================

  const handleSubmit =
    (e) => {

      e.preventDefault();

      // VALIDATION
      if (

        !examForm.examName ||

        !examForm.className ||

        !examForm.startDate ||

        !examForm.endDate
      ) {

        alert(
          "Please fill all required fields"
        );

        return;
      }

      // CREATE EXAM
      const newExam = {

        id: Date.now(),

        ...examForm
      };

      // ADD TO LIST
      setExams([

        newExam,

        ...exams
      ]);

      // RESET FORM
      setExamForm({

        examName: "",

        className: "",

        startDate: "",

        endDate: "",

        description: ""
      });

      alert(
        "Exam created successfully"
      );
    };

  // ======================
  // DELETE
  // ======================

  const handleDelete =
    (id) => {

      if (
        !window.confirm(
          "Delete exam?"
        )
      ) return;

      const updated =
        exams.filter(

          (item) =>
            item.id !== id
        );

      setExams(updated);
    };

  return (

    <div>

      {/* HEADER */}
      <div
        style={{
          marginBottom: "25px"
        }}
      >

        <h1>
          📝 Exam Management
        </h1>

        <p
          style={{
            color: "#64748b"
          }}
        >
          Create and manage
          school examinations
        </p>

      </div>

      {/* FORM */}
      <div
        style={{

          background: "white",

          padding: "25px",

          borderRadius: "14px",

          marginBottom: "25px",

          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)"
        }}
      >

        <h2>
          Create Exam
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{

            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",

            gap: "15px",

            marginTop: "20px"
          }}
        >

          {/* EXAM NAME */}
          <input
            type="text"

            name="examName"

            value={
              examForm.examName
            }

            onChange={handleChange}

            placeholder="Exam Name"

            style={inputStyle}
          />

          {/* CLASS */}
          <input
            type="text"

            name="className"

            value={
              examForm.className
            }

            onChange={handleChange}

            placeholder="Class Name"

            style={inputStyle}
          />

          {/* START DATE */}
          <input
            type="date"

            name="startDate"

            value={
              examForm.startDate
            }

            onChange={handleChange}

            style={inputStyle}
          />

          {/* END DATE */}
          <input
            type="date"

            name="endDate"

            value={
              examForm.endDate
            }

            onChange={handleChange}

            style={inputStyle}
          />

          {/* DESCRIPTION */}
          <input
            type="text"

            name="description"

            value={
              examForm.description
            }

            onChange={handleChange}

            placeholder="Description"

            style={inputStyle}
          />

          {/* BUTTON */}
          <button
            type="submit"

            style={buttonStyle}
          >
            Create Exam
          </button>

        </form>
      </div>

      {/* TABLE */}
      <div
        style={{

          background: "white",

          borderRadius: "14px",

          overflowX: "auto",

          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)"
        }}
      >

        <table
          style={{

            width: "100%",

            borderCollapse:
              "collapse"
          }}
        >

          <thead>

            <tr
              style={{
                background: "#0f172a",
                color: "white"
              }}
            >

              <th style={thStyle}>
                Exam Name
              </th>

              <th style={thStyle}>
                Class
              </th>

              <th style={thStyle}>
                Start Date
              </th>

              <th style={thStyle}>
                End Date
              </th>

              <th style={thStyle}>
                Description
              </th>

              <th style={thStyle}>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {
              exams.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"

                    style={{

                      padding: "20px",

                      textAlign:
                        "center"
                    }}
                  >
                    No exams created
                  </td>

                </tr>

              ) :

              (

                exams.map(
                  (exam) => (

                    <tr
                      key={exam.id}
                    >

                      <td style={tdStyle}>
                        {
                          exam.examName
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          exam.className
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          exam.startDate
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          exam.endDate
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          exam.description
                        }
                      </td>

                      <td style={tdStyle}>

                        <button

                          onClick={() =>
                            handleDelete(
                              exam.id
                            )
                          }

                          style={
                            deleteBtn
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )
              )
            }

          </tbody>

        </table>
      </div>
    </div>
  );
}

// ======================
// STYLES
// ======================

const inputStyle = {

  padding: "12px",

  borderRadius: "8px",

  border:
    "1px solid #cbd5e1",

  fontSize: "14px"
};

const buttonStyle = {

  background:
    "#2563eb",

  color:
    "white",

  border:
    "none",

  padding:
    "12px",

  borderRadius:
    "8px",

  cursor:
    "pointer",

  fontWeight:
    "600"
};

const deleteBtn = {

  background:
    "#ef4444",

  color:
    "white",

  border:
    "none",

  padding:
    "8px 14px",

  borderRadius:
    "6px",

  cursor:
    "pointer"
};

const thStyle = {

  padding:
    "14px",

  textAlign:
    "left"
};

const tdStyle = {

  padding:
    "14px",

  borderBottom:
    "1px solid #e2e8f0"
};