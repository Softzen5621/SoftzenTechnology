const express =
  require("express");

const router =
  express.Router();

// ======================================================
// CONTROLLERS
// ======================================================
const {

  markAttendance,

  getAttendance,

  getMonthlyAttendance,

  checkAttendanceExists,

  getAttendanceDashboard,

  getStudentAttendanceHistory,

  getStudentAttendanceByDate,

  getAttendanceStatusBulk

} = require(
  "../controllers/attendanceController"
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
// MARK ATTENDANCE
// ======================================================
// ACCESS:
// teacher
// admin
// super_admin
// ======================================================

router.post(

  "/mark",

  authMiddleware,

  authorizeRoles(

    "teacher",

    "admin",

    "super_admin"
  ),

  markAttendance
);

// ======================================================
// CHECK EXISTING ATTENDANCE
// ======================================================
// ACCESS:
// teacher
// admin
// super_admin
// ======================================================

router.get(

  "/check",

  authMiddleware,

  authorizeRoles(

    "teacher",

    "admin",

    "super_admin"
  ),

  checkAttendanceExists
);

// ======================================================
// GET CLASS ATTENDANCE
// ======================================================
// ACCESS:
// teacher
// admin
// super_admin
// ======================================================

router.get(

  "/class",

  authMiddleware,

  authorizeRoles(

    "teacher",

    "admin",

    "super_admin"
  ),

  getAttendance
);

// ======================================================
// MONTHLY ATTENDANCE
// ======================================================
// ACCESS:
// teacher
// admin
// parent
// student
// super_admin
// ======================================================

router.get(

  "/monthly",

  authMiddleware,

  authorizeRoles(

    "teacher",

    "admin",

    "parent",

    "student",

    "super_admin"
  ),

  getMonthlyAttendance
);

router.get(

  "/history",

  authMiddleware,

  authorizeRoles(

    "teacher",

    "admin",

    "parent",

    "student",

    "super_admin"
  ),

  getStudentAttendanceHistory
);

router.get(

  "/date-status",

  authMiddleware,

  authorizeRoles(

    "teacher",

    "admin",

    "super_admin"
  ),



  getStudentAttendanceByDate
);

router.post(

  "/bulk-status",

  authMiddleware,

  authorizeRoles(

    "teacher",

    "admin",

    "super_admin"
  ),

  getAttendanceStatusBulk
);

router.get(

  "/dashboard",

  authMiddleware,

  authorizeRoles(

    "admin",

    "super_admin"
  ),

  getAttendanceDashboard
);

// ======================================================
// EXPORT
// ======================================================

module.exports =
  router;