const FeeStructure =
require(
  "../models/FeeStructure"
);

const {

  assignFeesToClass

} = require(

  "../services/FeeAssignmentService"
);



// ======================
// CREATE STRUCTURE
// ======================

const createFeeStructure =
async (req, res) => {

  try {

    const {

      academicYear,

      className,

      section = "ALL",

      structureName,

      feeItems,

      effectiveFrom,

      effectiveTo,

      allowOnlinePayment,

      notes

    } = req.body;



    // ======================
    // VALIDATION
    // ======================

    if (

      !academicYear ||

      !className ||

      !structureName ||

      !feeItems ||

      feeItems.length === 0 ||

      !effectiveFrom

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Required fields missing"
      });
    }



    // ======================
    // DUPLICATE CHECK
    // ======================

   const existing =
await FeeStructure.findOne({

  schoolId: req.user.schoolId,

  academicYear,

  className,

  section,

  isDeleted:false
});



    if (existing) {

      return res.status(400).json({

        success: false,

        message:
          "Fee structure already exists"
      });
    }



    // ======================
    // CREATE
    // ======================

    const structure =
      await FeeStructure.create({

        schoolId:
          req.user.schoolId,

        academicYear,

        className,

        section,

        structureName,

        feeItems,

        effectiveFrom,

        effectiveTo,

        allowOnlinePayment,

        notes,

        createdBy:
          req.user._id,

        status:
          "ACTIVE"
      });




    // ======================
    // AUTO ASSIGN FEES
    // ======================

    await assignFeesToClass({

      schoolId:
        req.user.schoolId,

      academicYear,

      className,

      section,

      createdBy:
        req.user._id
    });




    return res.status(201).json({

      success: true,

      message:
        "Fee structure created successfully",

      structure
    });

  } catch (error) {

    console.error(

      "CREATE STRUCTURE ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message ||

        "Failed to create fee structure"
    });
  }
};



// ======================
// GET ALL STRUCTURES
// ======================

const getFeeStructures =
async (req, res) => {

  try {

    const structures =
      await FeeStructure.find({

        schoolId:
          req.user.schoolId,

        isDeleted: false
      })

      .sort({

        createdAt: -1
      });



    return res.status(200).json({

      success: true,

      structures
    });

  } catch (error) {

    console.error(

      "GET STRUCTURES ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch structures"
    });
  }
};



// ======================
// GET SINGLE STRUCTURE
// ======================

const getSingleFeeStructure =
async (req, res) => {

  try {

    const structure =
      await FeeStructure.findOne({

        _id:
          req.params.id,

        schoolId:
          req.user.schoolId,

        isDeleted: false
      });




    if (!structure) {

      return res.status(404).json({

        success: false,

        message:
          "Structure not found"
      });
    }



    return res.status(200).json({

      success: true,

      structure
    });

  } catch (error) {

    console.error(

      "GET SINGLE STRUCTURE ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch structure"
    });
  }
};



// ======================
// UPDATE STRUCTURE
// ======================

const updateFeeStructure =
async (req, res) => {

  try {

    const structure =
      await FeeStructure.findOne({

        _id:
          req.params.id,

        schoolId:
          req.user.schoolId,

        isDeleted: false
      });




    if (!structure) {

      return res.status(404).json({

        success: false,

        message:
          "Structure not found"
      });
    }



    // ======================
    // UPDATE
    // ======================

    Object.assign(

      structure,

      req.body
    );



    structure.updatedBy =
      req.user._id;



    await structure.save();




    // ======================
    // REASSIGN
    // ======================

    if (

      structure.status ===
      "ACTIVE"

    ) {

      await assignFeesToClass({

        schoolId:
          req.user.schoolId,

        academicYear:
          structure.academicYear,

        className:
          structure.className,

        section:
          structure.section,

        createdBy:
          req.user._id
      });
    }




    return res.status(200).json({

      success: true,

      message:
        "Fee structure updated",

      structure
    });

  } catch (error) {

    console.error(

      "UPDATE STRUCTURE ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message ||

        "Failed to update structure"
    });
  }
};



// ======================
// ARCHIVE STRUCTURE
// ======================

const archiveFeeStructure =
async (req, res) => {

  try {

    const structure =
      await FeeStructure.findOne({

        _id:
          req.params.id,

        schoolId:
          req.user.schoolId,

        isDeleted: false
      });




    if (!structure) {

      return res.status(404).json({

        success: false,

        message:
          "Structure not found"
      });
    }



    structure.status =
      "ARCHIVED";



    structure.updatedBy =
      req.user._id;



    await structure.save();




    return res.status(200).json({

      success: true,

      message:
        "Structure archived"
    });

  } catch (error) {

    console.error(

      "ARCHIVE STRUCTURE ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to archive structure"
    });
  }
};



// ======================
// ACTIVATE STRUCTURE
// ======================

const activateFeeStructure =
async (req, res) => {

  try {

    const structure =
      await FeeStructure.findOne({

        _id:
          req.params.id,

        schoolId:
          req.user.schoolId,

        isDeleted: false
      });




    if (!structure) {

      return res.status(404).json({

        success: false,

        message:
          "Structure not found"
      });
    }



    // ======================
    // DEACTIVATE OLD
    // ======================

    await FeeStructure.updateMany(

      {

        schoolId:
          req.user.schoolId,

        academicYear:
          structure.academicYear,

        className:
          structure.className,

        section:
          structure.section,

        _id: {

          $ne:
            structure._id
        }
      },

      {

        status:
          "ARCHIVED"
      }
    );




    structure.status =
      "ACTIVE";



    structure.updatedBy =
      req.user._id;



    await structure.save();




    // ======================
    // REASSIGN
    // ======================

    await assignFeesToClass({

      schoolId:
        req.user.schoolId,

      academicYear:
        structure.academicYear,

      className:
        structure.className,

      section:
        structure.section,

      createdBy:
        req.user._id
    });




    return res.status(200).json({

      success: true,

      message:
        "Fee structure activated"
    });

  } catch (error) {

    console.error(

      "ACTIVATE STRUCTURE ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message ||

        "Failed to activate structure"
    });
  }
};



// ======================
// SOFT DELETE
// ======================

const deleteFeeStructure =
async (req, res) => {

  try {

    const structure =
      await FeeStructure.findOne({

        _id:
          req.params.id,

        schoolId:
          req.user.schoolId,

        isDeleted: false
      });




    if (!structure) {

      return res.status(404).json({

        success: false,

        message:
          "Structure not found"
      });
    }



    structure.isDeleted =
      true;



    structure.deletedAt =
      new Date();



    structure.deletedBy =
      req.user._id;



    structure.status =
      "ARCHIVED";



    await structure.save();




    return res.status(200).json({

      success: true,

      message:
        "Fee structure deleted"
    });

  } catch (error) {

    console.error(

      "DELETE STRUCTURE ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to delete structure"
    });
  }
};



// ======================
// EXPORTS
// ======================

module.exports = {

  createFeeStructure,

  getFeeStructures,

  getSingleFeeStructure,

  updateFeeStructure,

  archiveFeeStructure,

  activateFeeStructure,

  deleteFeeStructure
};