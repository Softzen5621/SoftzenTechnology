const express =
  require("express");

const router =
  express.Router();

const protect =
  require("../middlewares/authMiddleware");

const {

  getSubjects,

  addSubject,

} = require(
  "../controllers/subjectController"
);


// GET SUBJECTS

router.get(
  "/",
  protect,
  getSubjects
);


// CREATE SUBJECT

router.post(
  "/",
  protect,
  addSubject
);


module.exports =
  router;