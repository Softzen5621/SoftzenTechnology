import React, {

  useState

} from "react";

import api from "../../services/api";

import {

  createPaymentOrder,

  verifyPayment

} from "../../services/paymentService";



const CollectFees = () => {

  // ======================
  // STATES
  // ======================

  const [

    search,

    setSearch

  ] = useState("");



  const [

    loading,

    setLoading

  ] = useState(false);



  const [

    data,

    setData

  ] = useState(null);



  const [

    selectedFee,

    setSelectedFee

  ] = useState(null);



  const [

    receiptData,

    setReceiptData

  ] = useState(null);



  const [

    paymentForm,

    setPaymentForm

  ] = useState({

    amount: "",

    discount: 0,

    fine: 0,

    paymentMethod:
      "CASH",

    remarks: ""
  });




  // ======================
  // SEARCH STUDENT
  // ======================

  const handleSearch =
  async () => {

    try {

      setLoading(true);



      const response =
        await api.get(

          `/student-finance/search?search=${search}`
        );



      setData(
        response.data
      );

    } catch (error) {

      console.error(error);

      alert(
        "Student not found"
      );

    } finally {

      setLoading(false);
    }
  };




  // ======================
  // OPEN PAYMENT MODAL
  // ======================

  const openPaymentModal =
  (item) => {

    setSelectedFee(item);



    setPaymentForm({

     amount:
  item.pendingAmount ||
  item.amount,
      discount: 0,

      fine: 0,

      paymentMethod:
        "CASH",

      remarks: ""
    });
  };




  // ======================
  // INPUT CHANGE
  // ======================

  const handlePaymentInput =
  (e) => {

    setPaymentForm({

      ...paymentForm,

      [e.target.name]:
        e.target.value
    });
  };




  // ======================
  // COLLECT PAYMENT
  // ======================

  const collectPayment =
  async () => {

    try {

      if (

        !selectedFee ||

        !paymentForm.amount

      ) {

        return alert(
          "Please enter amount"
        );
      }



      // ======================
      // FINAL AMOUNT
      // ======================

      const finalAmount =

        Number(
          paymentForm.amount
        )

        +

        Number(
          paymentForm.fine
        )

        -

        Number(
          paymentForm.discount
        );
if (

  finalAmount >

  selectedFee.pendingAmount +

  Number(paymentForm.fine)

) {

  return alert(
    "Amount exceeds pending fees"
  );
}


     



      // ======================
      // CASH PAYMENT
      // ======================

      if (

        paymentForm.paymentMethod
        === "CASH"

      ) {

        await api.post(

          "/payments/collect-cash",

          {

            studentId:
              data.student._id,



            studentFeeProfileId:
              data.profile._id,



            feeAssignmentIds: [

              selectedFee._id
            ],



            amount:
              finalAmount,



            feeItems: [

              {

                title:
                  selectedFee.title,

                amount:
                  finalAmount
              }
            ],



            remarks:
              paymentForm.remarks,



            discount:
              paymentForm.discount,



            fine:
              paymentForm.fine
          }
        );



        // ======================
        // RECEIPT
        // ======================

        setReceiptData({

          student:
            data.student,



          fee:
            selectedFee,



          amount:
            finalAmount,



          paymentMethod:
            "CASH",



          remarks:
            paymentForm.remarks,

date:
  new Date(),

receiptNumber:

  "RCPT-" +

  Date.now()

         
        });



        alert(
          "Cash payment collected successfully"
        );



        handleSearch();

        setSelectedFee(null);

        return;
      }



      // ======================
      // ONLINE PAYMENT
      // ======================

      const response =

        await createPaymentOrder({

          studentId:
            data.student._id,



          studentFeeProfileId:
            data.profile._id,



          feeAssignmentIds: [

            selectedFee._id
          ],



          amount:
            finalAmount,



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
      // RAZORPAY OPTIONS
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
          "School Fee Collection",



        order_id:
          gatewayResponse
          .order.id,



        handler:
        async function (
          razorpayResponse
        ) {

          try {

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



                feeItems: [

                  {

                    title:
                      selectedFee.title,

                    amount:
                      finalAmount
                  }
                ]
              });




            if (
              verifyResponse.success
            ) {

              // ======================
              // RECEIPT
              // ======================

              setReceiptData({

                student:
                  data.student,



                fee:
                  selectedFee,



                amount:
                  finalAmount,



                paymentMethod:
                  "ONLINE",



                transactionId:
                  razorpayResponse
                  .razorpay_payment_id,



                remarks:
                  paymentForm.remarks,



                
                  date:
  new Date(),

receiptNumber:

  "RCPT-" +

  Date.now()
              });



              alert(
                "Payment successful"
              );



              handleSearch();

              setSelectedFee(null);

            } else {

              alert(
                "Verification failed"
              );
            }

          } catch (error) {

            console.error(error);

            alert(
              "Payment failed"
            );
          }
        },



        theme: {

          color:
            "#2563eb"
        }
      };
if (
  !window.Razorpay
) {

  return alert(
    "Razorpay SDK not loaded"
  );
}


      const razorpay =
        new window.Razorpay(
          options
        );



      razorpay.open();

    } catch (error) {

      console.error(error);

      alert(
        "Collection failed"
      );
    }
  };




  // ======================
  // PRINT RECEIPT
  // ======================

 const printReceipt =
() => {

  const printContents =

    document.getElementById(
      "receipt-print-area"
    ).innerHTML;



  const win =
    window.open(
      "",
      "",
      "width=900,height=700"
    );



  win.document.write(`

    <html>

      <head>

        <title>
          Fee Receipt
        </title>

      </head>

      <body>

        ${printContents}

      </body>

    </html>

  `);



  win.document.close();

  win.print();
};




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
        Collect Fees
      </h1>



      {/* SEARCH */}

      <div style={searchBox}>

        <input

          type="text"

          onKeyDown={(e) => {

  if (
    e.key === "Enter"
  ) {

    handleSearch();
  }
}}

          placeholder="Search by student name or admission number"

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          style={inputStyle}
        />



        <button

          onClick={handleSearch}
           disabled={loading}

          style={searchButton}
        >

          {

            loading

            ?

            "Searching..."

            :

            "Search Student"
          }

        </button>

      </div>



      {/* RESULT */}

      {

        data && (

          <div style={resultBox}>

           <div
  style={studentHeader}
>

  <div>

    <h1
      style={studentName}
    >

      {

        data.student
        .fullName ||

        data.student.name
      }

    </h1>

    <p>
      Admission No:
      {" "}

      {

        data.student
        .admissionNumber
      }
    </p>

    <p>

      Class:
      {" "}

      {
        data.profile
        .className
      }

      {" | "}

      Section:
      {" "}

      {
        data.profile
        .section
      }

    </p>

  </div>

  <div
    style={pendingBadge}
  >

    <p>
      Total Pending
    </p>

    <h1>

      ₹{

        data.profile
        .totalPendingAmount
      }

    </h1>

  </div>

</div>


            <hr
              style={{
                margin:
                  "20px 0"
              }}
            />



            <h2>
              Fee Summary
            </h2>



            <div style={summaryGrid}>

              <SummaryCard
                title="Assigned"
                amount={
                  data.profile
                  .totalAssignedAmount
                }
              />



              <SummaryCard
                title="Paid"
                amount={
                  data.profile
                  .totalPaidAmount
                }
              />



              <SummaryCard
                title="Pending"
                amount={
                  data.profile
                  .totalPendingAmount
                }
              />

            </div>



            <hr
              style={{
                margin:
                  "20px 0"
              }}
            />



            <h2>
              Fee Items
            </h2>



            {

              data.profile
              .feeAssignments
              ?.map(

                (item) => (

                  <div

                    key={item._id}

                    style={feeCard}
                  >

                    <div>

                      <h3>
                        {item.title}
                      </h3>



                      <p>
                        Amount:
                        ₹{item.amount}
                      </p>



                      <p>
                        Paid:
                        ₹{item.paidAmount || 0}
                      </p>



                      <p>

  Due Date:

  <strong>

    {" "}

    {

      item.dueDate

      ?

      new Date(
        item.dueDate
      ).toLocaleDateString()

      :

      "N/A"
    }

  </strong>

</p>
<p>

  Status:

  <span

    style={{

      color:

        item.pendingAmount <= 0

        ?

        "#16a34a"

        :

        new Date(
          item.dueDate
        ) < new Date()

        ?

        "#dc2626"

        :

        item.status ===
        "PARTIAL"

        ?

        "#f59e0b"

        :

        "#2563eb",

      background:

        item.pendingAmount <= 0

        ?

        "#dcfce7"

        :

        new Date(
          item.dueDate
        ) < new Date()

        ?

        "#fee2e2"

        :

        "#dbeafe",

      padding:
        "4px 12px",

      borderRadius:
        "999px",

      marginLeft: "10px",

      fontWeight: "bold",

      fontSize: "12px"
    }}
  >

    {

      item.pendingAmount <= 0

      ?

      "PAID"

      :

      new Date(
        item.dueDate
      ) < new Date()

      ?

      "OVERDUE"

      :

      item.status
    }

  </span>

</p>
                      

                    </div>

{(
  item.pendingAmount ??
  (
    item.amount -
    (item.paidAmount || 0)
  )
) > 0
 && (

    <button

      onClick={() =>
        openPaymentModal(item)
      }

      style={collectButton}
    >

      Collect Payment

    </button>
  )
}

                    

                  </div>
                )
              )
            }

          </div>
        )
      }



      {/* PAYMENT MODAL */}

      {

        selectedFee && (

          <div
            style={modalOverlay}
          >

            <div
              style={modalBox}
            >

              <h2>
                Collect Payment
              </h2>



              <p>
                {selectedFee.title}
              </p>



              <p>
                Pending:
                ₹{
                  selectedFee.pendingAmount
                }
              </p>



              <input

                type="number"

                name="amount"

                placeholder="Amount"

                value={
                  paymentForm.amount
                }

                onChange={
                  handlePaymentInput
                }

                style={modalInput}
              />



              <input

                type="number"

                name="discount"

                placeholder="Discount"

                value={
                  paymentForm.discount
                }

                onChange={
                  handlePaymentInput
                }

                style={modalInput}
              />



              <input

                type="number"

                name="fine"

                placeholder="Fine"

                value={
                  paymentForm.fine
                }

                onChange={
                  handlePaymentInput
                }

                style={modalInput}
              />



              <select

                name="paymentMethod"

                value={
                  paymentForm.paymentMethod
                }

                onChange={
                  handlePaymentInput
                }

                style={modalInput}
              >

                <option value="CASH">
                  Cash
                </option>

                <option value="ONLINE">
                  Online
                </option>

              </select>



              <textarea

                name="remarks"

                placeholder="Remarks"

                value={
                  paymentForm.remarks
                }

                onChange={
                  handlePaymentInput
                }

                style={{

                  ...modalInput,

                  height: "80px"
                }}
              />



              <button

                onClick={collectPayment}

                style={submitButton}
              >

                Submit Payment

              </button>



              <button

                onClick={() =>
                  setSelectedFee(null)
                }

                style={closeButton}
              >

                Close

              </button>

            </div>

          </div>
        )
      }



      {/* RECEIPT MODAL */}

      {

        receiptData && (

          <div
            style={receiptOverlay}
          >
<div

  id="receipt-print-area"

  style={receiptBox}
>

              <h1
                style={{
                  textAlign:
                    "center"
                }}
              >

                SOFTZEN ERP

              </h1>



              <h3
                style={{
                  textAlign:
                    "center"
                }}
              >

                Fee Payment Receipt

              </h3>
              <p

  style={{

    textAlign:
      "center",

    marginTop: "10px",

    fontWeight:
      "bold"
  }}
>

  Receipt Number:

  {

    receiptData
    .receiptNumber
  }

  

</p>




              <hr
                style={{
                  margin:
                    "20px 0"
                }}
              />



              <p>

                <strong>
                  Student Name:
                </strong>

                {" "}

                {
                  receiptData
                  .student.name
                }

              </p>



              <p>

                <strong>
                  Admission No:
                </strong>

                {" "}

                {

                  receiptData
                  .student
                  .admissionNumber
                }

              </p>



              <p>

                <strong>
                  Fee Type:
                </strong>

                {" "}

                {
                  receiptData
                  .fee.title
                }

              </p>



              <p>

                <strong>
                  Amount Paid:
                </strong>

                {" "}

                ₹{
                  receiptData
                  .amount
                }

              </p>



              <p>

                <strong>
                  Payment Method:
                </strong>

                {" "}

                {
                  receiptData
                  .paymentMethod
                }

              </p>



              {

                receiptData
                .transactionId && (

                  <p>

                    <strong>
                      Transaction ID:
                    </strong>

                    {" "}

                    {

                      receiptData
                      .transactionId
                    }

                  </p>
                )
              }



              {

                receiptData
                .remarks && (

                  <p>

                    <strong>
                      Remarks:
                    </strong>

                    {" "}

                    {
                      receiptData
                      .remarks
                    }

                  </p>
                )
              }



              <p>

                <strong>
                  Date:
                </strong>

                {" "}

                {

                  new Date(
                    receiptData.date
                  )
                  .toLocaleString()
                }

              </p>



              <hr
                style={{
                  margin:
                    "20px 0"
                }}
              />



              <p
                style={{
                  textAlign:
                    "center"
                }}
              >

                This is a computer generated receipt.

              </p>



              <div
                style={receiptActions}
              >

                <button

                  onClick={
                    printReceipt
                  }

                  style={
                    printButton
                  }
                >

                  Print

                </button>



                <button

                  onClick={() =>
                    setReceiptData(
                      null
                    )
                  }

                  style={
                    closeReceiptButton
                  }
                >

                  Close

                </button>

              </div>

            </div>

          </div>
        )
      }

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
      style={summaryCard}
    >

      <h4>
        {title}
      </h4>



      <h2>
        ₹{amount}
      </h2>

    </div>
  );
};



// ======================
// STYLES
// ======================

const searchBox = {

  background: "#fff",

  padding: "20px",

  borderRadius: "12px",

  marginTop: "20px"
};

const resultBox = {

  background: "#fff",

  padding: "20px",

  borderRadius: "12px",

  marginTop: "30px"
};

const inputStyle = {

  width: "100%",

  padding: "12px",

  borderRadius: "8px",

  border: "1px solid #ddd"
};

const searchButton = {

  background: "#2563eb",

  color: "#fff",

  border: "none",

  padding: "12px 20px",

  borderRadius: "8px",

  marginTop: "15px",

  cursor: "pointer"
};

const summaryGrid = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(200px,1fr))",

  gap: "15px"
};

const summaryCard = {

  background: "#f8fafc",

  padding: "20px",

  borderRadius: "10px"
};

const feeCard = {

  border: "1px solid #eee",

  padding: "15px",

  borderRadius: "10px",

  marginTop: "15px",

  display: "flex",

  justifyContent:
    "space-between",

  alignItems: "center"
};

const collectButton = {

  background: "#16a34a",

  color: "#fff",

  border: "none",

  padding: "12px 16px",

  borderRadius: "8px",

  cursor: "pointer"
};

const modalOverlay = {

  position: "fixed",

  top: 0,

  left: 0,

  width: "100%",

  height: "100%",

  background:
    "rgba(0,0,0,0.5)",

  display: "flex",

  alignItems: "center",

  justifyContent:
    "center",

  zIndex: 999
};

const modalBox = {

  background: "#fff",

  padding: "25px",

  borderRadius: "12px",

  width: "400px"
};

const modalInput = {

  width: "100%",

  padding: "12px",

  borderRadius: "8px",

  border: "1px solid #ddd",

  marginTop: "12px"
};

const submitButton = {

  background: "#2563eb",

  color: "#fff",

  border: "none",

  padding: "12px 18px",

  borderRadius: "8px",

  cursor: "pointer",

  marginTop: "15px"
};

const closeButton = {

  background: "#ef4444",

  color: "#fff",

  border: "none",

  padding: "12px 18px",

  borderRadius: "8px",

  cursor: "pointer",

  marginTop: "15px",

  marginLeft: "10px"
};

const receiptOverlay = {

  position: "fixed",

  top: 0,

  left: 0,

  width: "100%",

  height: "100%",

  background:
    "rgba(0,0,0,0.5)",

  display: "flex",

  alignItems: "center",

  justifyContent:
    "center",

  zIndex: 9999
};

const receiptBox = {

  background: "#fff",

  width: "500px",

  padding: "30px",

  borderRadius: "12px",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.2)"
};

const receiptActions = {

  display: "flex",

  gap: "10px",

  marginTop: "20px",

  justifyContent:
    "center"
};

const studentHeader = {

  display: "flex",

  justifyContent:
    "space-between",

  alignItems: "center",

  flexWrap: "wrap",

  gap: "20px",

  marginBottom: "25px"
};

const studentName = {

  fontSize: "32px",

  fontWeight: "700",

  color: "#0f172a",

  marginBottom: "10px"
};

const pendingBadge = {

  background:
    "#fee2e2",

  color: "#dc2626",

  padding: "20px",

  borderRadius: "18px",

  minWidth: "220px",

  textAlign: "center",

  fontWeight: "bold",

  boxShadow:
    "0 4px 10px rgba(220,38,38,0.15)"
};

const printButton = {

  background: "#2563eb",

  color: "#fff",

  border: "none",

  padding: "12px 20px",

  borderRadius: "8px",

  cursor: "pointer"
};

const closeReceiptButton = {

  background: "#ef4444",

  color: "#fff",

  border: "none",

  padding: "12px 20px",

  borderRadius: "8px",

  cursor: "pointer"
};

export default CollectFees;