const path =
require("path");

const fs =
require("fs");

const StudentFeeProfile =
require(
  "../models/StudentFeeProfile"
);

const Receipt =
require(
  "../models/Receipt"
);

const FeeLedger =
require(
  "../models/FeeLedger"
);

const Parent =
require(
  "../../../models/Parent"
);



// ======================
// GET PARENT FEES
// ======================

const getParentFeesDashboard =
async (req, res) => {

  try {

    // ======================
    // PARENT
    // ======================

    const parent =
      await Parent.findById(

        req.user.id
      );

    if (!parent) {

      return res.status(404).json({

        success: false,

        message:
          "Parent not found"
      });
    }



    // ======================
    // STUDENT
    // ======================

    const studentId =
      parent.studentId;



    // ======================
    // PROFILE
    // ======================

    const profile =
      await StudentFeeProfile.findOne({

        schoolId:
          req.user.schoolId,

        studentId,

        isDeleted: false

      });

    if (!profile) {

      return res.status(404).json({

        success: false,

        message:
          "Fee profile not found"
      });
    }



    // ======================
    // RECEIPTS
    // ======================

    const receipts =
      await Receipt.find({

        schoolId:
          req.user.schoolId,

        studentId,

        isDeleted: false

      })

      .sort({

        createdAt: -1
      });



    // ======================
    // LEDGER
    // ======================

    const ledger =
      await FeeLedger.find({

        schoolId:
          req.user.schoolId,

        studentId,

        isDeleted: false

      })

      .sort({

        createdAt: -1
      });



    // ======================
    // RESPONSE
    // ======================

    return res.status(200).json({

      success: true,



      parent: {

        name:
          parent.name,

        email:
          parent.email,

        phone:
          parent.phone
      },



      profile,



      summary: {

        totalAssigned:
          profile
          .totalAssignedAmount,



        totalPaid:
          profile
          .totalPaidAmount,



        totalDiscount:
          profile
          .totalDiscountAmount,



        totalFine:
          profile
          .totalFineAmount,



        totalPending:
          profile
          .totalPendingAmount
      },



      receipts,



      timeline:
        ledger
    });

  } catch (error) {

    console.error(

      "PARENT FEES DASHBOARD ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch fees dashboard"
    });
  }
};
const downloadReceipt =
async (req, res) => {

  try {

    // ======================
    // RECEIPT ID
    // ======================

    const {

      receiptId

    } = req.params;



    // ======================
    // FIND RECEIPT
    // ======================

    const receipt =
      await Receipt.findOne({

        _id:
          receiptId,

        schoolId:
          req.user.schoolId,

        isDeleted: false
      });

    if (!receipt) {

      return res.status(404).json({

        success: false,

        message:
          "Receipt not found"
      });
    }



    // ======================
    // SECURITY CHECK
    // ======================

    const parent =
      await Parent.findById(

        req.user.id
      );

    if (!parent) {

      return res.status(404).json({

        success: false,

        message:
          "Parent not found"
      });
    }



    // ======================
    // OWNERSHIP CHECK
    // ======================

    if (

      receipt.studentId.toString()

      !==

      parent.studentId.toString()

    ) {

      return res.status(403).json({

        success: false,

        message:
          "Unauthorized access"
      });
    }



    // ======================
    // PDF PATH
    // ======================

    const pdfPath =
      path.join(

        __dirname,

        "../../../",

        receipt.pdfUrl
      );



    // ======================
    // FILE EXISTS
    // ======================

    if (

      !fs.existsSync(
        pdfPath
      )

    ) {

      return res.status(404).json({

        success: false,

        message:
          "PDF file not found"
      });
    }



    // ======================
    // PRINT TRACKING
    // ======================

    receipt.printCount += 1;

    receipt.lastPrintedAt =
      new Date();

    await receipt.save();



    // ======================
    // DOWNLOAD
    // ======================

    return res.download(

      pdfPath,

      `${receipt.receiptNumber}.pdf`
    );

  } catch (error) {

    console.error(

      "DOWNLOAD RECEIPT ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Receipt download failed"
    });
  }
};





// ======================
// EXPORTS
// ======================

module.exports = {

  getParentFeesDashboard,
  downloadReceipt
};