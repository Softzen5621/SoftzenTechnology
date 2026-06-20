const express =
require("express");

const router =
express.Router();



// ======================
// CONTROLLER
// ======================

const {

  getParentFeesDashboard,

  downloadReceipt

} = require(

  "../controllers/parentFeesController"
);



// ======================
// AUTH
// ======================

const protect =
require(

  "../../../middlewares/authMiddleware"
);



// ======================
// PARENT DASHBOARD
// ======================

router.get(

  "/dashboard",

  protect,

  getParentFeesDashboard
);



// ======================
// DOWNLOAD RECEIPT
// ======================

router.get(

  "/receipt/:receiptId",

  protect,

  downloadReceipt
);



// ======================
// EXPORT
// ======================

module.exports =
router;