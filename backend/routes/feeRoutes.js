const express =
  require("express");

const router =
  express.Router();

const protect =
  require("../middlewares/authMiddleware");

const {

  getFees,

  addFee,

  updateFee,

  deleteFee

} = require(
  "../controllers/feeController"
);

// ======================
// PROTECTED ROUTES
// ======================

router.use(protect);

// ======================
// GET ALL FEES
// ======================

router.get(
  "/",
  getFees
);

// ======================
// CREATE FEE STRUCTURE
// ======================

router.post(
  "/",
  addFee
);

// ======================
// UPDATE FEE
// ======================

router.put(
  "/:id",
  updateFee
);

// ======================
// DELETE FEE
// ======================

router.delete(
  "/:id",
  deleteFee
);

// ======================
// EXPORT
// ======================

module.exports =
  router;