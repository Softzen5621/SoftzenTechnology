const mongoose =
require("mongoose");

const PaymentOrder =
require(
  "../models/PaymentOrder"
);

const StudentFeeProfile =
require(
  "../models/StudentFeeProfile"
);

const {

  createLedgerEntry

} = require(
  "./FeeLedgerService"
);

const {

  createReceipt

} = require(
  "./ReceiptService"
);

const {

  generateReceiptPdf

} = require(

  "./ReceiptPdfService"
);



// ======================
// GENERATE ORDER ID
// ======================

const generateInternalOrderId =
() => {

  return (

    "ORD-" +

    Date.now() +

    "-" +

    Math.floor(

      Math.random() * 10000
    )
  );
};



// ======================
// CREATE PAYMENT ORDER
// ======================

const createPaymentOrder =
async ({

  schoolId,

  studentId,

  studentFeeProfileId,

  feeAssignmentIds = [],

  amount,

  paymentMethod,

  gateway,

  createdBy,

  req

}) => {

  try {

    // ======================
    // DUPLICATE PROTECTION
    // ======================

    const idempotencyKey =

      `${studentId}-${amount}-${Date.now()}`;



    // ======================
    // CREATE ORDER
    // ======================

    const paymentOrder =
      await PaymentOrder.create({

        schoolId,

        studentId,

        studentFeeProfileId,

        feeAssignmentIds,



        amount,



        paymentMethod,

        gateway,



        internalOrderId:
          generateInternalOrderId(),

        idempotencyKey,



        createdBy,



        ipAddress:
          req?.ip || "",

        deviceInfo:
          req?.headers[
            "user-agent"
          ] || ""

      });

    return paymentOrder;

  } catch (error) {

    console.error(

      "CREATE ORDER ERROR:",

      error
    );

    throw error;
  }
};



// ======================
// COMPLETE PAYMENT
// ======================

const completePayment =
async ({

  paymentOrderId,

  gatewayPaymentId = "",

  gatewayOrderId = "",

  gatewaySignature = "",

  transactionId = "",

  verified = true,

  verificationSource = "MANUAL",

  feeItems = [],

  req

}) => {

  // const session =
  //   await mongoose.startSession();

  // session.startTransaction();

  try {

    // ======================
    // GET ORDER
    // ======================

    const paymentOrder =
      await PaymentOrder.findById(

        paymentOrderId

      );
      // .session(session)

    if (!paymentOrder) {

      throw new Error(
        "Payment order not found"
      );
    }



    // ======================
    // PREVENT DUPLICATE
    // ======================

    if (
      paymentOrder.paymentStatus
      === "SUCCESS"
    ) {

      throw new Error(
        "Payment already completed"
      );
    }



    // ======================
    // UPDATE ORDER
    // ======================

    paymentOrder.paymentStatus =
      "SUCCESS";

    paymentOrder.gatewayPaymentId =
      gatewayPaymentId;

    paymentOrder.gatewayOrderId =
      gatewayOrderId;

    paymentOrder.gatewaySignature =
      gatewaySignature;

    paymentOrder.verified =
      verified;

    paymentOrder.verificationSource =
      verificationSource;

    paymentOrder.completedAt =
      new Date();

      await paymentOrder.save();

    // await paymentOrder.save({

    //   session
    // });



    // ======================
    // CREATE LEDGER ENTRY
    // ======================

    const ledger =
      await createLedgerEntry({

        schoolId:
          paymentOrder.schoolId,

        studentId:
          paymentOrder.studentId,

        studentFeeProfileId:
          paymentOrder
          .studentFeeProfileId,

        feeAssignmentId:
          paymentOrder
          .feeAssignmentIds[0],

        transactionType:
          "PAYMENT_SUCCESS",

        amount:
          paymentOrder.amount,

        title:
          "Fee Payment",

        description:
          "Payment collected successfully",

        paymentMethod:
          paymentOrder.paymentMethod,

        gateway:
          paymentOrder.gateway,

        gatewayTransactionId:
          gatewayPaymentId,

        gatewayOrderId,

        paymentOrderId:
          paymentOrder._id,

        createdBy:
          paymentOrder.createdBy,

        req

      });



    // ======================
    // GET UPDATED PROFILE
    // ======================

    const profile =
      await StudentFeeProfile.findById(

        paymentOrder
        .studentFeeProfileId

      );

      if (!profile) {

  throw new Error(
    "Student Fee Profile not found"
  );
}
      // .session(session);


// ======================
// UPDATE FEE ASSIGNMENTS
// ======================
for (const assignmentId of paymentOrder.feeAssignmentIds) {

  const fee =
    profile.feeAssignments.id(
      assignmentId
    );

  if (!fee) continue;

  fee.paidAmount =
    (fee.paidAmount || 0)
    + paymentOrder.amount;

  fee.pendingAmount =
    Math.max(
      0,
      fee.amount -
      fee.paidAmount
    );

  if (fee.pendingAmount === 0) {

    fee.status = "PAID";

    fee.paymentStatus =
      "PAID";

  } else {

    fee.status = "PARTIAL";

    fee.paymentStatus =
      "PARTIAL";
  }
}

// profile.lastPaymentDate =
//   new Date();

//   await profile.save();
// await profile.save({
//   session
// });

// ======================
// UPDATE TOTALS
// ======================

// profile.totalPaidAmount =
//   profile.feeAssignments.reduce(
//     (sum, item) =>
//       sum + (item.paidAmount || 0),
//     0
//   );

// profile.totalPendingAmount =
//   profile.feeAssignments.reduce(
//     (sum, item) =>
//       sum + (item.pendingAmount || item.amount),
//     0
//   );
// await profile.save();

profile.lastPaymentDate =
  new Date();

profile.totalPaidAmount =
  profile.feeAssignments.reduce(
    (sum, item) =>
      sum + (item.paidAmount || 0),
    0
  );

profile.totalPendingAmount =
  profile.feeAssignments.reduce(
    (sum, item) =>
      sum + (item.pendingAmount || item.amount),
    0
  );

await profile.save();



// await profile.save({
//   session
// });

    // ======================
    // CREATE RECEIPT
    // ======================

    const receipt =
      await createReceipt({

        schoolId:
          paymentOrder.schoolId,

        studentId:
          paymentOrder.studentId,

        studentFeeProfileId:
          paymentOrder
          .studentFeeProfileId,

        paymentOrderId:
          paymentOrder._id,

        ledgerEntries: [

          ledger
        ],

        paymentMethod:
          paymentOrder.paymentMethod,

        gateway:
          paymentOrder.gateway,

        amountPaid:
          paymentOrder.amount,

        subtotal:
          paymentOrder.amount,

        pendingAmount:
          profile.totalPendingAmount,

        transactionId,

        gatewayOrderId,

        feeItems,

        createdBy:
          paymentOrder.createdBy,

        req
      });
      await generateReceiptPdf(
  receipt._id
);



    // ======================
    // COMMIT
    // ======================

    // await session.commitTransaction();

    // session.endSession();

    return {

      success: true,

      paymentOrder,

      ledger,

      receipt
    };

  } catch (error) {

    // ======================
    // ROLLBACK
    // ======================

    // await session.abortTransaction();

    // session.endSession();

    console.error(

      "COMPLETE PAYMENT ERROR:",

      error
    );

    throw error;
  }
};



// ======================
// FAIL PAYMENT
// ======================

const failPayment =
async ({

  paymentOrderId,

  reason = "",

  gatewayResponse = {}

}) => {

  try {

    const paymentOrder =
      await PaymentOrder.findById(

        paymentOrderId
      );

    if (!paymentOrder) {

      throw new Error(
        "Payment order not found"
      );
    }

    paymentOrder.paymentStatus =
      "FAILED";

    paymentOrder.failureReason =
      reason;

    paymentOrder.gatewayResponse =
      gatewayResponse;

    await paymentOrder.save();

    return paymentOrder;

  } catch (error) {

    console.error(

      "FAIL PAYMENT ERROR:",

      error
    );

    throw error;
  }
};



// ======================
// EXPORTS
// ======================

module.exports = {

  createPaymentOrder,

  completePayment,

  failPayment
};