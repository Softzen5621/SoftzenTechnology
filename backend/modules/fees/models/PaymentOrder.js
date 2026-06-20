const mongoose =
require("mongoose");

const paymentOrderSchema =
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

    ref: "StudentFeeProfile",

    required: true
  },



  // ======================
  // ASSIGNMENTS
  // ======================

  feeAssignmentIds: [

    {

      type:
        mongoose.Schema.Types.ObjectId
    }
  ],



  // ======================
  // PAYMENT DETAILS
  // ======================

  amount: {

    type: Number,

    required: true,

    min: 1
  },

  currency: {

    type: String,

    default: "INR"
  },



  // ======================
  // PAYMENT METHOD
  // ======================

  paymentMethod: {

    type: String,

    enum: [

      "ONLINE",

      "CASH",

      "CHEQUE",

      "BANK_TRANSFER",

      "UPI"
    ],

    required: true
  },



  // ======================
  // GATEWAY
  // ======================

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

    required: true
  },



  // ======================
  // GATEWAY IDS
  // ======================

  gatewayOrderId: {

    type: String,

    default: "",

    index: true
  },

  gatewayPaymentId: {

    type: String,

    default: "",

    index: true
  },

  gatewaySignature: {

    type: String,

    default: ""
  },



  // ======================
  // INTERNAL IDS
  // ======================

  internalOrderId: {

    type: String,

    required: true,

    unique: true,

    index: true
  },

  idempotencyKey: {

    type: String,

    required: true,

    unique: true,

    index: true
  },



  // ======================
  // PAYMENT STATUS
  // ======================

  paymentStatus: {

    type: String,

    enum: [

      "CREATED",

      "PENDING",

      "PROCESSING",

      "SUCCESS",

      "FAILED",

      "CANCELLED",

      "REFUNDED",

      "PARTIAL_REFUND",

      "EXPIRED"
    ],

    default: "CREATED",

    index: true
  },



  // ======================
  // PAYMENT TIMING
  // ======================

  initiatedAt: {

    type: Date,

    default: Date.now
  },

  completedAt: Date,

  expiredAt: Date,



  // ======================
  // RECEIPT
  // ======================

  receiptNumber: {

    type: String,

    default: ""
  },



  // ======================
  // FAILURE INFO
  // ======================

  failureReason: {

    type: String,

    default: ""
  },

  gatewayResponse: {

    type: Object,

    default: {}
  },



  // ======================
  // REFUND
  // ======================

  refundedAmount: {

    type: Number,

    default: 0
  },

  refundReason: {

    type: String,

    default: ""
  },



  // ======================
  // SECURITY
  // ======================

  verified: {

    type: Boolean,

    default: false
  },

  verificationSource: {

    type: String,

    enum: [

      "WEBHOOK",

      "MANUAL",

      "API_VERIFY"
    ]
  },



  // ======================
  // USER
  // ======================

  createdBy: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User"
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
  // METADATA
  // ======================

  metadata: {

    type: Object,

    default: {}
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

paymentOrderSchema.index({

  schoolId: 1,

  studentId: 1
});

paymentOrderSchema.index({

  schoolId: 1,

  paymentStatus: 1
});

paymentOrderSchema.index({

  schoolId: 1,

  gateway: 1
});

paymentOrderSchema.index({

  createdAt: -1
});



// ======================
// PREVENT HARD DELETE
// ======================

paymentOrderSchema.pre(

  "deleteOne",

  async function(next) {

    next(
      new Error(
        "Payment orders cannot be deleted"
      )
    );
  }
);

paymentOrderSchema.pre(

  "findOneAndDelete",

  async function(next) {

    next(
      new Error(
        "Payment orders cannot be deleted"
      )
    );
  }
);

module.exports =
mongoose.model(
  "PaymentOrder",
  paymentOrderSchema
);