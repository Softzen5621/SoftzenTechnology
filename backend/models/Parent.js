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

        trim: true,

        index: true
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

      fatherOccupation: {

        type: String,

        default: "",

        trim: true
      },

      motherOccupation: {

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
      // ADDRESS
      // ======================

      address: {

        type: String,

        default: ""
      },

      city: {

        type: String,

        default: ""
      },

      state: {

        type: String,

        default: ""
      },

      pincode: {

        type: String,

        default: ""
      },

      country: {

        type: String,

        default: "India"
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
      // PORTAL SETTINGS
      // ======================

      portalEnabled: {

        type: Boolean,

        default: true
      },

      mustChangePassword: {

        type: Boolean,

        default: true
      },

      lastLogin: {

        type: Date,

        default: null
      },

      // ======================
      // PASSWORD RESET
      // ======================

      resetOtp: {

        type: String,

        default: ""
      },

      otpExpiry: {

        type: Date,

        default: null
      },

      // ======================
      // ACCOUNT LOCK
      // ======================

      accountLocked: {

        type: Boolean,

        default: false
      },

      accountLockedReason: {

        type: String,

        default: ""
      },

      // ======================
      // STATUS
      // ======================

      status: {

        type: String,

        enum: [

          "active",

          "inactive",

          "blocked",

          "archived"
        ],

        default: "active",

        index: true
      }
    },

    {

      timestamps: true
    }
  );

// ======================
// INDEXES
// ======================

parentSchema.index(

  {

    schoolId: 1,

    email: 1
  },

  {

    unique: true
  }
);

parentSchema.index({

  schoolId: 1,

  mobile: 1
});

parentSchema.index({

  schoolId: 1,

  status: 1
});

// ======================
// EXPORT
// ======================

module.exports =
  mongoose.model(

    "Parent",

    parentSchema
  );