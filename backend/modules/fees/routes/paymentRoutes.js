const express =
require("express");

const router =
express.Router();



// ======================
// CONTROLLER
// ======================

const paymentController =
require(

  "../controllers/paymentController"
);



// ======================
// AUTH MIDDLEWARE
// ======================

const protect =
require(

  "../../../middlewares/authMiddleware"
);



// ======================
// CREATE PAYMENT ORDER
// ======================

router.post(

  "/create-order",

  protect,

  async (req, res) => {

    return await
    paymentController
    .createOrder(
      req,
      res
    );
  }
);



// ======================
// VERIFY PAYMENT
// ======================

router.post(

  "/verify",

  protect,

  async (req, res) => {

    return await
    paymentController
    .verifyPayment(
      req,
      res
    );
  }
);



// ======================
// CASH COLLECTION
// ======================

router.post(

  "/collect-cash",

  protect,

  async (req, res) => {

    return await
    paymentController
    .collectCashPayment(
      req,
      res
    );
  }
);



// ======================
// RAZORPAY WEBHOOK
// ======================

router.post(

  "/webhook/razorpay",

  async (req, res) => {

    return await
    paymentController
    .razorpayWebhook(
      req,
      res
    );
  }
);



// ======================
// TEST ROUTE
// ======================

router.get(

  "/test",

  (req, res) => {

    return res.json({

      success: true,

      message:
        "Payment routes working"
    });
  }
);



// ======================
// EXPORT
// ======================

module.exports =
router;