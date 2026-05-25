import {
  useEffect,
  useState
} from "react";

import API from "../../services/api";

export default function CollectFees() {

  // ======================
  // STATES
  // ======================

  const [students, setStudents] =
  useState([]);
  const [fees, setFees] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      studentId: "",

      feeStructureId: "",

      totalAmount: 0,

      amountPaid: "",

      pendingAmount: 0,

      paymentMode: "",

      paymentDate: "",

      remarks: ""
    });

  // ======================
  // FETCH DATA
  // ======================

  const fetchStudents =
    async () => {

      try {

        const res =
          await API.get(
            "/students"
          );

        setStudents(
  res.data.students || []
);

      } catch (err) {

        console.error(err);
      }
    };

  const fetchFees =
    async () => {

      try {

        const res =
          await API.get(
            "/fees"
          );

        setFees(
          res.data
        );

      } catch (err) {

        console.error(err);
      }
    };

  const fetchPayments =
    async () => {

      try {

        const res =
          await API.get(
            "/fee-payments"
          );

        setPayments(
          res.data
        );

      } catch (err) {

        console.error(err);
      }
    };

  useEffect(() => {

    fetchStudents();

    fetchFees();

    fetchPayments();

  }, []);

  // ======================
  // HANDLE CHANGE
  // ======================

  const handleChange =
    (e) => {

      const {

        name,

        value

      } = e.target;

      // FEE SELECT
      if (
        name ===
        "feeStructureId"
      ) {

        const selectedFee =
          fees.find(

            (f) =>
              f._id === value
          );

        if (selectedFee) {

          setForm({

            ...form,

            feeStructureId:
              value,

            totalAmount:
              selectedFee.amount,

            pendingAmount:
              selectedFee.amount
          });

          return;
        }
      }

      // PAID AMOUNT
      if (
        name ===
        "amountPaid"
      ) {

        const paid =
          Number(value);

        const pending =
          form.totalAmount -
          paid;

        setForm({

          ...form,

          amountPaid:
            value,

          pendingAmount:
            pending
        });

        return;
      }

      setForm({

        ...form,

        [name]:
          value
      });
    };

  // ======================
  // SUBMIT
  // ======================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        // VALIDATION
        if (

          !form.studentId ||

          !form.feeStructureId ||

          !form.amountPaid ||

          !form.paymentMode ||

          !form.paymentDate
        ) {

          alert(
            "Please fill all required fields"
          );

          setLoading(false);

          return;
        }

        await API.post(

          "/fee-payments",

          form
        );

        alert(
          "Fee collected successfully"
        );

        // RESET
        setForm({

          studentId: "",

          feeStructureId: "",

          totalAmount: 0,

          amountPaid: "",

          pendingAmount: 0,

          paymentMode: "",

          paymentDate: "",

          remarks: ""
        });

        fetchPayments();

      } catch (err) {

        console.error(err);

        alert(

          err?.response?.data?.msg ||

          "Error collecting fee"
        );

      } finally {

        setLoading(false);
      }
    };

  // ======================
  // DELETE
  // ======================

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete payment?"
        )
      ) return;

      try {

        await API.delete(

          `/fee-payments/${id}`
        );

        alert(
          "Payment deleted"
        );

        fetchPayments();

      } catch (err) {

        console.error(err);

        alert(
          "Error deleting payment"
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
          💳 Collect Fees
        </h1>

        <p
          style={{
            color: "#64748b"
          }}
        >
          Collect and manage
          student fee payments
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
          Collect Payment
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

          {/* STUDENT */}
          <select
            name="studentId"

            value={form.studentId}

            onChange={handleChange}

            style={inputStyle}
          >

            <option value="">
              Select Student
            </option>

            {Array.isArray(students) &&
              students.map(
                (student) => (

                  <option
                    key={student._id}

                    value={student._id}
                  >
                    {student.name}
                    {" - "}
                    {
                      student.studentId
                    }
                  </option>
                )
              )
            }

          </select>

          {/* FEE */}
          <select
            name="feeStructureId"

            value={
              form.feeStructureId
            }

            onChange={handleChange}

            style={inputStyle}
          >

            <option value="">
              Select Fee
            </option>

            {
              fees.map(
                (fee) => (

                  <option
                    key={fee._id}

                    value={fee._id}
                  >
                    {fee.className}
                    {" - "}
                    {fee.feeType}
                  </option>
                )
              )
            }

          </select>

          {/* TOTAL */}
          <input
            type="text"

            value={
              form.totalAmount
            }

            readOnly

            placeholder="Total Amount"

            style={inputStyle}
          />

          {/* PAID */}
          <input
            type="number"

            name="amountPaid"

            value={
              form.amountPaid
            }

            onChange={handleChange}

            placeholder="Amount Paid"

            style={inputStyle}
          />

          {/* PENDING */}
          <input
            type="text"

            value={
              form.pendingAmount
            }

            readOnly

            placeholder="Pending Amount"

            style={inputStyle}
          />

          {/* PAYMENT MODE */}
          <select
            name="paymentMode"

            value={
              form.paymentMode
            }

            onChange={handleChange}

            style={inputStyle}
          >

            <option value="">
              Payment Mode
            </option>

            <option>
              Cash
            </option>

            <option>
              UPI
            </option>

            <option>
              Card
            </option>

            <option>
              Bank Transfer
            </option>

            <option>
              Cheque
            </option>

          </select>

          {/* DATE */}
          <input
            type="date"

            name="paymentDate"

            value={
              form.paymentDate
            }

            onChange={handleChange}

            style={inputStyle}
          />

          {/* REMARKS */}
          <input
            type="text"

            name="remarks"

            value={
              form.remarks
            }

            onChange={handleChange}

            placeholder="Remarks"

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
                ? "Collecting..."
                : "Collect Fee"
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
                Student
              </th>

              <th style={thStyle}>
                Fee Type
              </th>

              <th style={thStyle}>
                Total
              </th>

              <th style={thStyle}>
                Paid
              </th>

              <th style={thStyle}>
                Pending
              </th>

              <th style={thStyle}>
                Status
              </th>

              <th style={thStyle}>
                Mode
              </th>

              <th style={thStyle}>
                Receipt
              </th>

              <th style={thStyle}>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {
              payments.map(
                (payment) => (

                  <tr
                    key={payment._id}
                  >

                    <td style={tdStyle}>
                      {
                        payment
                          ?.studentId
                          ?.name
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        payment
                          ?.feeStructureId
                          ?.feeType
                      }
                    </td>

                    <td style={tdStyle}>
                      ₹
                      {
                        Number(
                          payment.totalAmount
                        ).toLocaleString(
                          "en-IN"
                        )
                      }
                    </td>

                    <td style={tdStyle}>
                      ₹
                      {
                        Number(
                          payment.amountPaid
                        ).toLocaleString(
                          "en-IN"
                        )
                      }
                    </td>

                    <td style={tdStyle}>
                      ₹
                      {
                        Number(
                          payment.pendingAmount
                        ).toLocaleString(
                          "en-IN"
                        )
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        payment
                          .paymentStatus
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        payment
                          .paymentMode
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        payment
                          .receiptNumber
                      }
                    </td>

                    <td style={tdStyle}>

                      <button

                        onClick={() =>
                          handleDelete(
                            payment._id
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