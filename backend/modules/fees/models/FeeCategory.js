const mongoose =
require("mongoose");

const feeCategorySchema =
new mongoose.Schema({

  schoolId: {

    type: String,

    required: true,

    index: true
  },

  title: {

    type: String,

    required: true,

    trim: true
  },

  code: {

    type: String,

    required: true,

    uppercase: true,

    trim: true
  },

  description: {

    type: String,

    default: ""
  },

  isMandatory: {

    type: Boolean,

    default: true
  },

  recurringType: {

    type: String,

    enum: [

      "MONTHLY",
      "QUARTERLY",
      "YEARLY",
      "ONE_TIME"
    ],

    required: true
  },

  allowLateFine: {

    type: Boolean,

    default: true
  },

  active: {

    type: Boolean,

    default: true
  },

  createdBy: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User"
  }

}, {

  timestamps: true
});

feeCategorySchema.index({

  schoolId: 1,

  code: 1

}, {

  unique: true
});

module.exports =
mongoose.model(
  "FeeCategory",
  feeCategorySchema
);