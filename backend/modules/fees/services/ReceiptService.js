const Receipt =
require(
  "../models/Receipt"
);

const PaymentOrder =
require(
  "../models/PaymentOrder"
);

const Student =
require(
  "../../../models/Student"
);

const StudentFeeProfile =
require(
  "../models/StudentFeeProfile"
);



// ======================
// GENERATE RECEIPT NUMBER
// ======================

const generateReceiptNumber =
async (schoolId) => {

  const year =
    new Date()
    .getFullYear();

  const prefix =
    `${schoolId}-${year}`;

  const lastReceipt =
    await Receipt.findOne({

      schoolId

    })

    .sort({

      createdAt: -1
    });

  let nextNumber = 1;

  if (
    lastReceipt &&
    lastReceipt.receiptNumber
  ) {

    const parts =
      lastReceipt.receiptNumber
      .split("-");

    const lastNumber =
      parseInt(

        parts[
          parts.length - 1
        ]
      );

    if (!isNaN(lastNumber)) {

      nextNumber =
        lastNumber + 1;
    }
  }

  return (
    `${prefix}-` +
    String(nextNumber)
    .padStart(6, "0")
  );
};



// ======================
// CREATE RECEIPT
// ======================

const createReceipt =
async ({

  schoolId,

  studentId,

  studentFeeProfileId,

  paymentOrderId,

  ledgerEntries = [],

  paymentMethod,

  gateway = "MANUAL",

  amountPaid,

  subtotal = 0,

  discountAmount = 0,

  fineAmount = 0,

  pendingAmount = 0,

  transactionId = "",

  gatewayOrderId = "",

  feeItems = [],

  createdBy,

  req

}) => {

  try {

    // ======================
    // GET STUDENT
    // ======================

    const student =
      await Student.findById(
        studentId
      );

    if (!student) {

      throw new Error(
        "Student not found"
      );
    }



    // ======================
    // GET PROFILE
    // ======================

    const profile =
      await StudentFeeProfile.findById(

        studentFeeProfileId
      );



    // ======================
    // RECEIPT NUMBER
    // ======================

    const receiptNumber =
      await generateReceiptNumber(

        schoolId
      );



    // ======================
    // QR DATA
    // ======================

    const qrCodeData =
      JSON.stringify({

        receiptNumber,

        schoolId,

        studentId,

        amountPaid
      });



    // ======================
    // CREATE RECEIPT
    // ======================

    const receipt =
      await Receipt.create({

        schoolId,

        studentId,

        studentFeeProfileId,

        paymentOrderId,

        ledgerEntryIds:
          ledgerEntries.map(

            (entry) =>
              entry._id
          ),

        receiptNumber,



        studentSnapshot: {

          studentName:
            student.name,

          admissionNumber:
            student.admissionNumber,

          className:
            student.className,

          section:
            student.section,

          rollNumber:
            student.rollNumber,

          parentName:
            student.parentName
        },



        amountPaid,

        paymentMethod,

        gateway,



        feeItems,



        subtotal,

        discountAmount,

        fineAmount,

        totalAmount:
          amountPaid,

        pendingAmount,



        transactionId,

        gatewayOrderId,



        qrCodeData,

        verificationCode:
          receiptNumber,



        createdBy,



        ipAddress:
          req?.ip || "",

        deviceInfo:
          req?.headers[
            "user-agent"
          ] || ""

      });



    // ======================
    // UPDATE PAYMENT ORDER
    // ======================

    await PaymentOrder.findByIdAndUpdate(

      paymentOrderId,

      {

        receiptNumber
      }
    );



    return receipt;

  } catch (error) {

    console.error(

      "RECEIPT SERVICE ERROR:",

      error
    );

    throw error;
  }
};



// ======================
// EXPORTS
// ======================

module.exports = {

  createReceipt,

  generateReceiptNumber
};