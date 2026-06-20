const mongoose =
require("mongoose");

const schoolPaymentGatewaySchema =
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
  // GATEWAY
  // ======================

  provider: {

    type: String,

    enum: [

      "RAZORPAY",

      "STRIPE",

      "PHONEPE",

      "PAYTM",

      "CASHFREE"
    ],

    required: true
  },



  // ======================
  // DISPLAY
  // ======================

  displayName: {

    type: String,

    required: true
  },



  // ======================
  // API KEYS
  // ======================

  publicKey: {

    type: String,

    required: true
  },

  encryptedSecretKey: {

    type: String,

    required: true
  },

  encryptedWebhookSecret: {

    type: String,

    required: true
  },



  // ======================
  // STATUS
  // ======================

  active: {

    type: Boolean,

    default: true
  },

  sandboxMode: {

    type: Boolean,

    default: false
  },



  // ======================
  // PAYMENT OPTIONS
  // ======================

  supportedMethods: [

    {

      type: String,

      enum: [

        "UPI",

        "CARD",

        "NETBANKING",

        "WALLET",

        "EMI"
      ]
    }
  ],



  // ======================
  // CALLBACKS
  // ======================

  webhookUrl: {

    type: String,

    default: ""
  },

  successRedirectUrl: {

    type: String,

    default: ""
  },

  failureRedirectUrl: {

    type: String,

    default: ""
  },



  // ======================
  // LIMITS
  // ======================

  minimumAmount: {

    type: Number,

    default: 1
  },

  maximumAmount: {

    type: Number,

    default: 1000000
  },



  // ======================
  // AUTO FEATURES
  // ======================

  autoVerifyPayments: {

    type: Boolean,

    default: true
  },

  autoGenerateReceipt: {

    type: Boolean,

    default: true
  },

  autoSendNotifications: {

    type: Boolean,

    default: true
  },



  // ======================
  // SECURITY
  // ======================

  allowedIPs: [

    {
      type: String
    }
  ],

  allowedDomains: [

    {
      type: String
    }
  ],



  // ======================
  // RATE LIMITING
  // ======================

  maxRequestsPerMinute: {

    type: Number,

    default: 100
  },



  // ======================
  // CREATED BY
  // ======================

  createdBy: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true
  },

  updatedBy: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User"
  },



  // ======================
  // AUDIT
  // ======================

  lastUsedAt: Date,

  lastVerifiedAt: Date,



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
// UNIQUE INDEX
// ======================

schoolPaymentGatewaySchema.index({

  schoolId: 1,

  provider: 1

}, {

  unique: true
});



// ======================
// INDEXES
// ======================

schoolPaymentGatewaySchema.index({

  schoolId: 1,

  active: 1
});



// ======================
// PREVENT HARD DELETE
// ======================

schoolPaymentGatewaySchema.pre(

  "deleteOne",

  async function(next) {

    next(
      new Error(
        "Gateway configs cannot be deleted"
      )
    );
  }
);

schoolPaymentGatewaySchema.pre(

  "findOneAndDelete",

  async function(next) {

    next(
      new Error(
        "Gateway configs cannot be deleted"
      )
    );
  }
);

module.exports =
mongoose.model(

  "SchoolPaymentGateway",

  schoolPaymentGatewaySchema
);