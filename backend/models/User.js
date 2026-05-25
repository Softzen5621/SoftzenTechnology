const mongoose =
  require("mongoose");

const userSchema =
  new mongoose.Schema(

    {

      // ======================
      // BASIC INFO
      // ======================

      name: {

        type: String,

        required: true,

        trim: true
      },

      email: {

        type: String,

        required: true,

        lowercase: true,

        trim: true
      },

      password: {

        type: String,

        required: true
      },

      // ======================
      // ROLE SYSTEM
      // ======================

      role: {

        type: String,

        enum: [

          "super_admin",

          "admin",

          "teacher",

          "student",

          "parent",

          "accountant",

          "hr"
        ],

        default: "admin"
      },

      // ======================
      // SCHOOL
      // ======================

      schoolId: {

        type: String,

        default: null,

        trim: true
      },

      // ======================
      // ACCOUNT STATUS
      // ======================

      status: {

        type: String,

        enum: [

          "active",

          "inactive",

          "suspended"
        ],

        default: "active"
      },

      isActive: {

        type: Boolean,

        default: true
      },

      isDeleted: {

        type: Boolean,

        default: false
      },

      // ======================
      // PASSWORD SECURITY
      // ======================

      mustChangePassword: {

        type: Boolean,

        default: true
      },

      passwordChangedAt: {

        type: Date,

        default: null
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
      // LOGIN SECURITY
      // ======================

      lastLogin: {

        type: Date,

        default: null
      },

      loginAttempts: {

        type: Number,

        default: 0
      },

      lockUntil: {

        type: Date,

        default: null
      },

      isTwoFactorEnabled: {

        type: Boolean,

        default: false
      },

      // ======================
      // PERMISSIONS
      // ======================

      permissions: {

        type: [String],

        default: []
      },

      // ======================
      // PROFILE
      // ======================

      phone: {

        type: String,

        default: ""
      },

      profileImage: {

        type: String,

        default: ""
      },

      designation: {

        type: String,

        default: ""
      },

      gender: {

        type: String,

        enum: [

          "",

          "male",

          "female",

          "other"
        ],

        default: ""
      },

      dateOfBirth: {

        type: Date,

        default: null
      },

      address: {

        type: String,

        default: ""
      },

      // ======================
      // ACTIVITY TRACKING
      // ======================

      lastActiveAt: {

        type: Date,

        default: null
      },

      // ======================
      // DEVICE SECURITY
      // ======================

      deviceInfo: {

        type: String,

        default: ""
      },

      ipAddress: {

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
      // SUPER ADMIN FLAGS
      // ======================

      createdBy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        default: null
      },

      // ======================
      // SOFT DELETE
      // ======================

      deletedAt: {

        type: Date,

        default: null
      }
    },

    {

      timestamps: true
    }
  );

// ======================
// INDEXES
// ======================

userSchema.index(

  {

    schoolId: 1,

    email: 1
  },

  {

    unique: true,

    partialFilterExpression: {

      isDeleted: false
    }
  }
);

userSchema.index({

  role: 1
});

userSchema.index({

  schoolId: 1
});

userSchema.index({

  status: 1
});

// ======================
// EXPORT
// ======================

module.exports =
  mongoose.model(

    "User",

    userSchema
  );