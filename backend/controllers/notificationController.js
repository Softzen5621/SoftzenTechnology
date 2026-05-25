const Notification =
  require(
    "../models/Notification"
  );

// ======================================================
// GET MY NOTIFICATIONS
// ======================================================

const getMyNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({

          schoolId:
            req.user.schoolId,

          userId:
            req.user._id,

          isDeleted: false
        })

          .sort({

            createdAt: -1
          })

          .limit(100);

      // ======================================================
      // COUNTS
      // ======================================================

      const unreadCount =
        notifications.filter(

          (item) =>
            !item.isRead
        ).length;

      const acknowledgedCount =
        notifications.filter(

          (item) =>
            item.isAcknowledged
        ).length;

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(200).json({

        success: true,

        notifications,

        unreadCount,

        acknowledgedCount
      });

    } catch (error) {

      console.log(
        "GET NOTIFICATIONS ERROR:"
      );

      console.log(error);

      console.log(
        error.stack
      );

      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch notifications"
      });
    }
  };


// ======================================================
// GET UNREAD COUNT
// ======================================================

const getUnreadNotificationCount =
  async (req, res) => {

    try {

      const unreadCount =
        await Notification.countDocuments({

          schoolId:
            req.user.schoolId,

          userId:
            req.user._id,

          isDeleted: false,

          isRead: false
        });

      return res.status(200).json({

        success: true,

        unreadCount
      });

    } catch (error) {

      console.log(
        "UNREAD COUNT ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch unread count"
      });
    }
  };


// ======================================================
// MARK SINGLE READ
// ======================================================

const markNotificationRead =
  async (req, res) => {

    try {

      const notification =
        await Notification.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,

          userId:
            req.user._id,

          isDeleted: false
        });

      // ======================================================
      // NOT FOUND
      // ======================================================

      if (!notification) {

        return res.status(404).json({

          success: false,

          msg:
            "Notification not found"
        });
      }

      // ======================================================
      // PREVENT DUPLICATE READ
      // ======================================================

      if (!notification.isRead) {

        notification.isRead =
          true;

        notification.readAt =
          new Date();

        await notification.save();
      }

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(200).json({

        success: true,

        msg:
          "Notification marked as read",

        notification
      });

    } catch (error) {

      console.log(
        "MARK READ ERROR:"
      );

      console.log(error);

      console.log(
        error.stack
      );

      return res.status(500).json({

        success: false,

        msg:
          "Failed to update notification"
      });
    }
  };


// ======================================================
// MARK ALL READ
// ======================================================

const markAllNotificationsRead =
  async (req, res) => {

    try {

      await Notification.updateMany(

        {

          schoolId:
            req.user.schoolId,

          userId:
            req.user._id,

          isRead: false,

          isDeleted: false
        },

        {

          $set: {

            isRead: true,

            readAt:
              new Date()
          }
        }
      );

      return res.status(200).json({

        success: true,

        msg:
          "All notifications marked as read"
      });

    } catch (error) {

      console.log(
        "MARK ALL READ ERROR:"
      );

      console.log(error);

      console.log(
        error.stack
      );

      return res.status(500).json({

        success: false,

        msg:
          "Failed to update notifications"
      });
    }
  };


// ======================================================
// ACKNOWLEDGE NOTIFICATION
// ======================================================

const acknowledgeNotification =
  async (req, res) => {

    try {

      const notification =
        await Notification.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,

          userId:
            req.user._id,

          isDeleted: false
        });

      // ======================================================
      // NOT FOUND
      // ======================================================

      if (!notification) {

        return res.status(404).json({

          success: false,

          msg:
            "Notification not found"
        });
      }

      // ======================================================
      // PREVENT DUPLICATE ACKNOWLEDGE
      // ======================================================

      if (
        !notification.isAcknowledged
      ) {

        notification.isRead =
          true;

        notification.readAt =
          new Date();

        notification.isAcknowledged =
          true;

        notification.acknowledgedAt =
          new Date();

        await notification.save();
      }

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(200).json({

        success: true,

        msg:
          "Notification acknowledged",

        notification
      });

    } catch (error) {

      console.log(
        "ACKNOWLEDGE ERROR:"
      );

      console.log(error);

      console.log(
        error.stack
      );

      return res.status(500).json({

        success: false,

        msg:
          "Failed to acknowledge notification"
      });
    }
  };


// ======================================================
// DELETE NOTIFICATION
// ======================================================

const deleteNotification =
  async (req, res) => {

    try {

      const notification =
        await Notification.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,

          userId:
            req.user._id
        });

      // ======================================================
      // NOT FOUND
      // ======================================================

      if (!notification) {

        return res.status(404).json({

          success: false,

          msg:
            "Notification not found"
        });
      }

      // ======================================================
      // SOFT DELETE
      // ======================================================

      notification.isDeleted =
        true;

      notification.deletedAt =
        new Date();

      await notification.save();

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(200).json({

        success: true,

        msg:
          "Notification deleted"
      });

    } catch (error) {

      console.log(
        "DELETE NOTIFICATION ERROR:"
      );

      console.log(error);

      console.log(
        error.stack
      );

      return res.status(500).json({

        success: false,

        msg:
          "Failed to delete notification"
      });
    }
  };


// ======================================================
// CLEAR ALL NOTIFICATIONS
// ======================================================

const clearAllNotifications =
  async (req, res) => {

    try {

      await Notification.updateMany(

        {

          schoolId:
            req.user.schoolId,

          userId:
            req.user._id,

          isDeleted: false
        },

        {

          $set: {

            isDeleted: true,

            deletedAt:
              new Date()
          }
        }
      );

      return res.status(200).json({

        success: true,

        msg:
          "All notifications cleared"
      });

    } catch (error) {

      console.log(
        "CLEAR ALL ERROR:"
      );

      console.log(error);

      console.log(
        error.stack
      );

      return res.status(500).json({

        success: false,

        msg:
          "Failed to clear notifications"
      });
    }
  };


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  getMyNotifications,

  getUnreadNotificationCount,

  markNotificationRead,

  markAllNotificationsRead,

  acknowledgeNotification,

  deleteNotification,

  clearAllNotifications
};