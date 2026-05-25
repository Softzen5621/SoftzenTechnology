const mongoose =
  require("mongoose");

// ======================================================
// HOLIDAY SCHEMA
// ======================================================

const holidaySchema =
  new mongoose.Schema(

    {

      // ==================================================
      // SCHOOL
      // ==================================================

      schoolId: {

        type: String,

        required: true,

        trim: true
      },

      // ==================================================
      // HOLIDAY TITLE
      // ==================================================

      title: {

        type: String,

        required: true,

        trim: true
      },

      // ==================================================
      // HOLIDAY TYPE
      // ==================================================

      holidayType: {

        type: String,

        enum: [

          "National",

          "Festival",

          "School",

          "Vacation",

          "Emergency"
        ],

        default:
          "School"
      },

      // ==================================================
      // START DATE
      // ==================================================

      startDate: {

        type: Date,

        required: true
      },

      // ==================================================
      // END DATE
      // ==================================================

      endDate: {

        type: Date,

        required: true
      },

      // ==================================================
      // DESCRIPTION
      // ==================================================

      description: {

        type: String,

        default: ""
      },

      // ==================================================
      // ACTIVE
      // ==================================================

      isActive: {

        type: Boolean,

        default: true
      }

    },

    {

      timestamps: true
    }
  );

// ======================================================
// EXPORT
// ======================================================

module.exports =
  mongoose.model(

    "Holiday",

    holidaySchema
  );