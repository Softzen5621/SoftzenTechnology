const mongoose =
  require("mongoose");

const activityLogSchema =
  new mongoose.Schema(

    {

      // ======================
      // USER INFO
      // ======================

      performedBy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true
      },

      performedByName: {

        type: String,

        default: ""
      },

      performedByRole: {

        type: String,

        default: ""
      },

      schoolId: {

        type: String,

        required: true
      },

      // ======================
      // ACTION DETAILS
      // ======================

      actionType: {

        type: String,

        enum: [

          "CREATE",

          "UPDATE",

          "DELETE",

          "LOGIN",

          "LOGOUT",

          "RESTORE",

          "REVERT",

          "PAYMENT",

          "STATUS_CHANGE"
        ],

        required: true
      },

      module: {

        type: String,

        required: true
      },

      description: {

        type: String,

        default: ""
      },

      // ======================
      // DOCUMENT INFO
      // ======================

      documentId: {

        type: String,

        default: ""
      },

      collectionName: {

        type: String,

        default: ""
      },

      // ======================
      // BEFORE / AFTER DATA
      // ======================

      oldData: {

        type: mongoose.Schema.Types.Mixed,

        default: null
      },

      newData: {

        type: mongoose.Schema.Types.Mixed,

        default: null
      },

      changedFields: {

        type: [String],

        default: []
      },

      // ======================
      // FEES / SENSITIVE REASON
      // ======================

      reason: {

        type: String,

        default: ""
      },

      // ======================
      // SECURITY
      // ======================

      ipAddress: {

        type: String,

        default: ""
      },

      deviceInfo: {

        type: String,

        default: ""
      },

      browser: {

        type: String,

        default: ""
      },

      operatingSystem: {

        type: String,

        default: ""
      },

      // ======================
      // REVERT SYSTEM
      // ======================

      isReverted: {

        type: Boolean,

        default: false
      },

      revertedBy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null
      },

      revertReason: {

        type: String,

        default: ""
      },

      revertedAt: {

        type: Date,

        default: null
      },

      // ======================
      // SOFT DELETE
      // ======================

      isDeleted: {

        type: Boolean,

        default: false
      },

      deletedAt: {

        type: Date,

        default: null
      },

      // ======================
      // COMPLIANCE FLAGS
      // ======================

      isSensitive: {

        type: Boolean,

        default: false
      },

      severity: {

        type: String,

        enum: [

          "LOW",

          "MEDIUM",

          "HIGH",

          "CRITICAL"
        ],

        default: "LOW"
      }
    },

    {

      timestamps: true
    }
  );

// ======================
// INDEXES
// ======================

activityLogSchema.index({

  schoolId: 1,

  module: 1,

  actionType: 1
});

activityLogSchema.index({

  performedBy: 1
});

activityLogSchema.index({

  createdAt: -1
});

// ======================
// EXPORT
// ======================

module.exports =
  mongoose.model(

    "ActivityLog",

    activityLogSchema
  );