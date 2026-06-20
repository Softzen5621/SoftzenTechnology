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

     admissionNumber: {
  type: String,
  required: true,
  trim: true,
  uppercase: true,
  
},

academicYear: {
  type: String,
  default: ""
},

previousBoard: {
  type: String,
  default: ""
},

fatherAadhaar: {
  type: String,
  default: ""
},

motherAadhaar: {
  type: String,
  default: ""
},

guardianOccupation: {
  type: String,
  default: ""
},


medium: {
  type: String,
  default: "English"
},

subjectsStudied: {
  type: [String],
  default: []
},

leavingDate: {
  type: String,
  default: ""
},

guardianAddress: {
  type: String,
  default: ""
},

currentAddress: {
  type: String,
  default: ""
},

permanentAddress: {
  type: String,
  default: ""
},

sameAsCurrentAddress: {
  type: Boolean,
  default: true
},

doctorName: {
  type: String,
  default: ""
},

doctorContact: {
  type: String,
  default: ""
},

nearbyHospital: {
  type: String,
  default: ""
},

feeCategory: {
  type: String,
  default: ""
},

scholarship: {
  type: String,
  default: ""
},

discount: {
  type: Number,
  default: 0
},

      // ======================================================
      // FAMILY / SIBLING SYSTEM
      // ======================================================

      familyId: {

        type: String,

        trim: true,

        default: "",

        index: true
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

      caste: {

  type: String,

  trim: true,

  default: ""
},

      nationality: {

        type: String,

        trim: true,

        default: "Indian"
      },

      previousSchool: {

        type: String,

        trim: true,

        default: ""
      },

      motherTongue: {

        type: String,

        trim: true,

        default: ""
      },

      penNumber: {

        type: String,

        trim: true,

        default: ""
      },

      emisNumber: {

        type: String,

        trim: true,

        default: ""
      },

      // ======================================================
      // CURRENT ACADEMIC STATE
      // ======================================================

      currentAcademicYearId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "AcademicYear",

        default: null,

        index: true
      },

      currentAcademicYear: {

        type: String,

        trim: true,

        default: ""
      },

      currentClassName: {

        type: String,

        trim: true,

        default: "",

        index: true
      },

      currentSection: {

        type: String,

        trim: true,

        default: ""
      },

      currentRollNumber: {

        type: String,

        trim: true,

        default: ""
      },

      // ======================================================
      // OLD COMPATIBILITY FIELDS
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

      sectionId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Section",

        required: true
      },

      // ======================================================
      // ACADEMIC META
      // ======================================================

      boardType: {

        type: String,

        trim: true,

        default: ""
      },

      stream: {

        type: String,

        trim: true,

        default: ""
      },

      house: {

        type: String,

        trim: true,

        default: ""
      },

      // ======================================================
      // STUDENT STATUS
      // ======================================================

      studentStatus: {

        type: String,

        enum: [

          "ACTIVE",

          "INACTIVE",

          "LEFT",

          "PASSED_OUT",

          "ALUMNI",

          "SUSPENDED",

          "TC",

          "REJOINED"
        ],

        default:
          "ACTIVE",

        index: true
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

      emergencyContactName: {

  type: String,

  trim: true,

  default: ""
},

emergencyContactNumber: {

  type: String,

  trim: true,

  default: ""
},

emergencyRelation: {

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

      fatherOccupation: {

        type: String,

        trim: true,

        default: ""
      },

      fatherQualification: {

        type: String,

        trim: true,

        default: ""
      },

      motherName: {

        type: String,

        trim: true,

        default: ""
      },

      motherOccupation: {

        type: String,

        trim: true,

        default: ""
      },

      motherQualification: {

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

      alternateMobile: {

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

      fatherEmail: {
  type: String,
  trim: true,
  lowercase: true,
  default: ""
},

motherMobile: {
  type: String,
  trim: true,
  default: ""
},

annualIncome: {
  type: Number,
  default: 0
},

guardianName: {
  type: String,
  trim: true,
  default: ""
},

guardianRelation: {
  type: String,
  trim: true,
  default: ""
},

guardianMobile: {
  type: String,
  trim: true,
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

      district: {

  type: String,

  trim: true,

  default: ""
},

      pincode: {

        type: String,

        trim: true,

        default: ""
      },

      country: {

        type: String,

        trim: true,

        default: "India"
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

      disability: {

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
      // MARKETING / CRM
      // ======================================================

      leadSource: {

        type: String,

        default: ""
      },

      scholarshipType: {

        type: String,

        default: ""
      },

      concessionType: {

        type: String,

        default: ""
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
      // ACADEMIC HISTORY
      // ======================================================

      academicHistory: [

        {

          academicYearId: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref:
              "AcademicYear"
          },

          academicYear: {

            type: String,

            default: ""
          },

          className: {

            type: String,

            default: ""
          },

          section: {

            type: String,

            default: ""
          },

          rollNumber: {

            type: String,

            default: ""
          },

          joinedDate: {

            type: Date,

            default: null
          },

          resultStatus: {

            type: String,

            enum: [

              "PROMOTED",

              "PASSED",

              "FAILED",

              "DETAINED",

              "LEFT",

              "TC"
            ],

            default:
              "PASSED"
          },

          promotedTo: {

            type: String,

            default: ""
          },

          promotedDate: {

            type: Date,

            default: null
          },

          attendancePercentage: {

            type: Number,

            default: 0
          },

          finalPercentage: {

            type: Number,

            default: 0
          },

          remarks: {

            type: String,

            default: ""
          }
        }
      ],

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

  familyId: 1
});

studentSchema.index({

  schoolId: 1,

  currentAcademicYear: 1
});

studentSchema.index({

  schoolId: 1,

  currentClassName: 1
});

studentSchema.index({

  schoolId: 1,

  studentStatus: 1
});

studentSchema.index(
  {
    schoolId: 1,
    admissionNumber: 1
  },
  {
    unique: true
  }
);

studentSchema.index({

  schoolId: 1,

  createdAt: -1

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