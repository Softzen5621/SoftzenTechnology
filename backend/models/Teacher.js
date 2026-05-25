const mongoose =
  require("mongoose");

// ======================================================
// CLASS ASSIGNMENT SCHEMA
// ======================================================

const classAssignmentSchema =
  new mongoose.Schema(

    {

      classId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Section",

        default: null,
      },

      className: {

        type: String,

        required: true,

        trim: true,
      },

      section: {

        type: String,

        default: "",

        trim: true,
      },

      displayName: {

        type: String,

        default: "",
      },

      isClassTeacher: {

        type: Boolean,

        default: false,
      },

      assignedAt: {

        type: Date,

        default: Date.now,
      },

      status: {

        type: String,

        enum: [

          "Active",

          "Inactive",
        ],

        default: "Active",
      },

    },

    {

      _id: true,
    }
  );

// ======================================================
// DOCUMENT SCHEMA
// ======================================================

const documentSchema =
  new mongoose.Schema(

    {

      name: {

        type: String,

        default: "",
      },

      fileUrl: {

        type: String,

        default: "",
      },

      uploadedAt: {

        type: Date,

        default: Date.now,
      },

    },

    {

      _id: true,
    }
  );

// ======================================================
// CLASS TEACHER SCHEMA
// ======================================================

const classTeacherSchema =
  new mongoose.Schema(

    {

      classId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Section",

        default: null,
      },

      className: {

        type: String,

        default: "",
      },

      section: {

        type: String,

        default: "",
      },

      displayName: {

        type: String,

        default: "",
      },

    },

    {

      _id: false,
    }
  );

// ======================================================
// TEACHER SCHEMA
// ======================================================

const teacherSchema =
  new mongoose.Schema(

    {

      // ======================================================
      // SCHOOL
      // ======================================================

      schoolId: {

        type: String,

        required: true,

        trim: true,

        index: true,
      },

      // ======================================================
      // AUTH
      // ======================================================

      employeeId: {

        type: String,

        required: true,

        trim: true,

        uppercase: true,
      },

      role: {

        type: String,

        default: "teacher",

        enum: [
          "teacher"
        ],
      },

      password: {

        type: String,

        required: true,

        select: false,
      },

      mustChangePassword: {

        type: Boolean,

        default: true,
      },

      lastLogin: {

        type: Date,
      },
      resetOtp: {

  type: String,

  default: ""
},

otpExpiry: {

  type: Date,

  default: null
},

      // ======================================================
      // PERSONAL DETAILS
      // ======================================================

      fullName: {

        type: String,

        required: true,

        trim: true,
      },

      email: {

        type: String,

        trim: true,

        lowercase: true,

        default: "",
      },

      phone: {

        type: String,

        required: true,

        trim: true,
      },

      profileImage: {

        type: String,

        default: "",
      },

      gender: {

        type: String,

        enum: [

          "Male",

          "Female",

          "Other",
        ],

        default: "Male",
      },

      dob: {

        type: Date,
      },

      address: {

        type: String,

        default: "",

        trim: true,
      },

      emergencyContact: {

        type: String,

        default: "",

        trim: true,
      },

      // ======================================================
      // PROFESSIONAL DETAILS
      // ======================================================

      joiningDate: {

        type: Date,

        required: true,
      },

      qualification: {

        type: String,

        default: "",

        trim: true,
      },

      experience: {

        type: String,

        default: "",

        trim: true,
      },

      salary: {

        type: Number,

        default: 0,
      },

      department: {

        type: String,

        enum: [

          "Academic",

          "Sports",

          "Arts",

          "Computer",
        ],

        default: "Academic",
      },

      teacherType: {

        type: String,

        enum: [

          "Full Time",

          "Part Time",

          "Guest Faculty",
        ],

        default: "Full Time",
      },

      designation: {

        type: String,

        default: "Teacher",
      },

      specialization: {

        type: String,

        default: "",
      },

      status: {

        type: String,

        enum: [

          "Active",

          "Inactive",

          "On Leave",

          "Suspended",
        ],

        default: "Active",
      },

      isActive: {

        type: Boolean,

        default: true,
      },

      isArchived: {

        type: Boolean,

        default: false,
      },

      // ======================================================
      // SUBJECT ASSIGNMENTS
      // ======================================================

      assignedSubjects: [

        {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "Subject",
        },
      ],

      // ======================================================
      // CLASS ASSIGNMENTS
      // ======================================================

      assignedClasses: [

        classAssignmentSchema,
      ],

      // ======================================================
      // CLASS TEACHER
      // ======================================================

      classTeacherOf:

        classTeacherSchema,

      // ======================================================
      // WORKLOAD
      // ======================================================

      weeklyLectureLoad: {

        type: Number,

        default: 0,
      },

      // ======================================================
      // PAYROLL
      // ======================================================

      bankName: {

        type: String,

        default: "",
      },

      accountNumber: {

        type: String,

        default: "",
      },

      ifscCode: {

        type: String,

        default: "",
      },

      // ======================================================
      // DOCUMENTS
      // ======================================================

      documents: [

        documentSchema,
      ],

      // ======================================================
      // NOTES
      // ======================================================

      notes: {

        type: String,

        default: "",
      },

    },

    {

      timestamps: true,
    }
  );

// ======================================================
// PRE SAVE
// ======================================================

teacherSchema.pre(

  "save",

  function () {

    // ==============================================
    // CLASS TEACHER DISPLAY
    // ==============================================

    if (

      this.classTeacherOf &&

      this.classTeacherOf.className

    ) {

      this.classTeacherOf.displayName =

        this.classTeacherOf.section

          ? `${this.classTeacherOf.className} - ${this.classTeacherOf.section}`

          : this.classTeacherOf.className;
    }

    // ==============================================
    // ASSIGNED CLASSES DISPLAY
    // ==============================================

    if (

      Array.isArray(
        this.assignedClasses
      )

    ) {

      this.assignedClasses =

        this.assignedClasses.map(
          (item) => ({

            classId:
              item.classId || null,

            className:
              item.className || "",

            section:
              item.section || "",

            displayName:

              item.section

                ? `${item.className} - ${item.section}`

                : item.className,

            isClassTeacher:
              item.isClassTeacher || false,

            assignedAt:
              item.assignedAt || new Date(),

            status:
              item.status || "Active"
          })
        );
    }

    // ==============================================
    // SAFE VALUES
    // ==============================================

    this.salary =
      Number(this.salary) || 0;

    this.fullName =
      this.fullName?.trim() || "";

    this.email =
      this.email?.trim().toLowerCase() || "";

    this.phone =
      this.phone?.trim() || "";

    this.employeeId =
      this.employeeId?.trim().toUpperCase() || "";
  }
);
// ======================================================
// REMOVE PASSWORD FROM RESPONSE
// ======================================================

teacherSchema.methods.toJSON =
  function () {

    const obj =
      this.toObject();

    delete obj.password;

    return obj;
  };

// ======================================================
// INDEXES
// ======================================================

teacherSchema.index(

  {

    schoolId: 1,

    employeeId: 1,
  },

  {

    unique: true,
  }
);

teacherSchema.index({

  schoolId: 1,

  email: 1,
});

teacherSchema.index({

  schoolId: 1,

  status: 1,
});

teacherSchema.index({

  schoolId: 1,

  department: 1,
});

teacherSchema.index({

  schoolId: 1,

  fullName: 1,
});

teacherSchema.index({

  schoolId: 1,

  phone: 1,
});

// ======================================================
// EXPORT
// ======================================================

module.exports =

  mongoose.model(

    "Teacher",

    teacherSchema
  );