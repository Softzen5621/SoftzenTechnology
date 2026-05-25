const express = require("express");

const {

  createNotice,

  getNotices,

  updateNotice,

  deleteNotice,

  markNoticeViewed,

  acknowledgeNotice,

} = require(
  "../controllers/noticeController"
);

const protect =
  require(
    "../middlewares/authMiddleware"
  );

const upload =
  require(
    "../middlewares/uploadMiddleware"
  );

const router =
  express.Router();


// ======================================
// CREATE NOTICE
// ======================================

router.post(

  "/create",

  protect,

  upload.single(
    "attachment"
  ),

  createNotice
);


// ======================================
// GET ALL NOTICES
// ======================================

router.get(

  "/",

  protect,

  getNotices
);


// ======================================
// MARK NOTICE VIEWED
// ======================================

router.put(

  "/view/:id",

  protect,

  markNoticeViewed
);


// ======================================
// ACKNOWLEDGE NOTICE
// ======================================

router.put(

  "/acknowledge/:id",

  protect,

  acknowledgeNotice
);


// ======================================
// UPDATE NOTICE
// ======================================

router.put(

  "/:id",

  protect,

  upload.single(
    "attachment"
  ),

  updateNotice
);


// ======================================
// DELETE NOTICE
// ======================================

router.delete(

  "/:id",

  protect,

  deleteNotice
);


// ======================================
// EXPORT ROUTER
// ======================================

module.exports =
  router;