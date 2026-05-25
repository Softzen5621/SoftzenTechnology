const mongoose =
  require("mongoose");

// ======================================================
// ATTENDANCE SCHEMA
// ======================================================

const attendanceSchema =
  new mongoose.Schema(

    {

      // ==================================================
      // MULTI TENANT
      // ==================================================

      schoolId: {

        type: String,

        required: true,

        trim: true
      },

      // ==================================================
      // STUDENT
      // ==================================================

      studentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "Student",

        required: true
      },

      // ==================================================
      // CLASS INFO
      // ==================================================

      classId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "Section",

        required: true
      },

      className: {

        type: String,

        default: ""
      },

      section: {

        type: String,

        default: ""
      },

      // ==================================================
      // TEACHER
      // ==================================================

      teacherId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "Teacher",

        required: true
      },

      // ==================================================
      // DATE
      // ==================================================

      attendanceDate: {

        type: Date,

        required: true
      },

      // ==================================================
      // STATUS
      // ==================================================

      status: {

        type: String,

        enum: [

          "Present",

          "Absent",

          "Late",

          "Half Day"
        ],

        default:
          "Present"
      },

      // ==================================================
      // OPTIONAL REASON
      // ==================================================

      absentReason: {

        type: String,

        default: ""
      },

      // ==================================================
      // REMARKS
      // ==================================================

      remarks: {

        type: String,

        default: ""
      },

      // ==================================================
      // UPDATE TRACKING
      // ==================================================

      isUpdated: {

        type: Boolean,

        default: false
      },

      updatedCount: {

        type: Number,

        default: 0
      },

      lastUpdatedBy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "Teacher",

        default: null
      },

      lastUpdatedAt: {

        type: Date,

        default: null
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
// UNIQUE DAILY ATTENDANCE
// ======================================================

attendanceSchema.index({

  schoolId: 1,

  studentId: 1,

  attendanceDate: 1

}, {

  unique: true
});

// ======================================================
// FAST SEARCH INDEX
// ======================================================

attendanceSchema.index({

  schoolId: 1,

  classId: 1,

  attendanceDate: 1
});

// ======================================================
// STUDENT HISTORY INDEX
// ======================================================

attendanceSchema.index({

  schoolId: 1,

  studentId: 1
});

// ======================================================
// EXPORT
// ======================================================

module.exports =
  mongoose.model(

    "Attendance",

    attendanceSchema
  );