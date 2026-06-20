const express =
require("express");

const router =
express.Router();



// ======================
// CONTROLLER
// ======================

const {

  createFeeStructure,

  getFeeStructures,

  getSingleFeeStructure,

  updateFeeStructure,

  archiveFeeStructure,

  activateFeeStructure,

  deleteFeeStructure

} = require(

  "../controllers/feeStructureController"
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
// CREATE
// ======================

router.post(

  "/",

  protect,

  checkPermission(
    "admin"
  ),

  createFeeStructure
);



// ======================
// GET ALL
// ======================

router.get(

  "/",

  protect,

  checkPermission(
  "admin"
),

  getFeeStructures
);



// ======================
// GET SINGLE
// ======================

router.get(

  "/:id",

  protect,

   checkPermission(
  "admin"
),

  getSingleFeeStructure
);



// ======================
// UPDATE
// ======================

router.put(

  "/:id",

  protect,
  
  checkPermission(
  "admin"
),

  updateFeeStructure
);



// ======================
// ARCHIVE
// ======================

router.patch(

  "/:id/archive",

  protect,

  checkPermission(
  "admin"
),

  archiveFeeStructure
);



// ======================
// ACTIVATE
// ======================

router.patch(

  "/:id/activate",

  protect,
  checkPermission(
  "admin"
),

  activateFeeStructure
);



// ======================
// DELETE
// ======================

router.delete(

  "/:id",

  protect,

    checkPermission(
  "admin"
),

  deleteFeeStructure
);



// ======================
// EXPORT
// ======================

module.exports =
router;