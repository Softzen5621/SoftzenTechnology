const express =
require("express");

const router =
express.Router();

const {

  searchStudentFees

} = require(

  "../controllers/studentFinanceController"
);

const protect =
require(

  "../../../middlewares/authMiddleware"
);

const checkPermission =
require(

  "../../../middlewares/permissionMiddleware"
);


// ======================
// SEARCH STUDENT FEES
// ======================

router.get(

  "/search",

  protect,

  checkPermission(
  "admin"
),

  searchStudentFees
);

module.exports =
router;