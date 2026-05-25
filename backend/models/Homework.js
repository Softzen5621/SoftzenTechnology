const mongoose =
  require("mongoose");

const homeworkSchema =
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
      // TEACHER
      // ======================================================

      teacherId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Teacher",

        required: true
      },

      // ======================================================
      // SUBJECT
      // ======================================================

      subjectId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Subject",

        required: true
      },

      // ======================================================
      // TARGET TYPE
      // ======================================================

      targetType: {

        type: String,

        enum: [

          "class",

          "section",

          "student"
        ],

        default: "section"
      },

      // ======================================================
      // SECTIONS
      // ======================================================

      sectionIds: [

        {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "Section"
        }
      ],

      // ======================================================
      // STUDENTS
      // ======================================================

      studentIds: [

        {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "Student"
        }
      ],

      // ======================================================
      // HOMEWORK DETAILS
      // ======================================================

      title: {

        type: String,

        required: true,

        trim: true
      },

      description: {

        type: String,

        required: true
      },

      instructions: {

        type: String,

        default: ""
      },

      // ======================================================
      // ATTACHMENTS
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
      // DATES
      // ======================================================

      assignedDate: {

        type: Date,

        default: Date.now
      },

      dueDate: {

        type: Date,

        required: true
      },

      scheduledPublishAt: {

        type: Date,

        default: null
      },

      // ======================================================
      // STATUS
      // ======================================================

      status: {

        type: String,

        enum: [

          "draft",

          "scheduled",

          "published",

          "completed",

          "archived"
        ],

        default: "published"
      },

      // ======================================================
      // PRIORITY
      // ======================================================

      priority: {

        type: String,

        enum: [

          "low",

          "medium",

          "high",

          "urgent"
        ],

        default: "medium"
      },

      // ======================================================
      // MARKS
      // ======================================================

      totalMarks: {

        type: Number,

        default: 0
      },

      // ======================================================
      // SETTINGS
      // ======================================================

      allowLateSubmission: {

        type: Boolean,

        default: true
      },

      allowFileSubmission: {

        type: Boolean,

        default: true
      },

      allowTextSubmission: {

        type: Boolean,

        default: true
      },

      // ======================================================
      // NOTIFICATIONS
      // ======================================================

      notifyParents: {

        type: Boolean,

        default: true
      },

      notifyStudents: {

        type: Boolean,

        default: true
      },

      // ======================================================
      // ANALYTICS
      // ======================================================

      totalSubmissions: {

        type: Number,

        default: 0
      },

      pendingSubmissions: {

        type: Number,

        default: 0
      },

      completedSubmissions: {

        type: Number,

        default: 0
      },

      // ======================================================
      // VIEW TRACKING
      // ======================================================

      viewedBy: [

        {

          parentId: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref: "Parent"
          },

          studentId: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref: "Student"
          },

          viewedAt: {

            type: Date,

            default: Date.now
          }
        }
      ],

      // ======================================================
      // ACKNOWLEDGE TRACKING
      // ======================================================

      acknowledgedBy: [

        {

          parentId: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref: "Parent"
          },

          studentId: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref: "Student"
          },

          acknowledgedAt: {

            type: Date,

            default: Date.now
          }
        }
      ],

      // ======================================================
// SUBMITTED BY
// ======================================================

submittedBy: [

  {

    parentId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User"
    },

    grade: {

  type: String,

  default:
    ""
},

remark: {

  type: String,

  default:
    ""
},

    studentId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Student"
    },

    submittedAt: {

      type: Date,

      default:
        Date.now
    }
  }
],

      // ======================================================
      // LIVE COUNTS
      // ======================================================

      totalViewed: {

        type: Number,

        default: 0
      },

      totalAcknowledged: {

        type: Number,

        default: 0
      },

      // ======================================================
      // VISIBILITY
      // ======================================================

      isActive: {

        type: Boolean,

        default: true
      },

      isDeleted: {

        type: Boolean,

        default: false
      },

      deletedAt: {

        type: Date,

        default: null
      }
    },

    {

      timestamps: true
    }
  );

// ======================================================
// INDEXES
// ======================================================

homeworkSchema.index({

  schoolId: 1
});

homeworkSchema.index({

  teacherId: 1
});

homeworkSchema.index({

  subjectId: 1
});

homeworkSchema.index({

  sectionIds: 1
});

homeworkSchema.index({

  studentIds: 1
});

homeworkSchema.index({

  dueDate: 1
});

homeworkSchema.index({

  status: 1
});

// ======================================================
// EXPORT
// ======================================================

module.exports =
  mongoose.model(

    "Homework",

    homeworkSchema
  );