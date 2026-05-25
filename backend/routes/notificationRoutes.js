const express =
  require("express");

const router =
  express.Router();

// ======================================================
// CONTROLLER
// ======================================================

const {

  getMyNotifications,

  markNotificationRead,

  markAllNotificationsRead,

  acknowledgeNotification,

  deleteNotification,

  clearAllNotifications,

  getUnreadNotificationCount

} = require(

  "../controllers/notificationController"
);

// ======================================================
// AUTH MIDDLEWARE
// ======================================================

const authMiddleware =
  require(
    "../middlewares/authMiddleware"
  );

// ======================================================
// GET MY NOTIFICATIONS
// ======================================================
// PURPOSE:
// Fetch all notifications
// for logged in user
// ======================================================

router.get(

  "/",

  authMiddleware,

  getMyNotifications
);

// ======================================================
// GET UNREAD COUNT
// ======================================================
// PURPOSE:
// Bell badge count
// ======================================================

router.get(

  "/unread-count",

  authMiddleware,

  getUnreadNotificationCount
);

// ======================================================
// MARK SINGLE READ
// ======================================================
// PURPOSE:
// Open notification
// ======================================================

router.put(

  "/read/:id",

  authMiddleware,

  markNotificationRead
);

// ======================================================
// MARK ALL READ
// ======================================================
// PURPOSE:
// Mark all notifications
// as read
// ======================================================

router.put(

  "/read-all",

  authMiddleware,

  markAllNotificationsRead
);

// ======================================================
// ACKNOWLEDGE NOTIFICATION
// ======================================================
// PURPOSE:
// Teacher clicks acknowledge
// notification disappears
// ======================================================

router.put(

  "/acknowledge/:id",

  authMiddleware,

  acknowledgeNotification
);

// ======================================================
// DELETE NOTIFICATION
// ======================================================
// PURPOSE:
// Delete single notification
// ======================================================

router.delete(

  "/:id",

  authMiddleware,

  deleteNotification
);

// ======================================================
// CLEAR ALL NOTIFICATIONS
// ======================================================
// PURPOSE:
// Remove all notifications
// ======================================================

router.delete(

  "/clear-all",

  authMiddleware,

  clearAllNotifications
);

// ======================================================
// TEST ROUTE
// ======================================================

router.get(

  "/test",

  (req, res) => {

    return res.status(200).json({

      success: true,

      msg:
        "Notification routes working"
    });
  }
);

// ======================================================
// EXPORT
// ======================================================

module.exports =
  router;