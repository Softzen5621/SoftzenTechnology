const mongoose =
  require("mongoose");

const homeworkSubmissionSchema =
  new mongoose.Schema(

    {

      // ======================================================
      // SCHOOL
      // ======================================================

      schoolId: {

        type: String,

        required: true,

        trim: true
      },

      // ======================================================
      // HOMEWORK
      // ======================================================

      homeworkId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Homework",

        required: true
      },

      // ======================================================
      // STUDENT
      // ======================================================

      studentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Student",

        required: true
      },

      // ======================================================
      // SUBMISSION
      // ======================================================

      submissionText: {

        type: String,

        default: ""
      },

      // ======================================================
      // FILES
      // ======================================================

      attachments: [

        {

          fileName: {

            type: String,

            default: ""
          },

          fileUrl: {

            type: String,

            default: ""
          },

          fileType: {

            type: String,

            default: ""
          },

          uploadedAt: {

            type: Date,

            default: Date.now
          }
        }
      ],

      // ======================================================
      // STATUS
      // ======================================================

      status: {

        type: String,

        enum: [

          "pending",

          "submitted",

          "late",

          "reviewed",

          "rejected"
        ],

        default: "submitted"
      },

      // ======================================================
      // MARKS
      // ======================================================

      marksObtained: {

        type: Number,

        default: 0
      },

      // ======================================================
      // TEACHER REVIEW
      // ======================================================

      teacherRemarks: {

        type: String,

        default: ""
      },

      reviewedBy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Teacher",

        default: null
      },

      reviewedAt: {

        type: Date,

        default: null
      },

      // ======================================================
      // SUBMISSION TIME
      // ======================================================

      submittedAt: {

        type: Date,

        default: Date.now
      },

      // ======================================================
      // FLAGS
      // ======================================================

      isLateSubmission: {

        type: Boolean,

        default: false
      },

      isActive: {

        type: Boolean,

        default: true
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

// ======================================================
// INDEXES
// ======================================================

homeworkSubmissionSchema.index({

  schoolId: 1
});

homeworkSubmissionSchema.index({

  homeworkId: 1
});

homeworkSubmissionSchema.index({

  studentId: 1
});

homeworkSubmissionSchema.index({

  status: 1
});

// ======================================================
// UNIQUE SUBMISSION
// ONE STUDENT = ONE SUBMISSION
// ======================================================

homeworkSubmissionSchema.index(

  {

    homeworkId: 1,

    studentId: 1
  },

  {

    unique: true
  }
);

// ======================================================
// EXPORT
// ======================================================

module.exports =
  mongoose.model(

    "HomeworkSubmission",

    homeworkSubmissionSchema
  );