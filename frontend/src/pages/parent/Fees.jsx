import React, {

  useEffect,

  useState

} from "react";

import api from "../../services/api";

import {

  createPaymentOrder,

  verifyPayment

} from "../../services/paymentService";



const Fees = () => {

  const [

    loading,

    setLoading

  ] = useState(false);



  const [

    studentFeeProfile,

    setStudentFeeProfile

  ] = useState(null);



  const [

    parent,

    setParent

  ] = useState({});



  // ======================
  // FETCH FEES
  // ======================

  const fetchFees =
  async () => {

    try {

      setLoading(true);



      const response =
        await api.get(
          "/parent/fees"
        );



      setStudentFeeProfile(

        response.data
          ?.profile || null
      );



      setParent(

        response.data
          ?.parent || {}
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };



  useEffect(() => {

    fetchFees();

  }, []);




  // ======================
  // SAFE DATA
  // ======================

  const selectedStudentId =

    studentFeeProfile
    ?.studentId;



  const selectedProfileId =

    studentFeeProfile
    ?._id;



  const selectedAssignments =

    studentFeeProfile
    ?.feeAssignments
    ?.map(

      item => item._id
    ) || [];



  const selectedFeeItems =

    studentFeeProfile
    ?.feeAssignments || [];



  const totalAmount =

    studentFeeProfile
    ?.totalPendingAmount || 0;



  const parentName =
    parent?.name || "";

  const parentEmail =
    parent?.email || "";

  const parentPhone =
    parent?.phone || "";



  // ======================
  // PAYMENT
  // ======================

  const handlePayNow =
  async () => {

    try {

      if (
        !totalAmount ||
        totalAmount <= 0
      ) {

        return alert(
          "No pending fees"
        );
      }



      // ======================
      // CREATE ORDER
      // ======================

      const response =

        await createPaymentOrder({

          studentId:
            selectedStudentId,

          studentFeeProfileId:
            selectedProfileId,

          feeAssignmentIds:
            selectedAssignments,

          amount:
            totalAmount,

          paymentMethod:
            "ONLINE",

          gateway:
            "RAZORPAY"
        });




      const {

        paymentOrder,

        gatewayResponse

      } = response;



      // ======================
      // OPTIONS
      // ======================

      const options = {

        key:
          gatewayResponse
          .publicKey,



        amount:
          gatewayResponse
          .order.amount,



        currency:
          "INR",



        name:
          "Softzen ERP",



        description:
          "School Fees Payment",



        order_id:
          gatewayResponse
          .order.id,



        handler:
        async function (
          razorpayResponse
        ) {

          try {

            // ======================
            // VERIFY
            // ======================

            const verifyResponse =

              await verifyPayment({

                paymentOrderId:
                  paymentOrder._id,



                razorpay_order_id:
                  razorpayResponse
                  .razorpay_order_id,



                razorpay_payment_id:
                  razorpayResponse
                  .razorpay_payment_id,



                razorpay_signature:
                  razorpayResponse
                  .razorpay_signature,



                feeItems:
                  selectedFeeItems
              });




            if (
              verifyResponse.success
            ) {

              alert(
                "Payment Successful"
              );



              fetchFees();

            } else {

              alert(
                "Payment Verification Failed"
              );
            }

          } catch (error) {

            console.error(error);

            alert(
              "Payment verification failed"
            );
          }
        },



        prefill: {

          name:
            parentName,

          email:
            parentEmail,

          contact:
            parentPhone
        },



        theme: {

          color:
            "#2563eb"
        }
      };



      // ======================
      // OPEN RAZORPAY
      // ======================

      const razorpay =

        new window.Razorpay(
          options
        );



      razorpay.open();

    } catch (error) {

      console.error(error);

      alert(
        "Payment initiation failed"
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
          padding: "20px"
        }}
      >

        Loading...

      </div>
    );
  }



  // ======================
  // UI
  // ======================

  return (

    <div
      style={{
        padding: "20px"
      }}
    >

      <h2>
        My Fees
      </h2>



      {/* SUMMARY */}

      <div

        style={{

          background: "#fff",

          padding: "20px",

          borderRadius: "10px",

          marginTop: "20px",

          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
        }}
      >

        <h3>
          Pending Summary
        </h3>



        <p>

          <strong>
            Total Pending:
          </strong>

          {" "}

          ₹{totalAmount}

        </p>



        <button

          onClick={handlePayNow}

          style={{

            background:
              "#2563eb",

            color: "#fff",

            border: "none",

            padding:
              "12px 20px",

            borderRadius: "8px",

            cursor: "pointer",

            fontWeight: "600",

            marginTop: "20px"
          }}
        >

          Pay Now

        </button>

      </div>



      {/* FEE ITEMS */}

      <div
        style={{
          marginTop: "30px"
        }}
      >

        <h3>
          Fee Details
        </h3>



        {

          selectedFeeItems.map(

            (item) => (

              <div

                key={item._id}

                style={{

                  background:
                    "#fff",

                  padding:
                    "15px",

                  borderRadius:
                    "10px",

                  marginBottom:
                    "10px",

                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.05)"
                }}
              >

                <h4>
                  {item.title}
                </h4>



                <p>
                  Amount:
                  ₹{item.amount}
                </p>



                <p>
                  Status:
                  {item.status}
                </p>

              </div>
            )
          )
        }

      </div>

    </div>
  );
};

export default Fees;