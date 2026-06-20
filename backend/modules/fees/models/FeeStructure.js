const mongoose =
require("mongoose");

const feeItemSchema =
new mongoose.Schema({

  categoryId: {

  type:
    mongoose.Schema.Types.ObjectId,

  ref: "FeeCategory",

  default: null
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

  amount: {

    type: Number,

    required: true,

    min: 0
  },

  mandatory: {

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

  installmentAllowed: {

    type: Boolean,

    default: false
  },

  lateFineEnabled: {

    type: Boolean,

    default: true
  },

  lateFineAmount: {

    type: Number,

    default: 0
  },

  dueDay: {

    type: Number,

    min: 1,

    max: 31
  },

  active: {

    type: Boolean,

    default: true
  }

}, {

  _id: true
});

const feeStructureSchema =
new mongoose.Schema({

  schoolId: {

    type: String,

    required: true,

    index: true
  },

  academicYear: {

    type: String,

    required: true,

    trim: true,

    index: true
  },

  className: {

    type: String,

    required: true,

    trim: true,

    index: true
  },

  section: {

    type: String,

    default: "ALL",

    trim: true
  },

  structureName: {

    type: String,

    required: true,

    trim: true
  },

  feeItems: [

    feeItemSchema
  ],

  totalAmount: {

    type: Number,

    default: 0
  },

 effectiveFrom: {
  type: Date,
  default: Date.now
},

  effectiveTo: {

    type: Date
  },

  status: {

    type: String,

    enum: [

      "DRAFT",
      "ACTIVE",
      "ARCHIVED"
    ],

    default: "ACTIVE"
  },

  autoAssignToStudents: {

    type: Boolean,

    default: true
  },

  allowOnlinePayment: {

    type: Boolean,

    default: true
  },

  notes: {

    type: String,

    default: ""
  },

  createdBy: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User"
  },

  updatedBy: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User"
  },

  isDeleted: {

    type: Boolean,

    default: false
  },

  deletedAt: Date,

  deletedBy: {

    type:
      mongoose.Schema.Types.ObjectId,

    ref: "User"
  }

}, {

  timestamps: true
});



// ======================
// INDEXES
// ======================

feeStructureSchema.index({

  schoolId: 1,

  academicYear: 1,

  className: 1
});

feeStructureSchema.index({

  schoolId: 1,

  status: 1
});



// ======================
// PRE SAVE
// ======================
feeStructureSchema.pre(

  "save",

  function() {

    const total =
      this.feeItems.reduce(

        (sum, item) => {

          return sum + item.amount;

        },

        0
      );

    this.totalAmount =
      total;
  }
);


const FeeStructure =

mongoose.models
.FeeStructure ||

mongoose.model(

  "FeeStructure",

  feeStructureSchema
);

module.exports =
FeeStructure;