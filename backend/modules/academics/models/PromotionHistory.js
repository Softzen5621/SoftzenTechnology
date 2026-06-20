const mongoose =
require("mongoose");

const promotionHistorySchema =
new mongoose.Schema(

  {

    schoolId: {

      type: String,

      required: true,

      index: true
    },

    studentId: {

      type:
      mongoose.Schema.Types.ObjectId,

      ref: "Student",

      required: true
    },

    fromAcademicYear: {

      type: String,

      required: true
    },

    toAcademicYear: {

      type: String,

      required: true
    },

    fromClass: {

      type: String,

      required: true
    },

    toClass: {

      type: String,

      required: true
    },

    fromSection: {

      type: String,

      default: ""
    },

    toSection: {

      type: String,

      default: ""
    },

    resultStatus: {

      type: String,

      enum: [

        "PROMOTED",

        "FAILED",

        "DETAINED"
      ],

      default:
      "PROMOTED"
    },

    promotedBy: {

      type:
      mongoose.Schema.Types.ObjectId,

      ref: "User"
    }

  },

  {

    timestamps: true
  }
);

module.exports =
mongoose.model(

  "PromotionHistory",

  promotionHistorySchema
);