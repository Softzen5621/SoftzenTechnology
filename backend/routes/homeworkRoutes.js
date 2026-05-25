const express =
  require("express");

const router =
  express.Router();

// ======================================================
// CONTROLLERS
// ======================================================

const {

  createHomework,

  getTeacherHomeworks,

  saveSubmissionReview,

  deleteHomework,

  getSingleHomework,

  getHomeworkSubmissions,

  getHomeworkQuestions,

  answerHomeworkQuestion

} = require(
  "../controllers/homeworkController"
);
// ======================================================
// AUTH
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
// CREATE HOMEWORK
// ======================================================

router.post(

  "/",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  createHomework
);

// ======================================================
// SAVE REVIEW
// ======================================================

router.put(

  "/review-submission",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  saveSubmissionReview
);

// ======================================================
// GET TEACHER HOMEWORKS
// ======================================================

router.get(

  "/teacher",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  getTeacherHomeworks
);

// ======================================================
// GET SUBMISSIONS
// ======================================================

router.get(

  "/:id/submissions",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  getHomeworkSubmissions
);

// ======================================================
// GET QUESTIONS
// ======================================================

router.get(

  "/:id/questions",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  getHomeworkQuestions
);

// ======================================================
// GET SINGLE HOMEWORK
// ======================================================

router.get(

  "/:id",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  getSingleHomework
);
// ======================================================
// GET QUESTIONS
// ======================================================

router.get(

  "/:id/questions",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  getHomeworkQuestions
);

// ======================================================
// ANSWER QUESTION
// ======================================================

router.put(

  "/questions/:id",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  answerHomeworkQuestion
);

// ======================================================
// DELETE HOMEWORK
// ======================================================

router.delete(

  "/:id",

  authMiddleware,

  authorizeRoles(
    "teacher"
  ),

  deleteHomework
);

// ======================================================
// EXPORT
// ======================================================

module.exports =
  router;