const mongoose =
require("mongoose");



const feeAssignmentSchema =
new mongoose.Schema(

  {

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

      ref:
        "StudentFeeProfile",

      required: true
    },



    // ======================
    // STRUCTURE
    // ======================

    feeStructureId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "FeeStructure",

      required: true
    },



    // ======================
    // FEE ITEM
    // ======================

    feeItemId: {

      type: String,

      required: true
    },



    // ======================
    // DETAILS
    // ======================

    feeTitle: {

      type: String,

      required: true
    },



    feeCode: {

      type: String,

      required: true
    },



    amount: {

      type: Number,

      required: true
    },



    pendingAmount: {

      type: Number,

      required: true
    },



    paidAmount: {

      type: Number,

      default: 0
    },



    discountAmount: {

      type: Number,

      default: 0
    },



    fineAmount: {

      type: Number,

      default: 0
    },



    // ======================
    // DUE
    // ======================

    dueDate: {

      type: Date,

      required: true
    },



    // ======================
    // STATUS
    // ======================

    status: {

      type: String,

      enum: [

        "PENDING",

        "PARTIAL",

        "PAID",

        "OVERDUE"
      ],

      default: "PENDING"
    },



    // ======================
    // PAYMENT
    // ======================

    paymentStatus: {

      type: String,

      enum: [

        "UNPAID",

        "PARTIAL",

        "PAID"
      ],

      default: "UNPAID"
    },



    // ======================
    // ACTIVE
    // ======================

    isActive: {

      type: Boolean,

      default: true
    }

  },

  {

    timestamps: true
  }
);



// ======================
// UNIQUE
// ======================

feeAssignmentSchema.index({

  schoolId: 1,

  studentId: 1,

  feeStructureId: 1,

  feeItemId: 1

}, {

  unique: true
});



module.exports =
mongoose.model(

  "FeeAssignment",

  feeAssignmentSchema
);