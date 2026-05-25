const mongoose =
  require("mongoose");

const feePaymentSchema =
  new mongoose.Schema(

    {
      // SCHOOL
      schoolId: {

        type: String,

        required: true
      },

      // STUDENT
      studentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Student",

        required: true
      },

      // FEE STRUCTURE
      feeStructureId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "FeeStructure",

        required: true
      },

      // PAYMENT INFO
      amountPaid: {

        type: Number,

        required: true,

        min: 0
      },

      totalAmount: {

        type: Number,

        required: true
      },

      pendingAmount: {

        type: Number,

        default: 0
      },

      // PAYMENT MODE
      paymentMode: {

        type: String,

        enum: [

          "Cash",

          "UPI",

          "Card",

          "Bank Transfer",

          "Cheque"
        ],

        required: true
      },

      // RECEIPT
      receiptNumber: {

        type: String,

        required: true
      },

      // DATE
      paymentDate: {

        type: String,

        required: true
      },

      // STATUS
      paymentStatus: {

        type: String,

        enum: [

          "Paid",

          "Partial",

          "Pending"
        ],

        default: "Pending"
      },

      // REMARKS
      remarks: {

        type: String,

        default: ""
      }
    },

    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(

    "FeePayment",

    feePaymentSchema
  );