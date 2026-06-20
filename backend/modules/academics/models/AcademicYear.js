const mongoose =
require("mongoose");

const academicYearSchema =
new mongoose.Schema(

  {
schoolId: {

  type: String,

  required: true,

  trim: true,

  index: true
},



    name: {

      type: String,

      required: true,

      trim: true
    },



    code: {

      type: String,

      required: true,

      trim: true
    },



    startDate: {

      type: Date,

      required: true
    },



    endDate: {

      type: Date,

      required: true
    },



    isActive: {

      type: Boolean,

      default: false,

      index: true
    },



    status: {

      type: String,

      enum: [

        "ACTIVE",

        "ARCHIVED"
      ],

      default:
        "ACTIVE"
    },



    createdBy: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref:
        "User"
    },



    isDeleted: {

      type: Boolean,

      default: false
    }

  },

  {

    timestamps: true
  }
);



// ======================
// INDEXES
// ======================

academicYearSchema.index({

  schoolId: 1,

  name: 1
});



// ======================
// EXPORT
// ======================

module.exports =
mongoose.model(

  "AcademicYear",

  academicYearSchema
);