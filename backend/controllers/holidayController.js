const Holiday =
  require("../models/Holiday");

// ======================================================
// CREATE HOLIDAY
// ======================================================

exports.createHoliday =
  async (req, res) => {

    try {

      const {

        title,

        holidayType,

        startDate,

        endDate,

        description

      } = req.body;

      // ==============================================
      // VALIDATION
      // ==============================================

      if (

        !title ||

        !startDate ||

        !endDate

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Title, start date and end date required"
        });
      }

      // ==============================================
      // CREATE
      // ==============================================

      const holiday =
        await Holiday.create({

          schoolId:
            req.user.schoolId,

          title,

          holidayType,

          startDate,

          endDate,

          description
        });

      // ==============================================
      // RESPONSE
      // ==============================================

      return res.status(201).json({

        success: true,

        msg:
          "Holiday created successfully",

        holiday
      });

    } catch (error) {

      console.log(
        "CREATE HOLIDAY ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to create holiday"
      });
    }
  };

// ======================================================
// GET HOLIDAYS
// ======================================================

exports.getHolidays =
  async (req, res) => {

    try {

      const holidays =
        await Holiday.find({

          schoolId:
            req.user.schoolId,

          isActive: true
        })

        .sort({

          startDate: 1
        });

      return res.status(200).json({

        success: true,

        holidays
      });

    } catch (error) {

      console.log(
        "GET HOLIDAYS ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch holidays"
      });
    }
  };

// ======================================================
// CHECK HOLIDAY
// ======================================================

exports.checkHoliday =
  async (req, res) => {

    try {

      const { date } =
        req.query;

      if (!date) {

        return res.status(400).json({

          success: false,

          msg:
            "Date required"
        });
      }

      const selectedDate =
        new Date(date);

      const holiday =
        await Holiday.findOne({

          schoolId:
            req.user.schoolId,

          isActive: true,

          startDate: {

            $lte:
              selectedDate
          },

          endDate: {

            $gte:
              selectedDate
          }
        });

      return res.status(200).json({

        success: true,

        isHoliday:
          !!holiday,

        holiday
      });

    } catch (error) {

      console.log(
        "CHECK HOLIDAY ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to check holiday"
      });
    }
  };

// ======================================================
// DELETE HOLIDAY
// ======================================================

exports.deleteHoliday =
  async (req, res) => {

    try {

      const holiday =
        await Holiday.findByIdAndUpdate(

          req.params.id,

          {

            isActive: false
          },

          {

            new: true
          }
        );

      if (!holiday) {

        return res.status(404).json({

          success: false,

          msg:
            "Holiday not found"
        });
      }

      return res.status(200).json({

        success: true,

        msg:
          "Holiday deleted successfully"
      });

    } catch (error) {

      console.log(
        "DELETE HOLIDAY ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to delete holiday"
      });
    }
  };