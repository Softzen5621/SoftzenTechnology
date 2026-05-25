const Student =
  require("../models/Student");

const Teacher =
  require("../models/Teacher");

const FeeStructure =
  require("../models/FeeStructure");

const FeePayment =
  require("../models/FeePayment");

// ======================
// GET DASHBOARD STATS
// ======================

const getDashboardStats =
  async (req, res) => {

    try {

      // ======================
      // TOTAL STUDENTS
      // ======================

      const totalStudents =
        await Student.countDocuments();

      // ======================
      // TOTAL TEACHERS
      // ======================

      const totalTeachers =
        await Teacher.countDocuments();

      // ======================
      // TOTAL FEE STRUCTURES
      // ======================

      const totalFeeStructures =
        await FeeStructure.countDocuments();

      // ======================
      // TOTAL FEES AMOUNT
      // ======================

      const totalFees =
        await FeeStructure.aggregate([

          {

            $group: {

              _id: null,

              total: {

                $sum: "$amount"
              }
            }
          }
        ]);

      // ======================
      // TOTAL COLLECTED FEES
      // ======================

      const collectedFees =
        await FeePayment.aggregate([

          {

            $group: {

              _id: null,

              total: {

                $sum: "$amountPaid"
              }
            }
          }
        ]);

      // ======================
      // PENDING FEES
      // ======================

      const pendingFees =

        (

          totalFees[0]?.total || 0

        ) -

        (

          collectedFees[0]?.total || 0
        );

      // ======================
      // RECENT STUDENTS
      // ======================

      const recentStudents =
        await Student.find()

          .sort({

            createdAt: -1
          })

          .limit(5)

          .select(

            "name gender createdAt"
          );

      // ======================
      // RECENT PAYMENTS
      // ======================

      const recentPayments =
        await FeePayment.find()

          .sort({

            createdAt: -1
          })

          .limit(5);

      // ======================
      // RESPONSE
      // ======================

      res.json({

        success: true,

        stats: {

          totalStudents,

          totalTeachers,

          totalFeeStructures,

          totalFees:

            totalFees[0]?.total || 0,

          collectedFees:

            collectedFees[0]?.total || 0,

          pendingFees
        },

        recentStudents,

        recentPayments
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({

        success: false,

        message:
          "Dashboard server error"
      });
    }
  };

// ======================
// EXPORTS
// ======================

module.exports = {

  getDashboardStats
};