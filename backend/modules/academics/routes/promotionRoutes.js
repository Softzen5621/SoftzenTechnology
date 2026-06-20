const express =
require("express");

const protect =
require("../../../middlewares/authMiddleware");

const {

  previewPromotion,

  promoteClass,

  promoteSchool

} = require(

  "../controllers/promotionController"
);

const router =
express.Router();

router.use(protect);

router.post(
  "/preview",
  previewPromotion
);

router.post(
  "/class",
  promoteClass
);

router.post(
  "/school",
  promoteSchool
);

module.exports =
router;