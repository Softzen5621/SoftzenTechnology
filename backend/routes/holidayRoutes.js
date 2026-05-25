const express =
  require("express");

const router =
  express.Router();

// ======================================================
// CONTROLLERS
// ======================================================

const {

  createHoliday,

  getHolidays,

  checkHoliday,

  deleteHoliday

} = require(

  "../controllers/holidayController"
);

// ======================================================
// MIDDLEWARES
// ======================================================

const authMiddleware =
  require(

    "../middlewares/authMiddleware"
  );

const {

  authorizeRoles

} = require(

  "../middlewares/authMiddleware"
);

// ======================================================
// CREATE HOLIDAY
// ======================================================
// ACCESS:
// admin
// super_admin
// ======================================================

router.post(

  "/create",

  authMiddleware,

  authorizeRoles(

    "admin",

    "super_admin"
  ),

  createHoliday
);

// ======================================================
// GET HOLIDAYS
// ======================================================
// ACCESS:
// admin
// teacher
// student
// parent
// super_admin
// ======================================================

router.get(

  "/all",

  authMiddleware,

  authorizeRoles(

    "admin",

    "teacher",

    "student",

    "parent",

    "super_admin"
  ),

  getHolidays
);

// ======================================================
// CHECK HOLIDAY
// ======================================================
// ACCESS:
// admin
// teacher
// student
// parent
// super_admin
// ======================================================

router.get(

  "/check",

  authMiddleware,

  authorizeRoles(

    "admin",

    "teacher",

    "student",

    "parent",

    "super_admin"
  ),

  checkHoliday
);

// ======================================================
// DELETE HOLIDAY
// ======================================================
// ACCESS:
// admin
// super_admin
// ======================================================

router.delete(

  "/delete/:id",

  authMiddleware,

  authorizeRoles(

    "admin",

    "super_admin"
  ),

  deleteHoliday
);

// ======================================================
// EXPORT
// ======================================================

module.exports =
  router;