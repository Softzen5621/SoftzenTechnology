const mongoose =
  require("mongoose");

const parentSchema =
  new mongoose.Schema(

    {

      // ======================
      // SCHOOL
      // ======================

      schoolId: {

        type: String,

        required: true,

        trim: true
      },

      // ======================
      // PARENT INFO
      // ======================

      fatherName: {

        type: String,

        required: true,

        trim: true
      },

      motherName: {

        type: String,

        default: "",

        trim: true
      },

      email: {

        type: String,

        required: true,

        lowercase: true,

        trim: true
      },

      mobile: {

        type: String,

        required: true,

        trim: true
      },

      password: {

        type: String,

        required: true,

        select: false
      },

      // ======================
      // CHILDREN
      // ======================

      children: [

        {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "Student"
        }
      ],

      // ======================
      // PASSWORD SECURITY
      // ======================

      mustChangePassword: {

        type: Boolean,

        default: true
      },

      resetOtp: {

        type: String,

        default: ""
      },

      otpExpiry: {

        type: Date,

        default: null
      },

      // ======================
      // ACCOUNT STATUS
      // ======================

      status: {

        type: String,

        enum: [

          "active",

          "inactive"
        ],

        default: "active"
      }
    },

    {

      timestamps: true
    }
  );

// ======================
// INDEXES
// ======================

parentSchema.index({

  schoolId: 1,

  email: 1

},

{

  unique: true
});

// ======================
// EXPORT
// ======================

module.exports =
  mongoose.model(

    "Parent",

    parentSchema
  );