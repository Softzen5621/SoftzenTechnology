const mongoose = require("mongoose");

const noticeSchema =
  new mongoose.Schema(

    {
      // =====================================
      // TITLE
      // =====================================

      title: {

        type: String,

        required: true,

        trim: true,

        maxlength: 200,
      },

      // =====================================
      // DESCRIPTION
      // =====================================

      description: {

        type: String,

        required: true,

        trim: true,
      },

      // =====================================
      // TARGET AUDIENCE
      // =====================================

      audience: [

        {
          type: String,

          enum: [

            "teacher",

            "parent",

            "student",

            "all",
          ],
        },
      ],

      // =====================================
      // OPTIONAL CLASS TARGETING
      // =====================================

      classIds: [

        {
          type:
            mongoose.Schema.Types
              .ObjectId,

          ref: "Section",
        },
      ],

      // =====================================
      // NOTICE TYPE
      // =====================================

      type: {

        type: String,

        enum: [

          "mandatory",

          "locked",
        ],

        default: "mandatory",
      },

      // =====================================
      // PRIORITY
      // =====================================

      priority: {

        type: String,

        enum: [

          "normal",

          "important",

          "urgent",
        ],

        default: "normal",
      },

      // =====================================
      // ATTACHMENT
      // =====================================

      attachment: {

        type: String,

        default: "",
      },

      // =====================================
      // POPUP
      // =====================================

      popup: {

        type: Boolean,

        default: false,
      },

      // =====================================
      // EXPIRY DATE
      // =====================================

      expiryDate: {

        type: Date,

        default: null,
      },

      // =====================================
      // CREATED BY
      // =====================================

      createdBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      // =====================================
      // VIEWED USERS
      // =====================================

      viewedBy: [

        {

          userId: {

            type:
              mongoose.Schema.Types
                .ObjectId,

            ref: "User",
          },

          role: {

            type: String,
          },

          viewedAt: {

            type: Date,

            default:
              Date.now,
          },
        },
      ],

      // =====================================
      // ACKNOWLEDGED USERS
      // =====================================

      acknowledgedBy: [

        {

          userId: {

            type:
              mongoose.Schema.Types
                .ObjectId,

            ref: "User",
          },

          role: {

            type: String,
          },

          acknowledgedAt: {

            type: Date,

            default:
              Date.now,
          },
        },
      ],

      // =====================================
      // ACTIVE STATUS
      // =====================================

      isActive: {

        type: Boolean,

        default: true,
      },
    },

    {
      timestamps: true,
    }
  );


// =========================================
// AUTO EXPIRE CHECK
// =========================================

noticeSchema.methods.isExpired =
  function () {

    if (!this.expiryDate)
      return false;

    return (
      new Date() >
      this.expiryDate
    );
  };


// =========================================
// MODEL
// =========================================

module.exports =
  mongoose.model(
    "Notice",
    noticeSchema
  );