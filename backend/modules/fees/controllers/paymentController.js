const crypto =
require("crypto");

const PaymentOrder =
require(
  "../models/PaymentOrder"
);

const Student =
require(
  "../../../models/Student"
);

const {

  createPaymentOrder,

  completePayment,

  failPayment

} = require(
  "../services/PaymentService"
);

const {

  createRazorpayOrder,

  verifyRazorpaySignature

} = require(
  "../gateways/RazorpayService"
);

const {

  verifyWebhookSignature

} = require(

  "../gateways/RazorpayService"
);



// ======================
// CREATE PAYMENT ORDER
// ======================

const createOrder =
async (req, res) => {

  try {

    const {

      studentId,

      studentFeeProfileId,

      feeAssignmentIds,

      amount,

      paymentMethod,

      gateway

    } = req.body;



    // ======================
    // VALIDATION
    // ======================

    if (

      !studentId ||

      !studentFeeProfileId ||

      !amount ||

      !paymentMethod ||

      !gateway

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Required fields missing"
      });
    }



    // ======================
    // STUDENT
    // ======================

    const student =
      await Student.findById(
        studentId
      );

    if (!student) {

      return res.status(404).json({

        success: false,

        message:
          "Student not found"
      });
    }



    // ======================
    // CREATE INTERNAL ORDER
    // ======================

    const paymentOrder =
      await createPaymentOrder({

        schoolId:
          req.user.schoolId,

        studentId,

        studentFeeProfileId,

        feeAssignmentIds,

        amount,

        paymentMethod,

        gateway,

        createdBy:
          req.user._id,

        req
      });



    // ======================
    // RAZORPAY ORDER
    // ======================

    let gatewayResponse = {};

    if (
      gateway === "RAZORPAY"
    ) {

      gatewayResponse =
        await createRazorpayOrder({

          schoolId:
            req.user.schoolId,

          amount,

          internalOrderId:
            paymentOrder
            .internalOrderId,

          student
        });




      // SAVE GATEWAY ORDER ID
      paymentOrder.gatewayOrderId =

        gatewayResponse
        .order.id;

      await paymentOrder.save();
    }



    return res.status(201).json({

      success: true,

      paymentOrder,

      gatewayResponse
    });

  } catch (error) {

    console.error(

      "CREATE ORDER ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message ||

        "Failed to create payment order"
    });
  }
};



// ======================
// VERIFY PAYMENT
// ======================

const verifyPayment =
async (req, res) => {

  try {

    const {

      paymentOrderId,

      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,

      feeItems = []

    } = req.body;



    // ======================
    // GET ORDER
    // ======================

    const paymentOrder =
      await PaymentOrder.findById(

        paymentOrderId
      );

    if (!paymentOrder) {

      return res.status(404).json({

        success: false,

        message:
          "Payment order not found"
      });
    }



    // ======================
    // VERIFY SIGNATURE
    // ======================

    const verified =

      await verifyRazorpaySignature({

        schoolId:
          paymentOrder.schoolId,

        razorpayOrderId:
          razorpay_order_id,

        razorpayPaymentId:
          razorpay_payment_id,

        razorpaySignature:
          razorpay_signature
      });



    // ======================
    // FAILED
    // ======================

    if (!verified) {

      await failPayment({

        paymentOrderId,

        reason:
          "Signature verification failed"
      });

      return res.status(400).json({

        success: false,

        message:
          "Payment verification failed"
      });
    }



    // ======================
    // COMPLETE PAYMENT
    // ======================

    const result =
      await completePayment({

        paymentOrderId,

        gatewayPaymentId:
          razorpay_payment_id,

        gatewayOrderId:
          razorpay_order_id,

        gatewaySignature:
          razorpay_signature,

        transactionId:
          razorpay_payment_id,

        verified: true,

        verificationSource:
          "API_VERIFY",

        feeItems,

        req
      });



    return res.status(200).json({

      success: true,

      message:
        "Payment successful",

      data: result
    });

  } catch (error) {

    console.error(

      "VERIFY PAYMENT ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message ||

        "Payment verification failed"
    });
  }
};



// ======================
// CASH COLLECTION
// ======================

const collectCashPayment =
async (req, res) => {

  try {

    const {

      studentId,

      studentFeeProfileId,

      feeAssignmentIds,

      amount,

      feeItems = []

    } = req.body;



    // ======================
    // CREATE ORDER
    // ======================

    const paymentOrder =
      await createPaymentOrder({

        schoolId:
          req.user.schoolId,

        studentId,

        studentFeeProfileId,

        feeAssignmentIds,

        amount,

        paymentMethod:
          "CASH",

        gateway:
          "MANUAL",

        createdBy:
          req.user._id,

        req
      });



    // ======================
    // COMPLETE DIRECTLY
    // ======================

    const result =
      await completePayment({

        paymentOrderId:
          paymentOrder._id,

        verified: true,

        verificationSource:
          "MANUAL",

        feeItems,

        req
      });



    return res.status(200).json({

      success: true,

      message:
        "Cash payment collected",

      data: result
    });

  } catch (error) {

    console.error(

      "CASH PAYMENT ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message ||

        "Cash collection failed"
    });
  }
};



// ======================
// WEBHOOK
// ======================

const razorpayWebhook =
async (req, res) => {

  try {

    // ======================
    // SIGNATURE
    // ======================

    const signature =

      req.headers[
        "x-razorpay-signature"
      ];



    // ======================
    // RAW BODY
    // ======================

    const rawBody =
      req.body;



    // ======================
    // PARSE BODY
    // ======================

    const payload =
      rawBody.toString();



    const body =
      JSON.parse(payload);



    // ======================
    // EVENT
    // ======================

    const event =
      body.event;



    // ======================
    // PAYMENT ENTITY
    // ======================

    const paymentEntity =

      body.payload
      ?.payment
      ?.entity;



    if (!paymentEntity) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid webhook payload"
      });
    }



    // ======================
    // FIND ORDER
    // ======================

    const paymentOrder =
      await PaymentOrder.findOne({

        gatewayOrderId:
          paymentEntity.order_id
      });

    if (!paymentOrder) {

      return res.status(404).json({

        success: false,

        message:
          "Payment order not found"
      });
    }



    // ======================
    // VERIFY WEBHOOK
    // ======================

    const verified =

      await verifyWebhookSignature({

        schoolId:
          paymentOrder.schoolId,

        payload,

        signature
      });



    if (!verified) {

      return res.status(400).json({

        success: false,

        message:
          "Webhook verification failed"
      });
    }



    // ======================
    // SUCCESS EVENT
    // ======================

    if (
      event ===
      "payment.captured"
    ) {

      // PREVENT DUPLICATE
      if (
        paymentOrder.paymentStatus
        === "SUCCESS"
      ) {

        return res.status(200).json({

          success: true,

          message:
            "Already processed"
        });
      }



      // COMPLETE PAYMENT
      await completePayment({

        paymentOrderId:
          paymentOrder._id,

        gatewayPaymentId:
          paymentEntity.id,

        gatewayOrderId:
          paymentEntity.order_id,

        gatewaySignature:
          signature,

        transactionId:
          paymentEntity.id,

        verified: true,

        verificationSource:
          "WEBHOOK",

        feeItems: [],

        req
      });
    }



    // ======================
    // FAILED EVENT
    // ======================

    if (
      event ===
      "payment.failed"
    ) {

      await failPayment({

        paymentOrderId:
          paymentOrder._id,

        reason:
          paymentEntity
          ?.error_description ||

          "Payment failed",

        gatewayResponse:
          body
      });
    }



    return res.status(200).json({

      success: true
    });

  } catch (error) {

    console.error(

      "RAZORPAY WEBHOOK ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Webhook processing failed"
    });
  }
};


// ======================
// EXPORTS
// ======================

module.exports = {

  createOrder,

  verifyPayment,

  collectCashPayment,

  razorpayWebhook
};