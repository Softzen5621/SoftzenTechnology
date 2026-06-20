const mongoose =
require("mongoose");

const FeeLedger =
require(
  "../models/FeeLedger"
);

const StudentFeeProfile =
require(
  "../models/StudentFeeProfile"
);



// ======================
// CREATE LEDGER ENTRY
// ======================

const createLedgerEntry =
async ({

  schoolId,

  studentId,

  studentFeeProfileId,

  feeAssignmentId,

  transactionType,

  amount,

  title,

  description = "",

  paymentMethod = null,

  gateway = "MANUAL",

  receiptNumber = "",

  gatewayTransactionId = "",

  gatewayOrderId = "",

  paymentOrderId = null,

  approvalRequired = false,

  metadata = {},

  createdBy,

  approvedBy = null,

  req

}) => {

  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {

    // ======================
    // CREATE LEDGER
    // ======================

    const ledger =
      await FeeLedger.create([{

        schoolId,

        studentId,

        studentFeeProfileId,

        feeAssignmentId,

        transactionType,

        amount,

        title,

        description,

        paymentMethod,

        gateway,

        receiptNumber,

        gatewayTransactionId,

        gatewayOrderId,

        paymentOrderId,

        approvalRequired,

        metadata,

        createdBy,

        approvedBy,

        ipAddress:
          req?.ip || "",

        deviceInfo:
          req?.headers[
            "user-agent"
          ] || ""

      }], {

        session
      });




    // ======================
    // UPDATE PROFILE SUMMARY
    // ======================

    const profile =
      await StudentFeeProfile.findById(

        studentFeeProfileId
      ).session(session);

    if (!profile) {

      throw new Error(
        "Student fee profile not found"
      );
    }



    // ======================
    // CALCULATIONS
    // ======================

    switch (
      transactionType
    ) {

      case "PAYMENT_SUCCESS":

        profile.totalPaidAmount +=
          amount;

        profile.lastPaymentDate =
          new Date();

        break;



      case "DISCOUNT":

        profile.totalDiscountAmount +=
          amount;

        break;



      case "FINE":

        profile.totalFineAmount +=
          amount;

        break;



      case "REFUND":

        profile.totalPaidAmount -=
          amount;

        break;
    }



    // ======================
    // RECALCULATE PENDING
    // ======================

    profile.totalPendingAmount =

      profile.totalAssignedAmount

      - profile.totalPaidAmount

      - profile.totalDiscountAmount

      + profile.totalFineAmount;



    // ======================
    // SAVE PROFILE
    // ======================

    await profile.save({

      session
    });



    // ======================
    // COMMIT
    // ======================

    await session.commitTransaction();

    session.endSession();

    return ledger[0];

  } catch (error) {

    // ======================
    // ROLLBACK
    // ======================

    await session.abortTransaction();

    session.endSession();

    console.error(

      "LEDGER SERVICE ERROR:",

      error
    );

    throw error;
  }
};



// ======================
// GET STUDENT BALANCE
// ======================

const getStudentBalance =
async (studentFeeProfileId) => {

  try {

    const profile =
      await StudentFeeProfile.findById(

        studentFeeProfileId
      );

    if (!profile) {

      throw new Error(
        "Profile not found"
      );
    }

    return {

      totalAssigned:
        profile.totalAssignedAmount,

      totalPaid:
        profile.totalPaidAmount,

      totalDiscount:
        profile.totalDiscountAmount,

      totalFine:
        profile.totalFineAmount,

      totalPending:
        profile.totalPendingAmount
    };

  } catch (error) {

    console.error(

      "BALANCE ERROR:",

      error
    );

    throw error;
  }
};



// ======================
// EXPORTS
// ======================

module.exports = {

  createLedgerEntry,

  getStudentBalance
};