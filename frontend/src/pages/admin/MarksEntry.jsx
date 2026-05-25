import {
  useState
} from "react";

export default function MarksEntry() {

  // ======================
  // STATES
  // ======================

  const [form, setForm] =
    useState({

      examName: "",

      studentName: "",

      subject: "",

      totalMarks: "",

      obtainedMarks: ""
    });

  const [marksData, setMarksData] =
    useState([]);

  // ======================
  // HANDLE CHANGE
  // ======================

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value
      });
    };

  // ======================
  // HANDLE SUBMIT
  // ======================

  const handleSubmit =
    (e) => {

      e.preventDefault();

      // VALIDATION
      if (

        !form.examName ||

        !form.studentName ||

        !form.subject ||

        !form.totalMarks ||

        !form.obtainedMarks
      ) {

        alert(
          "Please fill all fields"
        );

        return;
      }

      // CALCULATE %
      const percentage =

        (
          Number(
            form.obtainedMarks
          ) /

          Number(
            form.totalMarks
          )
        ) * 100;

      // RESULT
      const result =

        percentage >= 33

          ? "Pass"

          : "Fail";

      // SAVE DATA
      const newEntry = {

        id: Date.now(),

        ...form,

        percentage:
          percentage.toFixed(2),

        result
      };

      setMarksData([

        newEntry,

        ...marksData
      ]);

      // RESET FORM
      setForm({

        examName: "",

        studentName: "",

        subject: "",

        totalMarks: "",

        obtainedMarks: ""
      });

      alert(
        "Marks added successfully"
      );
    };

  // ======================
  // DELETE
  // ======================

  const handleDelete =
    (id) => {

      if (
        !window.confirm(
          "Delete marks?"
        )
      ) return;

      const updated =
        marksData.filter(

          (item) =>
            item.id !== id
        );

      setMarksData(updated);
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
          📚 Marks Entry
        </h1>

        <p
          style={{
            color: "#64748b"
          }}
        >
          Add and manage
          student marks
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
          Add Marks
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

          {/* EXAM */}
          <input
            type="text"

            name="examName"

            value={
              form.examName
            }

            onChange={handleChange}

            placeholder="Exam Name"

            style={inputStyle}
          />

          {/* STUDENT */}
          <input
            type="text"

            name="studentName"

            value={
              form.studentName
            }

            onChange={handleChange}

            placeholder="Student Name"

            style={inputStyle}
          />

          {/* SUBJECT */}
          <input
            type="text"

            name="subject"

            value={
              form.subject
            }

            onChange={handleChange}

            placeholder="Subject"

            style={inputStyle}
          />

          {/* TOTAL */}
          <input
            type="number"

            name="totalMarks"

            value={
              form.totalMarks
            }

            onChange={handleChange}

            placeholder="Total Marks"

            style={inputStyle}
          />

          {/* OBTAINED */}
          <input
            type="number"

            name="obtainedMarks"

            value={
              form.obtainedMarks
            }

            onChange={handleChange}

            placeholder="Obtained Marks"

            style={inputStyle}
          />

          {/* BUTTON */}
          <button
            type="submit"

            style={buttonStyle}
          >
            Save Marks
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
                Exam
              </th>

              <th style={thStyle}>
                Student
              </th>

              <th style={thStyle}>
                Subject
              </th>

              <th style={thStyle}>
                Total
              </th>

              <th style={thStyle}>
                Obtained
              </th>

              <th style={thStyle}>
                %
              </th>

              <th style={thStyle}>
                Result
              </th>

              <th style={thStyle}>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {
              marksData.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"

                    style={{

                      padding: "20px",

                      textAlign:
                        "center"
                    }}
                  >
                    No marks added
                  </td>

                </tr>

              ) :

              (

                marksData.map(
                  (item) => (

                    <tr
                      key={item.id}
                    >

                      <td style={tdStyle}>
                        {
                          item.examName
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          item.studentName
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          item.subject
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          item.totalMarks
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          item.obtainedMarks
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          item.percentage
                        }%
                      </td>

                      <td
                        style={{

                          ...tdStyle,

                          color:

                            item.result ===
                            "Pass"

                              ? "green"

                              : "red",

                          fontWeight:
                            "600"
                        }}
                      >
                        {
                          item.result
                        }
                      </td>

                      <td style={tdStyle}>

                        <button

                          onClick={() =>
                            handleDelete(
                              item.id
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