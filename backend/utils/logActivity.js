const ActivityLog =
  require("../models/ActivityLog");

// ======================
// AUTO ACTIVITY LOGGER
// ======================

const logActivity =
  async ({

    req,

    actionType,

    module,

    description = "",

    documentId = "",

    collectionName = "",

    oldData = null,

    newData = null,

    changedFields = [],

    reason = "",

    isSensitive = false,

    severity = "LOW"
  }) => {

    try {

      // ======================
      // USER
      // ======================

      const user =
        req.user || {};

      // ======================
      // USER ID SUPPORT
      // ======================

      const userId =

        user._id ||

        user.id ||

        null;

      // DEBUG
      console.log(
        "LOG USER:",
        user
      );

      // ======================
      // SAFETY CHECK
      // ======================

      if (!userId) {

        console.error(
          "❌ USER ID NOT FOUND"
        );

        return;
      }

      // ======================
      // USER AGENT
      // ======================

      const userAgent =

        req.headers[
          "user-agent"
        ] || "";

      // ======================
      // CREATE LOG
      // ======================

      const log =
        await ActivityLog.create({

          // USER
          performedBy:
            userId,

          performedByName:
            user.name || "Unknown User",

          performedByRole:
            user.role || "Unknown",

          schoolId:
            user.schoolId || "",

          // ACTION
          actionType,

          module,

          description,

          // DOCUMENT
          documentId:
            documentId?.toString() || "",

          collectionName,

          // DATA
          oldData,

          newData,

          changedFields,

          // SECURITY
          reason,

          isSensitive,

          severity,

          // DEVICE
          ipAddress:

            req.ip ||

            req.connection
              ?.remoteAddress ||

            "",

          deviceInfo:
            userAgent,

          browser:
            userAgent
        });

      console.log(
        "✅ ACTIVITY LOG SAVED:",
        log._id
      );

    } catch (err) {

      console.error(
        "====================="
      );

      console.error(
        "❌ ACTIVITY LOG ERROR"
      );

      console.error(err);

      console.error(
        "====================="
      );
    }
  };

module.exports =
  logActivity;