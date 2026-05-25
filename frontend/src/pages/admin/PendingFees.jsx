import {
  useEffect,
  useState
} from "react";

import API from "../../services/api";

export default function PendingFees() {

  const [payments, setPayments] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // ======================
  // FETCH PAYMENTS
  // ======================

  const fetchPayments =
    async () => {

      try {

        const res =
          await API.get(
            "/fee-payments"
          );

        // ONLY PENDING
        const pending =
          res.data.filter(

            (item) =>
              item.pendingAmount > 0
          );

        setPayments(
          pending
        );

      } catch (err) {

        console.error(err);

        alert(
          "Error fetching pending fees"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchPayments();

  }, []);

  // ======================
  // FILTER
  // ======================

  const filteredPayments =
    payments.filter(
      (item) =>

        item
          ?.studentId
          ?.name
          ?.toLowerCase()
          .includes(

            search.toLowerCase()
          )
    );

  // ======================
  // TOTAL PENDING
  // ======================

  const totalPending =
    filteredPayments.reduce(

      (acc, item) =>

        acc +
        Number(
          item.pendingAmount
        ),

      0
    );

  return (

    <div>

      {/* HEADER */}
      <div
        style={{
          marginBottom: "25px"
        }}
      >

        <h1>
          📌 Pending Fees
        </h1>

        <p
          style={{
            color: "#64748b"
          }}
        >
          Track all unpaid
          and partially paid fees
        </p>

      </div>

      {/* STATS */}
      <div
        style={{

          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",

          gap: "20px",

          marginBottom: "25px"
        }}
      >

        {/* CARD 1 */}
        <div
          style={cardStyle}
        >

          <h3>
            Total Pending
          </h3>

          <h1
            style={{
              color: "#ef4444"
            }}
          >
            ₹
            {
              totalPending.toLocaleString(
                "en-IN"
              )
            }
          </h1>

        </div>

        {/* CARD 2 */}
        <div
          style={cardStyle}
        >

          <h3>
            Students Due
          </h3>

          <h1
            style={{
              color: "#2563eb"
            }}
          >
            {
              filteredPayments.length
            }
          </h1>

        </div>

      </div>

      {/* SEARCH */}
      <input
        type="text"

        placeholder="Search Student..."

        value={search}

        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }

        style={searchStyle}
      />

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

            </tr>

          </thead>

          <tbody>

            {
              loading ? (

                <tr>

                  <td
                    colSpan="8"

                    style={{

                      padding: "20px",

                      textAlign:
                        "center"
                    }}
                  >
                    Loading...
                  </td>

                </tr>

              ) :

              filteredPayments.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"

                    style={{

                      padding: "20px",

                      textAlign:
                        "center"
                    }}
                  >
                    No pending fees
                  </td>

                </tr>

              ) :

              (

                filteredPayments.map(
                  (item) => (

                    <tr
                      key={item._id}
                    >

                      <td style={tdStyle}>
                        {
                          item
                            ?.studentId
                            ?.name
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          item
                            ?.feeStructureId
                            ?.feeType
                        }
                      </td>

                      <td style={tdStyle}>
                        ₹
                        {
                          Number(
                            item.totalAmount
                          ).toLocaleString(
                            "en-IN"
                          )
                        }
                      </td>

                      <td style={tdStyle}>
                        ₹
                        {
                          Number(
                            item.amountPaid
                          ).toLocaleString(
                            "en-IN"
                          )
                        }
                      </td>

                      <td
                        style={{

                          ...tdStyle,

                          color:
                            "#ef4444",

                          fontWeight:
                            "600"
                        }}
                      >
                        ₹
                        {
                          Number(
                            item.pendingAmount
                          ).toLocaleString(
                            "en-IN"
                          )
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          item.paymentStatus
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          item.paymentMode
                        }
                      </td>

                      <td style={tdStyle}>
                        {
                          item.receiptNumber
                        }
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

const cardStyle = {

  background: "white",

  padding: "25px",

  borderRadius: "14px",

  boxShadow:
    "0 2px 8px rgba(0,0,0,0.08)"
};

const searchStyle = {

  width: "100%",

  padding: "12px",

  marginBottom: "20px",

  borderRadius: "8px",

  border: "1px solid #cbd5e1",

  fontSize: "14px"
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