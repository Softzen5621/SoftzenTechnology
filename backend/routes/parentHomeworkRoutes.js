const express =
  require("express");

const router =
  express.Router();

// ======================================================
// CONTROLLER
// ======================================================

const {

  getChildHomeworks,

  askHomeworkQuestion,

  getHomeworkFAQ,

  markHomeworkViewed,

  acknowledgeHomework,
  submitHomework

} = require(

  "../controllers/parentHomeworkController"
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
// PARENT AUTH ONLY
// ======================================================

const parentOnly = [

  authMiddleware,

  authorizeRoles(
    "parent"
  )
];

// ======================================================
// GET CHILD HOMEWORKS
// ======================================================
// PURPOSE:
// Parent can view all homework
// assigned to their children
// ======================================================

router.get(

  "/homeworks",

  ...parentOnly,

  getChildHomeworks
);

// ======================================================
// ASK HOMEWORK QUESTION
// ======================================================
// PURPOSE:
// Parent can ask question
// related to homework
// ======================================================

router.post(

  "/questions",

  ...parentOnly,

  askHomeworkQuestion
);

// ======================================================
// GET HOMEWORK FAQ
// ======================================================
// PURPOSE:
// Show all public teacher-approved
// FAQ questions
// ======================================================

router.get(

  "/faq/:id",

  ...parentOnly,

  getHomeworkFAQ
);

// ======================================================
// MARK HOMEWORK VIEWED
// ======================================================
// PURPOSE:
// Track parent homework view
// and send realtime notification
// to teacher
// ======================================================

router.post(

  "/view/:id",

  ...parentOnly,

  markHomeworkViewed
);

// ======================================================
// ACKNOWLEDGE HOMEWORK
// ======================================================
// PURPOSE:
// Parent acknowledges homework
// teacher gets realtime update
// ======================================================

router.post(

  "/acknowledge/:id",

  ...parentOnly,

  acknowledgeHomework
);

// ======================================================
// SUBMIT HOMEWORK
// ======================================================

router.post(

  "/submit/:id",

  ...parentOnly,

  submitHomework
);

// ======================================================
// HEALTH CHECK
// ======================================================

router.get(

  "/test",

  (req, res) => {

    return res.status(200).json({

      success: true,

      msg:
        "Parent homework routes working"
    });
  }
);

// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports =
  router;