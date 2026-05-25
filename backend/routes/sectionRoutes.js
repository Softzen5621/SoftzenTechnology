const express =
  require("express");

const protect =
  require("../middlewares/authMiddleware");


const {

  getSections,

  getSectionById,

  addSection,

  deleteSection,

  updateSection,

  assignClassTeacher,

  assignSubject,

  removeSubject,

} = require(

  "../controllers/sectionController"
);


const router =
  express.Router();


// ======================================================
// PROTECTED ROUTES
// ======================================================

router.use(protect);


// ======================================================
// GET ALL CLASSES
// ======================================================

router.get(
  "/",
  getSections
);


// ======================================================
// GET SINGLE CLASS
// ======================================================

router.get(
  "/:id",
  getSectionById
);


// ======================================================
// CREATE CLASS
// ======================================================

router.post(
  "/",
  addSection
);


// ======================================================
// UPDATE CLASS
// ======================================================

router.put(
  "/:id",
  updateSection
);


// ======================================================
// DELETE CLASS
// ======================================================

router.delete(
  "/:id",
  deleteSection
);


// ======================================================
// ASSIGN CLASS TEACHER
// ======================================================

router.put(

  "/:id/assign-class-teacher",

  assignClassTeacher
);


// ======================================================
// ASSIGN SUBJECT
// ======================================================

router.put(

  "/:id/assign-subject",

  assignSubject
);


// ======================================================
// REMOVE SUBJECT
// ======================================================

router.put(

  "/:id/remove-subject",

  removeSubject
);


// ======================================================
// EXPORT
// ======================================================

module.exports =
  router;