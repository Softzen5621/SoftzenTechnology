const mongoose =
  require("mongoose");

// ======================================================
// SCHEMA
// ======================================================

const homeworkQuestionSchema =
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
      // PARENT
      // ======================================================

      parentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Parent",

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
      // TEACHER
      // ======================================================

      teacherId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Teacher",

        required: true
      },

      // ======================================================
      // QUESTION
      // ======================================================

      question: {

        type: String,

        required: true,

        trim: true
      },

      // ======================================================
      // ANSWER
      // ======================================================

      answer: {

        type: String,

        default: ""
      },

      // ======================================================
      // FAQ SYSTEM
      // ======================================================

      isPublic: {

        type: Boolean,

        default: false
      },

      // ======================================================
      // UNIQUE DISPLAY ID
      // ======================================================

      publicQuestionId: {

        type: String,

        default: ""
      },

      // ======================================================
      // STATUS
      // ======================================================

      status: {

        type: String,

        enum: [

          "pending",

          "answered",

          "closed"
        ],

        default: "pending"
      },

      // ======================================================
      // TIMES
      // ======================================================

      askedAt: {

        type: Date,

        default: Date.now
      },

      answeredAt: {

        type: Date,

        default: null
      },

      // ======================================================
      // VISIBILITY
      // ======================================================

      viewedByTeacher: {

        type: Boolean,

        default: false
      },

      viewedByParent: {

        type: Boolean,

        default: true
      },

      // ======================================================
      // FLAGS
      // ======================================================

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
// AUTO FAQ ID
// ======================================================

homeworkQuestionSchema.pre(

  "save",

  async function () {

    try {

      // ======================================================
      // AUTO PUBLIC QUESTION ID
      // ======================================================

      if (

        !this.publicQuestionId

      ) {

        const count =
          await this.constructor.countDocuments();

        this.publicQuestionId =
          `FAQ-${1000 + count + 1}`;
      }

    } catch (error) {

      console.log(
        "HOMEWORK QUESTION PRE SAVE ERROR:"
      );

      console.log(error);

      throw error;
    }
  }
);

// ======================================================
// INDEXES
// ======================================================

homeworkQuestionSchema.index({

  schoolId: 1
});

homeworkQuestionSchema.index({

  homeworkId: 1
});

homeworkQuestionSchema.index({

  parentId: 1
});

homeworkQuestionSchema.index({

  teacherId: 1
});

homeworkQuestionSchema.index({

  studentId: 1
});

homeworkQuestionSchema.index({

  status: 1
});

homeworkQuestionSchema.index({

  createdAt: -1
});

// ======================================================
// EXPORT
// ======================================================

module.exports =
  mongoose.model(

    "HomeworkQuestion",

    homeworkQuestionSchema
  );