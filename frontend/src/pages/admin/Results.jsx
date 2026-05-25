import {
  useState
} from "react";

export default function Results() {

  // ======================
  // STATES
  // ======================

  const [results] =
    useState([

      {

        id: 1,

        studentName:
          "Rahul Sharma",

        examName:
          "Mid Term",

        totalMarks: 500,

        obtainedMarks: 420
      },

      {

        id: 2,

        studentName:
          "Priya Singh",

        examName:
          "Mid Term",

        totalMarks: 500,

        obtainedMarks: 470
      },

      {

        id: 3,

        studentName:
          "Aman Verma",

        examName:
          "Mid Term",

        totalMarks: 500,

        obtainedMarks: 290
      }
    ]);

  // ======================
  // CALCULATE
  // ======================

  const getPercentage =
    (obtained, total) => {

      return (
        (
          obtained / total
        ) * 100
      ).toFixed(2);
    };

  const getGrade =
    (percentage) => {

      if (
        percentage >= 90
      ) return "A+";

      if (
        percentage >= 75
      ) return "A";

      if (
        percentage >= 60
      ) return "B";

      if (
        percentage >= 45
      ) return "C";

      if (
        percentage >= 33
      ) return "D";

      return "F";
    };

  const getResult =
    (percentage) => {

      return percentage >= 33

        ? "Pass"

        : "Fail";
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
          📊 Results
        </h1>

        <p
          style={{
            color: "#64748b"
          }}
        >
          Student result analytics
          and report overview
        </p>

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
                Student
              </th>

              <th style={thStyle}>
                Exam
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
                Grade
              </th>

              <th style={thStyle}>
                Result
              </th>

            </tr>

          </thead>

          <tbody>

            {
              results.map(
                (item) => {

                  const percentage =

                    getPercentage(

                      item.obtainedMarks,

                      item.totalMarks
                    );

                  const grade =

                    getGrade(
                      percentage
                    );

                  const result =

                    getResult(
                      percentage
                    );

                  return (

                    <tr
                      key={item.id}
                    >

                      <td style={tdStyle}>
                        {
                          item.studentName
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          item.examName
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
                        {percentage}%
                      </td>

                      <td style={tdStyle}>
                        {grade}
                      </td>

                      <td
                        style={{

                          ...tdStyle,

                          color:

                            result ===
                            "Pass"

                              ? "green"

                              : "red",

                          fontWeight:
                            "600"
                        }}
                      >
                        {result}
                      </td>

                    </tr>
                  );
                }
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