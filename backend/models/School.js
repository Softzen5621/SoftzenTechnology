const mongoose =
  require("mongoose");

const schoolSchema =
  new mongoose.Schema(

    {

      // ======================
      // BASIC INFO
      // ======================

      schoolName: {

        type: String,

        required: true,

        trim: true
      },

      schoolCode: {

        type: String,

        required: true,

        uppercase: true,

        trim: true
      },

      logo: {

        type: String,

        default: ""
      },

      email: {

        type: String,

        default: ""
      },

      phone: {

        type: String,

        default: ""
      },

      address: {

        type: String,

        default: ""
      },

      website: {

        type: String,

        default: ""
      },

      // ======================
      // ADMIN INFO
      // ======================

      adminId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null
      },

      adminName: {

        type: String,

        default: ""
      },

      adminEmail: {

        type: String,

        default: ""
      },

      // ======================
      // SaaS PLAN
      // ======================

      plan: {

        type: String,

        enum: [

          "FREE",

          "BASIC",

          "PRO",

          "ENTERPRISE"
        ],

        default: "FREE"
      },

      // ======================
      // LIMITS
      // ======================

      maxStudents: {

        type: Number,

        default: 100
      },

      maxTeachers: {

        type: Number,

        default: 10
      },

      storageLimit: {

        type: Number,

        default: 1
      },

      currentStorageUsed: {

        type: Number,

        default: 0
      },

      // ======================
      // SUBSCRIPTION
      // ======================

      expiryDate: {

        type: Date,

        default: null
      },

      planExpiry: {

        type: Date,

        default: null
      },

      autoRenew: {

        type: Boolean,

        default: false
      },

      // ======================
      // STATUS
      // ======================

      isActive: {

        type: Boolean,

        default: true
      },

      isSuspended: {

        type: Boolean,

        default: false
      },

      isDeleted: {

        type: Boolean,

        default: false
      },

      // ======================
      // MODULE ACCESS
      // ======================

      enabledModules: {

        type: [String],

        default: [

          "dashboard",

          "students",

          "teachers",

          "attendance"
        ]
      },

      // ======================
      // SECURITY
      // ======================

      allowedIPs: {

        type: [String],

        default: []
      },

      loginProtection: {

        type: Boolean,

        default: true
      },

      auditLogsEnabled: {

        type: Boolean,

        default: true
      },

      // ======================
      // BRANDING
      // ======================

      primaryColor: {

        type: String,

        default: "#06b6d4"
      },

      secondaryColor: {

        type: String,

        default: "#0f172a"
      },

      customDomain: {

        type: String,

        default: ""
      },

      // ======================
      // ANALYTICS
      // ======================

      totalStudents: {

        type: Number,

        default: 0
      },

      totalTeachers: {

        type: Number,

        default: 0
      },

      totalRevenue: {

        type: Number,

        default: 0
      },

      // ======================
      // ACTIVITY
      // ======================

      lastActiveAt: {

        type: Date,

        default: null
      }
    },

    {

      timestamps: true
    }
  );

// ======================
// INDEXES
// ======================

schoolSchema.index({

  schoolCode: 1
});

schoolSchema.index({

  adminEmail: 1
});

schoolSchema.index({

  plan: 1
});

schoolSchema.index({

  isActive: 1
});

// ======================
// EXPORT
// ======================

module.exports =
  mongoose.model(

    "School",

    schoolSchema
  );