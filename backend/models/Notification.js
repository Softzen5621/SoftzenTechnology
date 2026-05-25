const mongoose =
  require("mongoose");

const notificationSchema =
  new mongoose.Schema(

    {

      // ======================================================
      // SCHOOL
      // ======================================================

      schoolId: {

        type: String,

        required: true,

        trim: true
      },

      // ======================================================
      // USER
      // ======================================================

      userId: {

        type:
          mongoose.Schema.Types.ObjectId,

        required: true
      },

      // ======================================================
      // USER ROLE
      // ======================================================

      userRole: {

        type: String,

        enum: [

          "admin",

          "teacher",

          "student",

          "parent"
        ],

        required: true
      },

      // ======================================================
      // TITLE
      // ======================================================

      title: {

        type: String,

        required: true,

        trim: true
      },

      // ======================================================
      // MESSAGE
      // ======================================================

      message: {

        type: String,

        required: true
      },

      // ======================================================
      // TYPE
      // ======================================================

      type: {

        type: String,

        enum: [

          "homework",

          "attendance",

          "result",

          "question",

          "reply",

          "announcement",

          "homework_viewed",

          "homework_acknowledged",

          "homework_question",

          "submission",

          "system"
        ],

        default: "announcement"
      },

      // ======================================================
      // PRIORITY
      // ======================================================

      priority: {

        type: String,

        enum: [

          "low",

          "medium",

          "high",

          "urgent"
        ],

        default: "medium"
      },

      // ======================================================
      // ICON
      // ======================================================

      icon: {

        type: String,

        default: "🔔"
      },

      // ======================================================
      // LINK
      // ======================================================

      link: {

        type: String,

        default: ""
      },

      // ======================================================
      // RELATED DATA
      // ======================================================

      relatedId: {

        type:
          mongoose.Schema.Types.ObjectId,

        default: null
      },

      relatedModel: {

        type: String,

        default: ""
      },

      // ======================================================
      // ACTION BUTTON
      // ======================================================

      actionText: {

        type: String,

        default: ""
      },

      // ======================================================
      // READ
      // ======================================================

      isRead: {

        type: Boolean,

        default: false
      },

      readAt: {

        type: Date,

        default: null
      },

      // ======================================================
      // ACKNOWLEDGED
      // ======================================================

      isAcknowledged: {

        type: Boolean,

        default: false
      },

      acknowledgedAt: {

        type: Date,

        default: null
      },

      // ======================================================
      // REALTIME
      // ======================================================

      isRealtime: {

        type: Boolean,

        default: true
      },

      // ======================================================
      // DELIVERY
      // ======================================================

      deliveryStatus: {

        type: String,

        enum: [

          "pending",

          "sent",

          "failed",

          "seen"
        ],

        default: "sent"
      },

      // ======================================================
      // DEVICE INFO
      // ======================================================

      deviceInfo: {

        type: String,

        default: ""
      },

      // ======================================================
      // ACTIVE
      // ======================================================

      isActive: {

        type: Boolean,

        default: true
      },

      isDeleted: {

        type: Boolean,

        default: false
      },

      deletedAt: {

        type: Date,

        default: null
      }
    },

    {

      timestamps: true
    }
  );

// ======================================================
// INDEXES
// ======================================================

notificationSchema.index({

  schoolId: 1
});

notificationSchema.index({

  userId: 1
});

notificationSchema.index({

  userRole: 1
});

notificationSchema.index({

  isRead: 1
});

notificationSchema.index({

  isAcknowledged: 1
});

notificationSchema.index({

  createdAt: -1
});

notificationSchema.index({

  type: 1
});

// ======================================================
// EXPORT
// ======================================================

module.exports =
  mongoose.model(

    "Notification",

    notificationSchema
  );