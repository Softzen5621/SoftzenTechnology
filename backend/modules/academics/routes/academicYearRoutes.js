const express =
require("express");

const router =
express.Router();

const protect =
require(
  "../../../middlewares/authMiddleware"
);

const checkPermission =
require(
  "../../../middlewares/permissionMiddleware"
);

const {

  createAcademicYear,

  getAcademicYears,

  activateAcademicYear,

  getActiveAcademicYear,

  cloneAcademicStructure

} = require(

  "../controllers/academicYearController"
);

// ======================================================
// CREATE
// ======================================================

router.post(

  "/create",

  protect,

  checkPermission(

    "admin",

    "super_admin"
  ),

  createAcademicYear
);

// ======================================================
// GET ALL
// ======================================================

router.get(

  "/all",

  protect,

  getAcademicYears
);

// ======================================================
// GET ACTIVE
// ======================================================

router.get(

  "/active",

  protect,

  getActiveAcademicYear
);

// ======================================================
// ACTIVATE
// ======================================================

router.put(

  "/activate/:id",

  protect,

  checkPermission(

    "admin",

    "super_admin"
  ),

  activateAcademicYear
);

// ======================================================
// CLONE STRUCTURE
// ======================================================

router.post(

  "/clone-structure/:id",

  protect,

  checkPermission(

    "admin",

    "super_admin"
  ),

  cloneAcademicStructure
);

// ======================================================
// EXPORT
// ======================================================

module.exports =
router;