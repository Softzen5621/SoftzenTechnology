const AcademicYear =
require(

  "../models/AcademicYear"
);

const {

  cloneAcademicStructure:
    cloneAcademicStructureService

} = require(

  "../services/academicYearCloneService"
);



// ======================================================
// CREATE ACADEMIC YEAR
// ======================================================

const createAcademicYear =
async (req, res) => {

  try {

    const {

      name,

      code,

      startDate,

      endDate

    } = req.body;



    // ======================================================
    // VALIDATION
    // ======================================================

    if (

      !name ||

      !code ||

      !startDate ||

      !endDate

    ) {

      return res.status(400).json({

        success: false,

        message:
          "All fields are required"
      });
    }



    // ======================================================
    // CHECK EXISTING
    // ======================================================

    const existingYear =
      await AcademicYear.findOne({

        schoolId:
          req.user.schoolId,

        name,

        isDeleted: false
      });

    if (existingYear) {

      return res.status(400).json({

        success: false,

        message:
          "Academic year already exists"
      });
    }



    // ======================================================
    // CREATE
    // ======================================================

    const academicYear =
      await AcademicYear.create({

        schoolId:
          req.user.schoolId,

        name,

        code,

        startDate,

        endDate,

        createdBy:
          req.user._id
      });



    return res.status(201).json({

      success: true,

      message:
        "Academic year created successfully",

      academicYear
    });

  } catch (error) {

    console.error(

      "CREATE ACADEMIC YEAR ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to create academic year"
    });
  }
};



// ======================================================
// GET ALL ACADEMIC YEARS
// ======================================================

const getAcademicYears =
async (req, res) => {

  try {

    const academicYears =
      await AcademicYear.find({

        schoolId:
          req.user.schoolId,

        isDeleted: false
      })

      .sort({

        createdAt: -1
      });



    return res.status(200).json({

      success: true,

      academicYears
    });

  } catch (error) {

    console.error(

      "GET ACADEMIC YEARS ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch academic years"
    });
  }
};



// ======================================================
// ACTIVATE ACADEMIC YEAR
// ======================================================
const activateAcademicYear =
async (req, res) => {

  try {

    const { id } = req.params;

    // ARCHIVE OLD ACTIVE YEAR

    await AcademicYear.updateMany(

      {
        schoolId:
          req.user.schoolId,

        isDeleted: false
      },

      {
        isActive: false,

        status: "ARCHIVED"
      }
    );

    // ACTIVATE NEW YEAR

    const academicYear =
      await AcademicYear.findOneAndUpdate(

        {
          _id: id,

          schoolId:
            req.user.schoolId
        },

        {
          isActive: true,

          status: "ACTIVE"
        },

        {
          new: true
        }
      );

    if (!academicYear) {

      return res.status(404).json({

        success: false,

        message:
          "Academic year not found"
      });
    }

    return res.status(200).json({

      success: true,

      message:
        "Academic year activated successfully",

      academicYear
    });

  } catch (error) {

    console.error(

      "ACTIVATE ACADEMIC YEAR ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to activate academic year"
    });
  }
};



// ======================================================
// GET ACTIVE ACADEMIC YEAR
// ======================================================

const getActiveAcademicYear =
async (req, res) => {

  try {

    const academicYear =
      await AcademicYear.findOne({

        schoolId:
          req.user.schoolId,

        isActive: true,

        isDeleted: false
      });



    return res.status(200).json({

      success: true,

      academicYear
    });

  } catch (error) {

    console.error(

      "GET ACTIVE ACADEMIC YEAR ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch active academic year"
    });
  }
};

// ======================================================
// CLONE ACADEMIC STRUCTURE
// ======================================================

const cloneAcademicStructure =
async (req, res) => {

  try {

    const schoolId =
      req.user.schoolId;

    const sourceYearId =
      req.params.id;

    const {

      targetYearId

    } = req.body;

    const result =

      await cloneAcademicStructureService(

        schoolId,

        sourceYearId,

        targetYearId
      );

    return res.status(200).json({

      success: true,

      message:
        "Academic structure cloned successfully",

      data: result
    });

  } catch (error) {

    console.error(

      "CLONE STRUCTURE ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
};



// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  createAcademicYear,

  getAcademicYears,

  activateAcademicYear,

  getActiveAcademicYear,

  cloneAcademicStructure
};