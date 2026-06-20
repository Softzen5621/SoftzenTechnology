const express =
require("express");

const router =
express.Router();

const {

  getDailyCollection,

  getMonthlyCollection

} = require(

  "../controllers/collectionReportController"
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
// DAILY
// ======================

router.get(

  "/daily",

  protect,

  getDailyCollection
);



// ======================
// MONTHLY
// ======================

router.get(

  "/monthly",

  protect,

  getMonthlyCollection
);

module.exports =
router;