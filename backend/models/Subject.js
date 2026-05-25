const mongoose =
  require("mongoose");

const subjectSchema =
  new mongoose.Schema(

    {

      schoolId: {

        type: String,

        required: true,

        trim: true,
      },

      name: {

        type: String,

        required: true,

        trim: true,
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
      timestamps: true,
    }
  );


// UNIQUE SUBJECT INSIDE SCHOOL

subjectSchema.index(

  {
    schoolId: 1,
    name: 1,
  },

  {
    unique: true,
  }
);

module.exports =
  mongoose.model(
    "Subject",
    subjectSchema
  );