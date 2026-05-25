const ActivityLog =
  require("../models/ActivityLog");

// ======================
// GET ALL LOGS
// ======================

const getActivityLogs =
  async (req, res) => {

    try {

      // ======================
      // QUERY PARAMS
      // ======================

      const {

        page = 1,

        limit = 10,

        module,

        actionType,

        severity,

        search,

        startDate,

        endDate
      } = req.query;

      // ======================
      // FILTER
      // ======================

      const filter = {

        schoolId:
          req.user.schoolId
      };

      // MODULE
      if (module) {

        filter.module =
          module;
      }

      // ACTION
      if (actionType) {

        filter.actionType =
          actionType;
      }

      // SEVERITY
      if (severity) {

        filter.severity =
          severity;
      }

      // SEARCH
      if (search) {

        filter.$or = [

          {

            performedByName: {

              $regex: search,

              $options: "i"
            }
          },

          {

            description: {

              $regex: search,

              $options: "i"
            }
          },

          {

            module: {

              $regex: search,

              $options: "i"
            }
          }
        ];
      }

      // DATE FILTER
      if (

        startDate ||

        endDate
      ) {

        filter.createdAt = {};
      }

      if (startDate) {

        filter.createdAt.$gte =
          new Date(startDate);
      }

      if (endDate) {

        filter.createdAt.$lte =
          new Date(endDate);
      }

      // ======================
      // FETCH LOGS
      // ======================

      const logs =
        await ActivityLog.find(
          filter
        )

          .sort({

            createdAt: -1
          })

          .skip(

            (page - 1) * limit
          )

          .limit(
            Number(limit)
          );

      // ======================
      // TOTAL COUNT
      // ======================

      const total =
        await ActivityLog.countDocuments(
          filter
        );

      // ======================
      // RESPONSE
      // ======================

      res.json({

        success: true,

        total,

        currentPage:
          Number(page),

        totalPages:
          Math.ceil(
            total / limit
          ),

        logs
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({

        success: false,

        message:
          "Error fetching activity logs"
      });
    }
  };

// ======================
// EXPORTS
// ======================

module.exports = {

  getActivityLogs
};