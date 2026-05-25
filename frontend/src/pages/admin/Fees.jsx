import {
  useEffect,
  useState
} from "react";

import API from "../../services/api";

export default function Fees() {

  // FORM
  const [form, setForm] =
    useState({

      academicYear: "",

      className: "",

      feeType: "",

      amount: "",

      frequency: "",

      dueDate: ""
    });

  // DATA
  const [fees, setFees] =
    useState([]);

  // LOADING
  const [loading, setLoading] =
    useState(false);

  // FETCH FEES
  const fetchFees =
    async () => {

      try {

        const res =
          await API.get("/fees");

        setFees(res.data);

      } catch (err) {

        console.error(err);

        alert(
          "Error fetching fees"
        );
      }
    };

  useEffect(() => {

    fetchFees();

  }, []);

  // HANDLE CHANGE
  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value
      });
    };

  // ADD FEE
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        // VALIDATION
        if (

          !form.academicYear ||

          !form.className ||

          !form.feeType ||

          !form.amount ||

          !form.frequency ||

          !form.dueDate
        ) {

          alert(
            "Please fill all fields"
          );

          setLoading(false);

          return;
        }

        await API.post(

          "/fees",

          form
        );

        alert(
          "Fee structure added"
        );

        // RESET
        setForm({

          academicYear: "",

          className: "",

          feeType: "",

          amount: "",

          frequency: "",

          dueDate: ""
        });

        fetchFees();

      } catch (err) {

        console.error(err);

        alert(
          err?.response?.data?.msg ||

          "Error adding fee"
        );

      } finally {

        setLoading(false);
      }
    };

  // DELETE
  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete fee structure?"
        )
      ) return;

      try {

        await API.delete(

          `/fees/${id}`
        );

        alert(
          "Fee deleted"
        );

        fetchFees();

      } catch (err) {

        console.error(err);

        alert(
          "Error deleting fee"
        );
      }
    };

  return (

    <div>

      {/* HEADER */}
      <div
        style={{
          marginBottom: "20px"
        }}
      >

        <h1>
          💰 Fees Management
        </h1>

        <p
          style={{
            color: "#64748b"
          }}
        >
          Create and manage
          fee structures
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
          Add Fee Structure
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

          {/* YEAR */}
          <input
            type="text"

            name="academicYear"

            placeholder="Academic Year"

            value={form.academicYear}

            onChange={handleChange}

            style={inputStyle}
          />

          {/* CLASS */}
          <input
            type="text"

            name="className"

            placeholder="Class Name"

            value={form.className}

            onChange={handleChange}

            style={inputStyle}
          />

          {/* FEE TYPE */}
          <select
            name="feeType"

            value={form.feeType}

            onChange={handleChange}

            style={inputStyle}
          >

            <option value="">
              Select Fee Type
            </option>

            <option>
              Admission Fee
            </option>

            <option>
              Tuition Fee
            </option>

            <option>
              Exam Fee
            </option>

            <option>
              Transport Fee
            </option>

            <option>
              Computer Fee
            </option>

            <option>
              Library Fee
            </option>

          </select>

          {/* AMOUNT */}
          <input
            type="number"

            name="amount"

            placeholder="Amount"

            value={form.amount}

            onChange={handleChange}

            style={inputStyle}
          />

          {/* FREQUENCY */}
          <select
            name="frequency"

            value={form.frequency}

            onChange={handleChange}

            style={inputStyle}
          >

            <option value="">
              Select Frequency
            </option>

            <option>
              Monthly
            </option>

            <option>
              Quarterly
            </option>

            <option>
              Yearly
            </option>

            <option>
              One Time
            </option>

          </select>

          {/* DUE DATE */}
          <input
            type="date"

            name="dueDate"

            value={form.dueDate}

            onChange={handleChange}

            style={inputStyle}
          />

          {/* BUTTON */}
          <button
            type="submit"

            disabled={loading}

            style={buttonStyle}
          >

            {
              loading
                ? "Adding..."
                : "Add Structure"
            }

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
                Academic Year
              </th>

              <th style={thStyle}>
                Class
              </th>

              <th style={thStyle}>
                Fee Type
              </th>

              <th style={thStyle}>
                Amount
              </th>

              <th style={thStyle}>
                Frequency
              </th>

              <th style={thStyle}>
                Due Date
              </th>

              <th style={thStyle}>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {
              fees.map((fee) => (

                <tr
                  key={fee._id}
                >

                  <td style={tdStyle}>
                    {fee.academicYear}
                  </td>

                  <td style={tdStyle}>
                    {fee.className}
                  </td>

                  <td style={tdStyle}>
                    {fee.feeType}
                  </td>

                  <td style={tdStyle}>
                    {Number(fee.amount).toLocaleString("en-IN")}
                  </td>

                  <td style={tdStyle}>
                    {fee.frequency}
                  </td>

                  <td style={tdStyle}>
                    {fee.dueDate}
                  </td>

                  <td style={tdStyle}>

                    <button

                      onClick={() =>
                        handleDelete(
                          fee._id
                        )
                      }

                      style={deleteBtn}
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))
            }

          </tbody>

        </table>
      </div>
    </div>
  );
}

// STYLES
const inputStyle = {

  padding: "12px",

  borderRadius: "8px",

  border: "1px solid #cbd5e1",

  fontSize: "14px"
};

const buttonStyle = {

  background: "#2563eb",

  color: "white",

  border: "none",

  padding: "12px",

  borderRadius: "8px",

  cursor: "pointer",

  fontWeight: "600"
};

const deleteBtn = {

  background: "#ef4444",

  color: "white",

  border: "none",

  padding: "8px 14px",

  borderRadius: "6px",

  cursor: "pointer"
};

const thStyle = {

  padding: "14px",

  textAlign: "left"
};

const tdStyle = {

  padding: "14px",

  borderBottom:
    "1px solid #e2e8f0"
};