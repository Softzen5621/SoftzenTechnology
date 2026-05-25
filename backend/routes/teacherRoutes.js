const express =
  require("express");

const router =
  express.Router();

const multer =
  require("multer");

// ======================================================
// CONTROLLERS
// ======================================================

const {

  createTeacher,

  getTeachers,

  getSingleTeacher,

  updateTeacher,

  deleteTeacher,

  resetTeacherPassword,

  importTeachers,

  downloadTeacherSample,

  changeTeacherPassword,

  getTeacherDashboard,

  getTeacherClasses

} = require(
  "../controllers/teacherController"
);

// ======================================================
// AUTH MIDDLEWARE
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
// MULTER CONFIG
// ======================================================

const storage =
  multer.memoryStorage();

const upload =
  multer({

    storage,

    limits: {

      fileSize:
        5 * 1024 * 1024
    }
  });

// ======================================================
// TEACHER DASHBOARD
// ======================================================

router.get(

  "/dashboard",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  getTeacherDashboard
);

// ======================================================
// MY CLASSES
// ======================================================

router.get(

  "/my-classes",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  getTeacherClasses
);

// ======================================================
// CHANGE PASSWORD
// ======================================================

router.put(

  "/change-password",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  changeTeacherPassword
);

// ======================================================
// CREATE TEACHER
// ACCESS:
// admin
// super_admin
// ======================================================

router.post(

  "/",

  authMiddleware,

  authorizeRoles(

    "admin",

    "super_admin"
  ),

  createTeacher
);

// ======================================================
// GET ALL TEACHERS
// ======================================================

router.get(

  "/",

  authMiddleware,

  authorizeRoles(

    "admin",

    "super_admin"
  ),

  getTeachers
);

// ======================================================
// IMPORT TEACHERS
// ======================================================

router.post(

  "/import",

  authMiddleware,

  authorizeRoles(

    "admin",

    "super_admin"
  ),

  upload.single("file"),

  importTeachers
);

// ======================================================
// DOWNLOAD SAMPLE
// ======================================================

router.get(

  "/sample",

  authMiddleware,

  authorizeRoles(

    "admin",

    "super_admin"
  ),

  downloadTeacherSample
);

// ======================================================
// RESET PASSWORD
// ======================================================

router.put(

  "/reset-password/:id",

  authMiddleware,

  authorizeRoles(

    "admin",

    "super_admin"
  ),

  resetTeacherPassword
);

// ======================================================
// GET SINGLE TEACHER
// IMPORTANT:
// KEEP BELOW STATIC ROUTES
// ======================================================

router.get(

  "/:id",

  authMiddleware,

  authorizeRoles(

    "admin",

    "super_admin"
  ),

  getSingleTeacher
);

// ======================================================
// UPDATE TEACHER
// ======================================================

router.put(

  "/:id",

  authMiddleware,

  authorizeRoles(

    "admin",

    "super_admin"
  ),

  updateTeacher
);

// ======================================================
// DELETE TEACHER
// ======================================================

router.delete(

  "/:id",

  authMiddleware,

  authorizeRoles(

    "admin",

    "super_admin"
  ),

  deleteTeacher
);

// ======================================================
// EXPORT
// ======================================================

module.exports =
  router;