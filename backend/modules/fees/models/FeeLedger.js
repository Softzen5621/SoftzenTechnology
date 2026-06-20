const mongoose =
require("mongoose");

const feeLedgerSchema =
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
  // FEE ASSIGNMENT
  // ======================

  feeAssignmentId: {

    type:
      mongoose.Schema.Types.ObjectId,

    required: true
  },



  // ======================
  // TRANSACTION TYPE
  // ======================

  transactionType: {

    type: String,

    enum: [

      "FEE_CREATED",

      "PAYMENT_SUCCESS",

      "PAYMENT_FAILED",

      "PAYMENT_PENDING",

      "DISCOUNT",

      "FINE",

      "REFUND",

      "WAIVER",

      "REVERSAL",

      "ADJUSTMENT"
    ],

    required: true,

    index: true
  },



  // ======================
  // AMOUNT
  // ======================

  amount: {

    type: Number,

    required: true,

    min: 0
  },



  // ======================
  // PAYMENT INFO
  // ======================

  paymentMethod: {

    type: String,

    enum: [

      "CASH",

      "UPI",

      "CARD",

      "BANK_TRANSFER",

      "CHEQUE",

      "ONLINE"
    ]
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
  // GATEWAY REFERENCES
  // ======================

  gatewayTransactionId: {

    type: String,

    default: "",
},

  gatewayOrderId: {

    type: String,

    default: ""
  },

  paymentOrderId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "PaymentOrder"
  },



  // ======================
  // RECEIPT
  // ======================

  receiptNumber: {

    type: String,

    default: "",

    index: true
  },



  // ======================
  // STATUS
  // ======================

  status: {

    type: String,

    enum: [

      "PENDING",

      "SUCCESS",

      "FAILED",

      "CANCELLED"
    ],

    default: "SUCCESS",

    index: true
  },



  // ======================
  // DESCRIPTION
  // ======================

  title: {

    type: String,

    required: true
  },

  description: {

    type: String,

    default: ""
  },

  remarks: {

    type: String,

    default: ""
  },



  // ======================
  // SECURITY
  // ======================

  createdBy: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true
  },

  approvedBy: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User"
  },



  // ======================
  // APPROVAL
  // ======================

  approvalRequired: {

    type: Boolean,

    default: false
  },

  approvalStatus: {

    type: String,

    enum: [

      "PENDING",

      "APPROVED",

      "REJECTED"
    ],

    default: "APPROVED"
  },



  // ======================
  // REVERSAL
  // ======================

  reversedEntryId: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "FeeLedger"
  },



  // ======================
  // METADATA
  // ======================

  metadata: {

    type: Object,

    default: {}
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

feeLedgerSchema.index({

  schoolId: 1,

  studentId: 1
});

feeLedgerSchema.index({

  schoolId: 1,

  transactionType: 1
});

feeLedgerSchema.index({

  schoolId: 1,

  createdAt: -1
});



feeLedgerSchema.index({

  gatewayTransactionId: 1

}, {

  unique: true,

  sparse: true
});



// ======================
// PREVENT HARD DELETE
// ======================

feeLedgerSchema.pre(

  "deleteOne",

  async function(next) {

    next(
      new Error(
        "Ledger entries cannot be deleted"
      )
    );
  }
);

feeLedgerSchema.pre(

  "findOneAndDelete",

  async function(next) {

    next(
      new Error(
        "Ledger entries cannot be deleted"
      )
    );
  }
);

module.exports =
mongoose.model(
  "FeeLedger",
  feeLedgerSchema
);