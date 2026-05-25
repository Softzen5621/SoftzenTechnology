const express =
  require("express");

const router =
  express.Router();

const protect =
  require("../middlewares/authMiddleware");

const {

  getPayments,

  addPayment,

  deletePayment

} = require(
  "../controllers/feePaymentController"
);

// ======================
// PROTECTED ROUTES
// ======================

router.use(protect);

// ======================
// GET ALL PAYMENTS
// ======================

router.get(
  "/",
  getPayments
);

// ======================
// ADD PAYMENT
// ======================

router.post(
  "/",
  addPayment
);

// ======================
// DELETE PAYMENT
// ======================

router.delete(
  "/:id",
  deletePayment
);

// ======================
// EXPORT
// ======================

module.exports =
  router;