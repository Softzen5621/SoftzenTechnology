const crypto =
require("crypto");

const Razorpay =
require("razorpay");

const SchoolPaymentGateway =
require(
  "../models/SchoolPaymentGateway"
);

const {

  decrypt

} = require(
  "../utils/encryption"
);



// ======================
// GET RAZORPAY INSTANCE
// ======================

const getRazorpayInstance =
async (schoolId) => {

  try {

    // ======================
    // GET CONFIG
    // ======================

    const config =
      await SchoolPaymentGateway.findOne({

        schoolId,

        provider:
          "RAZORPAY",

        active: true,

        isDeleted: false
      });




    // ======================
    // NOT CONFIGURED
    // ======================

    if (!config) {

      console.warn(

        "⚠ Razorpay not configured for school:",

        schoolId
      );



      return {

        success: false,

        razorpay: null,

        config: null,

        message:
          "Razorpay not configured"
      };
    }




    // ======================
    // SECRET
    // ======================

    let secretKey =
      config.encryptedSecretKey;



    // ======================
    // TRY DECRYPT
    // ======================

    try {

      secretKey =
        decrypt(

          config
          .encryptedSecretKey
        );

    } catch (decryptError) {

      console.warn(

        "⚠ Secret decrypt failed, using raw key"
      );
    }




    // ======================
    // VALIDATION
    // ======================

    if (

      !config.publicKey ||

      !secretKey

    ) {

      console.warn(

        "⚠ Razorpay keys missing"
      );



      return {

        success: false,

        razorpay: null,

        config: null,

        message:
          "Razorpay keys missing"
      };
    }




    // ======================
    // INSTANCE
    // ======================

    const razorpay =
      new Razorpay({

        key_id:
          config.publicKey,

        key_secret:
          secretKey
      });




    return {

      success: true,

      razorpay,

      config
    };

  } catch (error) {

    console.error(

      "RAZORPAY INSTANCE ERROR:",

      error
    );



    return {

      success: false,

      razorpay: null,

      config: null,

      message:
        error.message
    };
  }
};



// ======================
// CREATE ORDER
// ======================

const createRazorpayOrder =
async ({

  schoolId,

  amount,

  internalOrderId,

  student

}) => {

  try {

    // ======================
    // INSTANCE
    // ======================

    const {

      success,

      razorpay,

      config,

      message

    } =

    await getRazorpayInstance(
      schoolId
    );




    // ======================
    // GATEWAY NOT READY
    // ======================

    if (

      !success ||

      !razorpay

    ) {

      throw new Error(

        message ||

        "Payment gateway unavailable"
      );
    }




    // ======================
    // CREATE ORDER
    // ======================

    const order =
      await razorpay.orders.create({

        amount:
          amount * 100,



        currency:
          "INR",



        receipt:
          internalOrderId,



        notes: {

          studentName:
            student?.name ||

            "",



          admissionNumber:
            student?.admissionNumber ||

            ""
        }
      });




    return {

      success: true,



      order,



      publicKey:
        config.publicKey
    };

  } catch (error) {

    console.error(

      "CREATE ORDER ERROR:",

      error
    );

    throw error;
  }
};



// ======================
// VERIFY SIGNATURE
// ======================

const verifyRazorpaySignature =
async ({

  schoolId,

  razorpayOrderId,

  razorpayPaymentId,

  razorpaySignature

}) => {

  try {

    const config =
      await SchoolPaymentGateway.findOne({

        schoolId,

        provider:
          "RAZORPAY",

        active: true,

        isDeleted: false
      });




    if (!config) {

      return false;
    }




    let secretKey =
      config.encryptedSecretKey;



    try {

      secretKey =
        decrypt(

          config
          .encryptedSecretKey
        );

    } catch (error) {

      console.warn(

        "⚠ Signature decrypt fallback"
      );
    }




    const body =

      razorpayOrderId +

      "|" +

      razorpayPaymentId;




    const expectedSignature =

      crypto

      .createHmac(

        "sha256",

        secretKey
      )

      .update(body.toString())

      .digest("hex");




    return (

      expectedSignature ===
      razorpaySignature
    );

  } catch (error) {

    console.error(

      "SIGNATURE VERIFY ERROR:",

      error
    );



    return false;
  }
};



// ======================
// VERIFY WEBHOOK
// ======================

const verifyWebhookSignature =
async ({

  schoolId,

  payload,

  signature

}) => {

  try {

    const config =
      await SchoolPaymentGateway.findOne({

        schoolId,

        provider:
          "RAZORPAY",

        active: true,

        isDeleted: false
      });




    if (!config) {

      return false;
    }




    let webhookSecret =
      config
      .encryptedWebhookSecret;




    try {

      webhookSecret =
        decrypt(

          config
          .encryptedWebhookSecret
        );

    } catch (error) {

      console.warn(

        "⚠ Webhook decrypt fallback"
      );
    }




    const generatedSignature =

      crypto

      .createHmac(

        "sha256",

        webhookSecret
      )

      .update(payload)

      .digest("hex");




    return (

      generatedSignature ===
      signature
    );

  } catch (error) {

    console.error(

      "WEBHOOK VERIFY ERROR:",

      error
    );



    return false;
  }
};



// ======================
// FETCH PAYMENT
// ======================

const fetchPaymentDetails =
async ({

  schoolId,

  paymentId

}) => {

  try {

    const {

      success,

      razorpay

    } =

    await getRazorpayInstance(
      schoolId
    );




    if (

      !success ||

      !razorpay

    ) {

      throw new Error(
        "Gateway unavailable"
      );
    }




    const payment =

      await razorpay.payments.fetch(
        paymentId
      );



    return payment;

  } catch (error) {

    console.error(

      "FETCH PAYMENT ERROR:",

      error
    );

    throw error;
  }
};



// ======================
// EXPORTS
// ======================

module.exports = {

  getRazorpayInstance,

  createRazorpayOrder,

  verifyRazorpaySignature,

  verifyWebhookSignature,

  fetchPaymentDetails
};