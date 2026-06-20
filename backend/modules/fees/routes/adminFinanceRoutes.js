const express =
require("express");

const router =
express.Router();



// ======================
// CONTROLLER
// ======================

const {

  getAdminFinanceDashboard

} = require(

  "../controllers/adminFinanceController"
);



// ======================
// MIDDLEWARES
// ======================

const protect =
require(

  "../../../middlewares/authMiddleware"
);

const checkPermission =
require(

  "../../../middlewares/permissionMiddleware"
);



// ======================
// DASHBOARD
// ======================

router.get(

  "/dashboard",

  protect,

  checkPermission(
"admin"
  ),

  getAdminFinanceDashboard
);



// ======================
// EXPORT
// ======================

module.exports =
router;