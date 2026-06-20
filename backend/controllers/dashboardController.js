const Student =
  require("../models/Student");

const Teacher =
  require("../models/Teacher");



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
      // EMPTY PAYMENTS
      // ======================

      const recentPayments = [];



      // ======================
      // RESPONSE
      // ======================

      res.json({

        success: true,

        stats: {

          totalStudents,

          totalTeachers,

          totalFeeStructures: 0,

          totalFees: 0,

          collectedFees: 0,

          pendingFees: 0
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