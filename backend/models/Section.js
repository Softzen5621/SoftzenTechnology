const mongoose =
  require("mongoose");


// ======================================================
// SUBJECT ASSIGNMENT SCHEMA
// ======================================================

const subjectAssignmentSchema =
  new mongoose.Schema(

    {

      // SUBJECT

      subjectId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Subject",

        required: true,
      },


      // TEACHER

      teacherId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Teacher",

        default: null,
      },


      // WEEKLY LECTURES

      weeklyLectures: {

        type: Number,

        default: 0,

        min: 0,
      },


      // ROOM

      room: {

        type: String,

        default: "",
      },


      // NOTES

      notes: {

        type: String,

        default: "",
      },


      // ACTIVE

      isActive: {

        type: Boolean,

        default: true,
      },

    },

    {

      _id: true,

      timestamps: true,
    }
  );


// ======================================================
// SECTION / CLASS SCHEMA
// ======================================================

const sectionSchema =
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
      // CLASS NAME
      // ======================================================

      className: {

        type: String,

        required: true,

        trim: true,
      },

      promotionOrder: {

  type: Number,

  default: 0
},

      // ======================================================
      // OPTIONAL SECTION
      // ======================================================

      sectionName: {

        type: String,

        default: "",

        trim: true,
      },


      // ======================================================
      // DISPLAY NAME
      // ======================================================

      displayName: {

        type: String,

        required: true,

        trim: true,

        index: true,
      },


      // ======================================================
      // CLASS TEACHER
      // ======================================================

      classTeacher: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Teacher",

        default: null,
      },


      // ======================================================
      // SUBJECT ASSIGNMENTS
      // ======================================================

      subjects: [

        subjectAssignmentSchema
      ],


      // ======================================================
      // ROOM NUMBER
      // ======================================================

      roomNumber: {

        type: String,

        default: "",
      },


      // ======================================================
      // FLOOR
      // ======================================================

      floor: {

        type: String,

        default: "",
      },


      // ======================================================
      // BUILDING
      // ======================================================

      building: {

        type: String,

        default: "",
      },


      // ======================================================
      // ACADEMIC YEAR
      // ======================================================

     academicYear: {

  type: String,

  default: ""
},


      // ======================================================
      // CLASS TYPE
      // ======================================================

      classType: {

        type: String,

        enum: [

          "Regular",

          "Lab",

          "Activity",

          "Special",
        ],

        default: "Regular",
      },


      // ======================================================
      // CAPACITY
      // ======================================================

      capacity: {

        type: Number,

        default: 60,
      },


      // ======================================================
      // SHIFT
      // ======================================================

      shift: {

        type: String,

        enum: [

          "Morning",

          "Day",

          "Evening",
        ],

        default: "Day",
      },


      // ======================================================
      // DESCRIPTION
      // ======================================================

      description: {

        type: String,

        default: "",
      },


      // ======================================================
      // COLOR
      // ======================================================

      colorTheme: {

        type: String,

        default: "#2563eb",
      },


      // ======================================================
      // STATUS
      // ======================================================

      status: {

        type: String,

        enum: [

          "Active",

          "Inactive",
        ],

        default: "Active",
      },


      // ======================================================
      // ACTIVE FLAG
      // ======================================================

      isActive: {

        type: Boolean,

        default: true,
      },


      // ======================================================
      // ARCHIVE
      // ======================================================

      isArchived: {

        type: Boolean,

        default: false,
      },

    },

    {

      timestamps: true,
    }
  );
// ======================================================
// AUTO DISPLAY NAME
// ======================================================

sectionSchema.pre(

  "validate",

  function () {

    // ======================================================
    // SAFE STRINGS
    // ======================================================

    this.className =

      this.className?.trim() || "";


    this.sectionName =

      this.sectionName?.trim() || "";


    // ======================================================
    // DISPLAY NAME
    // ======================================================

    this.displayName =

      this.sectionName

        ? `${this.className} - ${this.sectionName}`

        : this.className;


    this.displayName =

      this.displayName?.trim() || "";


    // ======================================================
    // DEFAULT TEACHER
    // ======================================================

    if (

  !this.classTeacher
) {

  this.classTeacher = null;
}
  }
);


// ======================================================
// INDEXES
// ======================================================
sectionSchema.index(
{
  schoolId: 1,
  academicYear: 1,
  displayName: 1
},
{
  unique: true
}
);

sectionSchema.index({

  schoolId: 1,

  className: 1,
});


sectionSchema.index({

  schoolId: 1,

  status: 1,
});

sectionSchema.index({

  schoolId: 1,

  academicYear: 1
});




// ======================================================
// EXPORT
// ======================================================

module.exports =

  mongoose.model(

    "Section",

    sectionSchema
  );