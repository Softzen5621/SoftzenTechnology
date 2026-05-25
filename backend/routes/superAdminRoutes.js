const express =
  require("express");

const router =
  express.Router();

// ======================
// CONTROLLER
// ======================

const superAdminController =
  require(
    "../controllers/superAdminController"
  );

// ======================
// AUTH MIDDLEWARE
// ======================

const protect =
  require(
    "../middlewares/authMiddleware"
  );

// ======================
// SUPER ADMIN CHECK
// ======================

const superAdminOnly =
  (req, res, next) => {

    if (

      !req.user ||

      req.user.role !==
      "super_admin"
    ) {

      return res.status(403).json({

        success: false,

        msg:
          "Super Admin access only"
      });
    }

    next();
  };

// ======================
// CREATE SCHOOL
// ======================

router.post(

  "/create-school",

  protect,

  superAdminOnly,

  superAdminController.createSchool
);

// ======================
// GET SCHOOLS
// ======================

router.get(

  "/schools",

  protect,

  superAdminOnly,

  superAdminController.getSchools
);

// ======================
// EXPORT
// ======================

module.exports =
  router;