const express =
  require("express");

const router =
  express.Router();

// ======================
// MIDDLEWARES
// ======================

const protect =
  require("../middlewares/authMiddleware");

const checkPermission =
  require("../middlewares/permissionMiddleware");

// ======================
// CONTROLLERS
// ======================

const {

  getActivityLogs

} = require(

  "../controllers/activityLogController"
);

// ======================
// ROUTES
// ======================

// GET ALL LOGS
router.get(

  "/",

  protect,

  checkPermission(

    "admin",

    "superadmin"
  ),

  getActivityLogs
);

// ======================
// EXPORT
// ======================

module.exports =
  router;