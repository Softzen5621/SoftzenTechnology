const mongoose =
  require("mongoose");

// ======================================================
// STUDENT SCHEMA
// ======================================================

const studentSchema =
  new mongoose.Schema(

    {

      // ======================================================
      // SCHOOL
      // ======================================================

      schoolId: {

        type: String,

        required: true,

        trim: true,

        index: true
      },

      // ======================================================
      // AUTO STUDENT ID
      // ======================================================

      studentId: {

        type: String,

        required: true,

        trim: true,

        uppercase: true
      },

      // ======================================================
      // BASIC DETAILS
      // ======================================================

      firstName: {

        type: String,

        trim: true,

        default: ""
      },

      lastName: {

        type: String,

        trim: true,

        default: ""
      },

      name: {

        type: String,

        required: true,

        trim: true
      },

      gender: {

        type: String,

        enum: [

          "Male",

          "Female",

          "Other"
        ],

        required: true,

        default: "Male"
      },

      dob: {

        type: String,

        trim: true,

        required: true
      },

      age: {

        type: Number,

        default: 0
      },

      // ======================================================
      // ACADEMIC DETAILS
      // ======================================================

      rollNumber: {

        type: String,

        trim: true,

        default: ""
      },

      admissionDate: {

        type: String,

        trim: true,

        default: ""
      },

      admissionStatus: {

        type: String,

        enum: [

          "Active",

          "Inactive",

          "Pending"
        ],

        default: "Active"
      },

      sectionId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Section",

        required: true
      },

      // ======================================================
      // PARENT LINK
      // ======================================================

      parentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Parent",

        default: null
      },

      // ======================================================
      // CONTACT DETAILS
      // ======================================================

      mobile: {

        type: String,

        trim: true,

        default: ""
      },

      email: {

        type: String,

        trim: true,

        lowercase: true,

        default: ""
      },

      emergencyContact: {

        type: String,

        trim: true,

        default: ""
      },

      // ======================================================
      // PARENT DETAILS
      // ======================================================

      fatherName: {

        type: String,

        trim: true,

        default: ""
      },

      motherName: {

        type: String,

        trim: true,

        default: ""
      },

      parentOccupation: {

        type: String,

        trim: true,

        default: ""
      },

      parentMobile: {

        type: String,

        trim: true,

        default: ""
      },

      parentEmail: {

        type: String,

        trim: true,

        lowercase: true,

        default: ""
      },

      // ======================================================
      // ADDRESS
      // ======================================================

      address: {

        type: String,

        default: ""
      },

      city: {

        type: String,

        trim: true,

        default: ""
      },

      state: {

        type: String,

        trim: true,

        default: ""
      },

      pincode: {

        type: String,

        trim: true,

        default: ""
      },

      // ======================================================
      // PERSONAL DETAILS
      // ======================================================

      bloodGroup: {

        type: String,

        trim: true,

        default: ""
      },

      religion: {

        type: String,

        trim: true,

        default: ""
      },

      category: {

        type: String,

        trim: true,

        default: ""
      },

      aadhaarNumber: {

        type: String,

        trim: true,

        default: ""
      },

      nationality: {

        type: String,

        trim: true,

        default: "Indian"
      },

      // ======================================================
      // MEDICAL
      // ======================================================

      medicalConditions: {

        type: String,

        default: ""
      },

      allergies: {

        type: String,

        default: ""
      },

      // ======================================================
      // TRANSPORT
      // ======================================================

      transportRequired: {

        type: Boolean,

        default: false
      },

      pickupPoint: {

        type: String,

        default: ""
      },

      // ======================================================
      // HOSTEL
      // ======================================================

      hostelRequired: {

        type: Boolean,

        default: false
      },

      hostelRoom: {

        type: String,

        default: ""
      },

      // ======================================================
      // LOGIN / PORTAL
      // ======================================================

      portalEnabled: {

        type: Boolean,

        default: false
      },

      lastLogin: {

        type: Date,

        default: null
      },

      // ======================================================
      // MEDIA
      // ======================================================

      photo: {

        type: String,

        default: ""
      },

      aadhaarPhoto: {

        type: String,

        default: ""
      },

      documents: {

        type: [String],

        default: []
      },

      // ======================================================
      // STATUS FLAGS
      // ======================================================

      isActive: {

        type: Boolean,

        default: true
      },

      isDeleted: {

        type: Boolean,

        default: false
      },

      // ======================================================
      // NOTES
      // ======================================================

      notes: {

        type: String,

        default: ""
      }
    },

    {

      timestamps: true
    }
  );

// ======================================================
// INDEXES
// ======================================================

studentSchema.index(

  {

    schoolId: 1,

    studentId: 1
  },

  {

    unique: true
  }
);

studentSchema.index({

  schoolId: 1,

  sectionId: 1
});

studentSchema.index({

  schoolId: 1,

  parentEmail: 1
});

studentSchema.index({

  schoolId: 1,

  mobile: 1
});

studentSchema.index({

  schoolId: 1,

  admissionStatus: 1
});

// ======================================================
// PRE SAVE CLEANUP
// ======================================================

studentSchema.pre(

  "save",

  function () {

    // AUTO FULL NAME

    if (

      !this.name &&

      this.firstName
    ) {

      this.name =

        `${this.firstName} ${this.lastName || ""}`

          .trim();
    }

    // CLEAN NAMES

    this.name =
      this.name?.trim() || "";

    this.firstName =
      this.firstName?.trim() || "";

    this.lastName =
      this.lastName?.trim() || "";

    // CLEAN EMAILS

    this.email =
      this.email
        ?.trim()
        .toLowerCase() || "";

    this.parentEmail =
      this.parentEmail
        ?.trim()
        .toLowerCase() || "";

    // CLEAN MOBILES

    this.mobile =
      this.mobile?.trim() || "";

    this.parentMobile =
      this.parentMobile?.trim() || "";

    // CLEAN STUDENT ID

    this.studentId =
      this.studentId
        ?.trim()
        .toUpperCase() || "";
  }
);

// ======================================================
// REMOVE INTERNAL FIELDS
// ======================================================

studentSchema.methods.toJSON =
  function () {

    const obj =
      this.toObject();

    delete obj.__v;

    return obj;
  };

// ======================================================
// EXPORT
// ======================================================

module.exports =
  mongoose.model(

    "Student",

    studentSchema
  );