const mongoose =
  require("mongoose");

const transferCertificateSchema =
  new mongoose.Schema(

    {

      schoolId: {

        type: String,

        required: true,

        index: true
      },

      studentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Student",

        required: true
      },

      tcNumber: {

        type: String,

        required: true
      },

      issueDate: {

        type: Date,

        default: Date.now
      },

      lastClassStudied: {

        type: String,

        default: ""
      },

      result: {

        type: String,

        default: ""
      },

      reasonForLeaving: {

        type: String,

        default: ""
      },

      remarks: {

        type: String,

        default: ""
      },

      issuedBy: {

        type: String,

        default: ""
      },

      pdfUrl: {
  type: String,
  default: ""
},
generatedAt: {
  type: Date,
  default: Date.now
},

      status: {

        type: String,

        enum: [

          "ISSUED",

          "CANCELLED"
        ],

        default: "ISSUED"
      }
    },

    {

      timestamps: true
    }
  );

transferCertificateSchema.index({

  schoolId: 1,

  tcNumber: 1
});

module.exports =
  mongoose.model(

    "TransferCertificate",

    transferCertificateSchema
  );