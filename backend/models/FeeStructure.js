const mongoose =
  require("mongoose");

const feeStructureSchema =
  new mongoose.Schema(

    {
      schoolId: {

        type: String,

        required: true,

        trim: true
      },

      academicYear: {

        type: String,

        required: true,

        trim: true
      },

      className: {

        type: String,

        required: true,

        trim: true
      },

      feeType: {

        type: String,

        required: true,

        trim: true
      },

      amount: {

        type: Number,

        required: true,

        min: 0
      },

      frequency: {

        type: String,

        required: true,

        enum: [

          "Monthly",

          "Quarterly",

          "Yearly",

          "One Time"
        ]
      },

      dueDate: {

        type: String,

        required: true
      },

      isActive: {

        type: Boolean,

        default: true
      }
    },

    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(

    "FeeStructure",

    feeStructureSchema
  );