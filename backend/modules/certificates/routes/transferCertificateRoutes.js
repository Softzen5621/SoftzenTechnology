const express =
require("express");

const router =
express.Router();

const protect =
require("../../../middlewares/authMiddleware");

const {

  issueTC,

  getTCs,

  getTCById

} = require(

  "../controllers/transferCertificateController"
);

router.use(protect);

router.post(
  "/issue",
  issueTC
);

router.get(
  "/",
  getTCs
);

router.get(
  "/:id",
  getTCById
);

module.exports =
router;