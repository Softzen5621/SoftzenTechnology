const mongoose =
require("mongoose");

const receiptSchema =
new mongoose.Schema({

  // ======================
  // SCHOOL
  // ======================

  schoolId: {

    type: String,

    required: true,

    index: true
  },



  // ======================
  // STUDENT
  // ======================

  studentId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "Student",

    required: true,

    index: true
  },



  // ======================
  // PROFILE
  // ======================

  studentFeeProfileId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "StudentFeeProfile"
  },



  // ======================
  // PAYMENT ORDER
  // ======================

  paymentOrderId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "PaymentOrder",

    required: true
  },



  // ======================
  // LEDGER ENTRIES
  // ======================

  ledgerEntryIds: [

    {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "FeeLedger"
    }
  ],



  // ======================
  // RECEIPT DETAILS
  // ======================

  receiptNumber: {

    type: String,

    required: true,

    unique: true,

    index: true
  },

  receiptType: {

    type: String,

    enum: [

      "PAYMENT",

      "REFUND",

      "ADJUSTMENT"
    ],

    default: "PAYMENT"
  },



  // ======================
  // STUDENT SNAPSHOT
  // ======================

  studentSnapshot: {

    studentName: String,

    admissionNumber: String,

    className: String,

    section: String,

    rollNumber: String,

    parentName: String
  },



  // ======================
  // PAYMENT DETAILS
  // ======================

  amountPaid: {

    type: Number,

    required: true,

    min: 0
  },

  paymentMethod: {

    type: String,

    enum: [

      "CASH",

      "UPI",

      "CARD",

      "BANK_TRANSFER",

      "CHEQUE",

      "ONLINE"
    ],

    required: true
  },

  gateway: {

    type: String,

    enum: [

      "RAZORPAY",

      "STRIPE",

      "PHONEPE",

      "PAYTM",

      "CASHFREE",

      "MANUAL"
    ],

    default: "MANUAL"
  },



  // ======================
  // FEE ITEMS
  // ======================

  feeItems: [

    {

      title: String,

      code: String,

      amount: Number
    }
  ],



  // ======================
  // FINANCIAL SUMMARY
  // ======================

  subtotal: {

    type: Number,

    default: 0
  },

  discountAmount: {

    type: Number,

    default: 0
  },

  fineAmount: {

    type: Number,

    default: 0
  },

  totalAmount: {

    type: Number,

    required: true
  },

  pendingAmount: {

    type: Number,

    default: 0
  },



  // ======================
  // TRANSACTION INFO
  // ======================

  transactionId: {

    type: String,

    default: ""
  },

  gatewayOrderId: {

    type: String,

    default: ""
  },



  // ======================
  // PDF
  // ======================

  pdfUrl: {

    type: String,

    default: ""
  },



  // ======================
  // QR VERIFICATION
  // ======================

  qrCodeData: {

    type: String,

    default: ""
  },

  verificationCode: {

    type: String,

    default: ""
  },



  // ======================
  // STATUS
  // ======================

  status: {

    type: String,

    enum: [

      "ACTIVE",

      "CANCELLED",

      "REFUNDED"
    ],

    default: "ACTIVE"
  },



  // ======================
  // PRINT TRACKING
  // ======================

  printCount: {

    type: Number,

    default: 0
  },

  lastPrintedAt: Date,



  // ======================
  // CREATED BY
  // ======================

  createdBy: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true
  },



  // ======================
  // AUDIT
  // ======================

  ipAddress: {

    type: String,

    default: ""
  },

  deviceInfo: {

    type: String,

    default: ""
  },



  // ======================
  // NOTES
  // ======================

  remarks: {

    type: String,

    default: ""
  },



  // ======================
  // SOFT DELETE
  // ======================

  isDeleted: {

    type: Boolean,

    default: false
  }

}, {

  timestamps: true
});



// ======================
// INDEXES
// ======================

receiptSchema.index({

  schoolId: 1,

  receiptNumber: 1
});

receiptSchema.index({

  schoolId: 1,

  studentId: 1
});

receiptSchema.index({

  createdAt: -1
});



// ======================
// PREVENT HARD DELETE
// ======================

receiptSchema.pre(

  "deleteOne",

  async function(next) {

    next(
      new Error(
        "Receipts cannot be deleted"
      )
    );
  }
);

receiptSchema.pre(

  "findOneAndDelete",

  async function(next) {

    next(
      new Error(
        "Receipts cannot be deleted"
      )
    );
  }
);

module.exports =
mongoose.model(
  "Receipt",
  receiptSchema
);