import React, {

  useEffect,

  useState

} from "react";

import api from "../../services/api";



const AdminFinanceDashboard = () => {

  const [

    dashboard,

    setDashboard

  ] = useState(null);




  // ======================
  // FETCH
  // ======================

  const fetchDashboard =
  async () => {

    try {

      const response =
        await api.get(

          "/admin-finance/dashboard"
        );



      setDashboard(
        response.data
      );

    } catch (error) {

      console.error(error);
    }
  };



  useEffect(() => {

    fetchDashboard();

  }, []);




  if (!dashboard) {

    return (

      <div
        style={{
          padding: "20px"
        }}
      >

        Loading...

      </div>
    );
  }



  const {

    summary,

    dailyCollection,

    recentTransactions

  } = dashboard;



  return (

    <div

      style={{

        padding: "20px",

        background:
          "#f5f7fb",

        minHeight:
          "100vh"
      }}
    >

      <h1>
        Finance Dashboard
      </h1>



      {/* SUMMARY */}

      <div

        style={{

          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",

          gap: "20px",

          marginTop: "20px"
        }}
      >

        <Card
          title="Total Collection"
          value={summary.totalCollection}
        />



        <Card
          title="Pending Dues"
          value={summary.totalPending}
        />



        <Card
          title="Cash Collection"
          value={summary.cashCollection}
        />



        <Card
          title="Online Collection"
          value={summary.onlineCollection}
        />



        <Card
          title="Failed Payments"
          value={summary.failedPayments}
        />

      </div>



      {/* DAILY COLLECTION */}

      <div

        style={{

          background: "#fff",

          marginTop: "30px",

          padding: "20px",

          borderRadius: "12px"
        }}
      >

        <h2>
          Daily Collection
        </h2>



        {

          dailyCollection.map(
            (item) => (

              <div
                key={item._id.date}
                style={{
                  marginTop: "10px"
                }}
              >

                <strong>
                  {item._id.date}
                </strong>

                {" - "}

                ₹{item.total}

              </div>
            )
          )
        }

      </div>



      {/* RECENT PAYMENTS */}

      <div

        style={{

          background: "#fff",

          marginTop: "30px",

          padding: "20px",

          borderRadius: "12px"
        }}
      >

        <h2>
          Recent Transactions
        </h2>



        {

          recentTransactions.map(
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

                <h4>
                  {item.title}
                </h4>



                <p>
                  ₹{item.amount}
                </p>



                <p>
                  {
                    item.paymentMethod
                  }
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
// CARD
// ======================

const Card = ({

  title,

  value

}) => {

  return (

    <div

      style={{

        background: "#fff",

        padding: "20px",

        borderRadius: "12px",

        boxShadow:
          "0 2px 8px rgba(0,0,0,0.05)"
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

        ₹{value}

      </h2>

    </div>
  );
};

export default AdminFinanceDashboard;