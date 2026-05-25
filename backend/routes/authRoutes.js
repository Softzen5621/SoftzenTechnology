const express =
  require("express");

const authController =
  require(
    "../controllers/authController"
  );

const router =
  express.Router();

// ======================================================
// ADMIN AUTH
// ======================================================

router.post(

  "/register",

  authController.register
);

router.post(

  "/login",

  authController.login
);

// ======================================================
// TEACHER AUTH
// ======================================================

router.post(

  "/teacher-login",

  authController.teacherLogin
);

// ======================================================
// PARENT AUTH
// ======================================================

router.post(

  "/parent-login",

  authController.parentLogin
);

// ======================================================
// ADMIN FORGOT PASSWORD
// ======================================================

router.post(

  "/admin-forgot-password",

  authController.adminForgotPassword
);

// ======================================================
// ADMIN RESET PASSWORD
// ======================================================

router.post(

  "/admin-reset-password",

  authController.adminResetPassword
);

// ======================================================
// TEACHER FORGOT PASSWORD
// ======================================================

router.post(

  "/teacher-forgot-password",

  authController.teacherForgotPassword
);

// ======================================================
// TEACHER RESET PASSWORD
// ======================================================

router.post(

  "/teacher-reset-password",

  authController.teacherResetPassword
);

// ======================================================
// PARENT FORGOT PASSWORD
// ======================================================

router.post(

  "/parent-forgot-password",

  authController.parentForgotPassword
);

// ======================================================
// PARENT RESET PASSWORD
// ======================================================

router.post(

  "/parent-reset-password",

  authController.parentResetPassword
);

module.exports =
  router;