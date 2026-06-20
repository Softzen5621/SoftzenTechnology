import React, {

  useEffect,

  useState

} from "react";

import api from "../../services/api";



const FeesDashboard = () => {

  const [

    loading,

    setLoading

  ] = useState(true);



  const [

    dashboard,

    setDashboard

  ] = useState(null);




  // ======================
  // FETCH DASHBOARD
  // ======================

  const fetchDashboard =
  async () => {

    try {

      setLoading(true);



      const response =
        await api.get(

          "/parent-fees/dashboard"
        );



      setDashboard(
        response.data
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };



  useEffect(() => {

    fetchDashboard();

  }, []);




  // ======================
  // DOWNLOAD RECEIPT
  // ======================

  const downloadReceipt =
  async (receiptId) => {

    try {

      window.open(

        `${import.meta.env.VITE_API_URL}/api/parent-fees/receipt/${receiptId}`,

        "_blank"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Receipt download failed"
      );
    }
  };




  // ======================
  // LOADING
  // ======================

  if (loading) {

    return (

      <div
        style={{
          padding: "30px"
        }}
      >

        Loading dashboard...

      </div>
    );
  }



  // ======================
  // NO DATA
  // ======================

  if (!dashboard) {

    return (

      <div
        style={{
          padding: "30px"
        }}
      >

        No fee data found

      </div>
    );
  }



  const {

    summary,

    receipts,

    timeline,

    profile

  } = dashboard;



  // ======================
  // UI
  // ======================

  return (

    <div

      style={{

        padding: "20px",

        background: "#f5f7fb",

        minHeight: "100vh"
      }}
    >

      {/* PAGE TITLE */}

      <h1
        style={{
          marginBottom: "20px"
        }}
      >

        Fees Dashboard

      </h1>



      {/* SUMMARY CARDS */}

      <div

        style={{

          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",

          gap: "20px"
        }}
      >

        <SummaryCard
          title="Total Fees"
          amount={summary.totalAssigned}
        />



        <SummaryCard
          title="Paid Amount"
          amount={summary.totalPaid}
        />



        <SummaryCard
          title="Pending Amount"
          amount={summary.totalPending}
        />



        <SummaryCard
          title="Fine Amount"
          amount={summary.totalFine}
        />

      </div>



      {/* FEE DETAILS */}

      <div

        style={{

          background: "#fff",

          marginTop: "30px",

          padding: "20px",

          borderRadius: "12px"
        }}
      >

        <h2>
          Fee Details
        </h2>



        {

          profile?.feeAssignments?.map(

            (item) => (

              <div

                key={item._id}

                style={{

                  border:
                    "1px solid #eee",

                  borderRadius:
                    "10px",

                  padding:
                    "15px",

                  marginTop:
                    "15px"
                }}
              >

                <h3>
                  {item.title}
                </h3>



                <p>
                  Amount:
                  ₹{item.amount}
                </p>



                <p>
                  Status:
                  {item.status}
                </p>



                <p>
                  Due Date:
                  {

                    new Date(
                      item.dueDate
                    )
                    .toLocaleDateString()
                  }
                </p>

              </div>
            )
          )
        }

      </div>



      {/* RECEIPTS */}

      <div

        style={{

          background: "#fff",

          marginTop: "30px",

          padding: "20px",

          borderRadius: "12px"
        }}
      >

        <h2>
          Receipts
        </h2>



        {

          receipts?.length === 0 && (

            <p>
              No receipts found
            </p>
          )
        }



        {

          receipts?.map(

            (receipt) => (

              <div

                key={receipt._id}

                style={{

                  display: "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",

                  border:
                    "1px solid #eee",

                  padding:
                    "15px",

                  borderRadius:
                    "10px",

                  marginTop:
                    "15px"
                }}
              >

                <div>

                  <h4>
                    {
                      receipt.receiptNumber
                    }
                  </h4>



                  <p>
                    Paid:
                    ₹{
                      receipt.amountPaid
                    }
                  </p>



                  <p>

                    {

                      new Date(
                        receipt.createdAt
                      )
                      .toLocaleDateString()
                    }

                  </p>

                </div>



                <button

                  onClick={() =>
                    downloadReceipt(
                      receipt._id
                    )
                  }

                  style={{

                    background:
                      "#2563eb",

                    color:
                      "#fff",

                    border:
                      "none",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "8px",

                    cursor:
                      "pointer"
                  }}
                >

                  Download

                </button>

              </div>
            )
          )
        }

      </div>



      {/* TIMELINE */}

      <div

        style={{

          background: "#fff",

          marginTop: "30px",

          padding: "20px",

          borderRadius: "12px"
        }}
      >

        <h2>
          Payment Timeline
        </h2>



        {

          timeline?.map(

            (item) => (

              <div

                key={item._id}

                style={{

                  borderLeft:
                    "3px solid #2563eb",

                  paddingLeft:
                    "15px",

                  marginTop:
                    "20px"
                }}
              >

                <h4>
                  {item.title}
                </h4>



                <p>
                  {item.transactionType}
                </p>



                <p>
                  ₹{item.amount}
                </p>



                <p>

                  {

                    new Date(
                      item.createdAt
                    )
                    .toLocaleString()
                  }

                </p>

              </div>
            )
          )
        }

      </div>

    </div>
  );
};



// ======================
// SUMMARY CARD
// ======================

const SummaryCard = ({

  title,

  amount

}) => {

  return (

    <div

      style={{

        background: "#fff",

        padding: "20px",

        borderRadius: "12px",

        boxShadow:
          "0 2px 8px rgba(0,0,0,0.06)"
      }}
    >

      <h3>
        {title}
      </h3>



      <h2
        style={{
          marginTop: "10px"
        }}
      >

        ₹{amount}

      </h2>

    </div>
  );
};

export default FeesDashboard;