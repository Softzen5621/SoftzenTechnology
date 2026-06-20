const {

  previewPromotion:
  previewPromotionService,

  promoteSchool:
  promoteSchoolService

} = require(

  "../services/promotionService"
);

// ======================================================
// PREVIEW PROMOTION
// ======================================================

exports.previewPromotion =
async (req, res) => {

  try {

    const schoolId =
      req.user.schoolId;

    const data =

      await previewPromotionService(

        schoolId
      );

    res.json({

      success: true,

      count: data.length,

      data
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: error.message
    });
  }
};

// ======================================================
// PROMOTE SINGLE CLASS
// ======================================================

exports.promoteClass =
async (req, res) => {

  res.json({

    success: true,

    message:
      "Promote Class API Working"
  });
};

// ======================================================
// PROMOTE WHOLE SCHOOL
// ======================================================

exports.promoteSchool =
async (req, res) => {

  try {

    const schoolId =
      req.user.schoolId;

    const userId =
      req.user._id;

    const result =

      await promoteSchoolService(

        schoolId,

        userId
      );

    res.json({

      success: true,

      ...result
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
};