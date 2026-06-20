import React, {

  useEffect,

  useState

} from "react";

import api from "../../services/api";



const CollectionReports = () => {

  const [

    daily,

    setDaily

  ] = useState(null);



  const [

    monthly,

    setMonthly

  ] = useState(null);




  // ======================
  // FETCH
  // ======================

  const fetchReports =
  async () => {

    try {

      const dailyResponse =
        await api.get(
          "/collection-reports/daily"
        );



      const monthlyResponse =
        await api.get(
          "/collection-reports/monthly"
        );



      setDaily(
        dailyResponse.data
      );



      setMonthly(
        monthlyResponse.data
      );

    } catch (error) {

      console.error(error);
    }
  };



  useEffect(() => {

    fetchReports();

  }, []);




  // ======================
  // UI
  // ======================

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
        Collection Reports
      </h1>



      {/* DAILY */}

      {

        daily && (

          <div style={box}>

            <h2>
              Today's Collection
            </h2>



            <div style={grid}>

              <Card

                title="Total"

                amount={
                  daily.totalCollection
                }
              />



              <Card

                title="Cash"

                amount={
                  daily.cashCollection
                }
              />



              <Card

                title="Online"

                amount={
                  daily.onlineCollection
                }
              />



              <Card

                title="Transactions"

                amount={
                  daily.totalTransactions
                }
              />

            </div>

          </div>
        )
      }



      {/* MONTHLY */}

      {

        monthly && (

          <div
            style={{

              ...box,

              marginTop:
                "30px"
            }}
          >

            <h2>
              Monthly Collection
            </h2>



            <div style={grid}>

              <Card

                title="Monthly Total"

                amount={
                  monthly.total
                }
              />



              <Card

                title="Transactions"

                amount={
                  monthly.totalTransactions
                }
              />

            </div>

          </div>
        )
      }

    </div>
  );
};



// ======================
// CARD
// ======================

const Card = ({

  title,

  amount

}) => {

  return (

    <div style={card}>

      <h3>
        {title}
      </h3>



      <h1>
        ₹{amount}
      </h1>

    </div>
  );
};



// ======================
// STYLES
// ======================

const box = {

  background: "#fff",

  padding: "20px",

  borderRadius: "12px",

  marginTop: "20px"
};

const grid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",

  gap: "15px",

  marginTop: "20px"
};

const card = {

  background: "#f8fafc",

  padding: "20px",

  borderRadius: "10px"
};

export default CollectionReports;