const Attendance =
  require("../models/Attendance");

const Teacher =
  require("../models/Teacher");

// ======================================================
// DATE HELPER
// ======================================================

const getDateRange =
  (date) => {

    const start =
      new Date(date);

    start.setHours(
      0,
      0,
      0,
      0
    );

    const end =
      new Date(date);

    end.setHours(
      23,
      59,
      59,
      999
    );

    return {

      start,

      end
    };
  };

// ======================================================
// MARK BULK ATTENDANCE
// ======================================================

exports.markAttendance =
  async (req, res) => {

    try {

      const {

        attendanceRecords,

        classId,

        className,

        section,

        attendanceDate

      } = req.body;

      // ==============================================
      // VALIDATION
      // ==============================================

      if (

        !attendanceRecords ||

        !Array.isArray(
          attendanceRecords
        ) ||

        attendanceRecords.length === 0
      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Attendance records required"
        });
      }

      // ==============================================
      // FIND TEACHER
      // ==============================================

      const teacher =
        await Teacher.findOne({

          _id:
            req.user._id,

          schoolId:
            req.user.schoolId
        });

      if (!teacher) {

        return res.status(404).json({

          success: false,

          msg:
            "Teacher not found"
        });
      }

      // ==============================================
      // DATE RANGE
      // ==============================================

      const {

        start,

        end

      } = getDateRange(
        attendanceDate
      );

      // ==============================================
      // CHECK EXISTING
      // ==============================================

      const existingAttendance =
        await Attendance.findOne({

          schoolId:
            req.user.schoolId,

          classId,

          attendanceDate: {

            $gte: start,

            $lte: end
          }
        });

      // ==============================================
      // BULK OPERATIONS
      // ==============================================

      const operations =
        attendanceRecords.map(
          (record) => ({

            updateOne: {

              filter: {

                schoolId:
                  req.user.schoolId,

                studentId:
                  record.studentId,

                attendanceDate:
                  new Date(
                    attendanceDate
                  )
              },

              update: {

                $set: {

                  schoolId:
                    req.user.schoolId,

                  studentId:
                    record.studentId,

                  classId,

                  className,

                  section,

                  teacherId:
                    req.user._id,

                  attendanceDate:
                    new Date(
                      attendanceDate
                    ),

                  status:
                    record.status,

                  absentReason:
                    record.absentReason || "",

                  remarks:
                    record.remarks || "",

                  isUpdated:
                    !!existingAttendance,

                  lastUpdatedBy:
                    req.user._id,

                  lastUpdatedAt:
                    new Date()
                },

                $inc: {

                  updatedCount:
                    existingAttendance
                      ? 1
                      : 0
                }
              },

              upsert: true
            }
          })
        );

      // ==============================================
      // SAVE
      // ==============================================

      await Attendance.bulkWrite(
        operations
      );

      // ==============================================
      // RESPONSE
      // ==============================================

      return res.status(200).json({

        success: true,

        alreadyMarked:
          !!existingAttendance,

        lastUpdatedAt:
          new Date(),

        msg:

          existingAttendance

            ? "Attendance updated successfully"

            : "Attendance saved successfully"
      });

    } catch (error) {

      console.log(
        "MARK ATTENDANCE ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to save attendance"
      });
    }
  };

// ======================================================
// CHECK ATTENDANCE EXISTS
// ======================================================

exports.checkAttendanceExists =
  async (req, res) => {

    try {

      const {

        classId,

        attendanceDate

      } = req.query;

      // ==============================================
      // VALIDATION
      // ==============================================

      if (

        !classId ||

        !attendanceDate
      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Class and attendance date required"
        });
      }

      // ==============================================
      // DATE RANGE
      // ==============================================

      const {

        start,

        end

      } = getDateRange(
        attendanceDate
      );

      // ==============================================
      // FIND EXISTING
      // ==============================================

      const existingAttendance =
        await Attendance.findOne({

          schoolId:
            req.user.schoolId,

          classId,

          attendanceDate: {

            $gte: start,

            $lte: end
          }
        })

        .sort({

          updatedAt: -1
        });

      // ==============================================
      // RESPONSE
      // ==============================================

      return res.status(200).json({

        success: true,

        alreadyMarked:
          !!existingAttendance,

        lastUpdatedAt:
          existingAttendance?.updatedAt || null,

        updatedCount:
          existingAttendance?.updatedCount || 0
      });

    } catch (error) {

      console.log(
        "CHECK ATTENDANCE ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to check attendance"
      });
    }
  };

// ======================================================
// GET CLASS ATTENDANCE
// ======================================================

exports.getAttendance =
  async (req, res) => {

    try {

      const {

        classId,

        attendanceDate

      } = req.query;

      // ==============================================
      // VALIDATION
      // ==============================================

      if (

        !classId ||

        !attendanceDate
      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Class and date required"
        });
      }

      // ==============================================
      // DATE RANGE
      // ==============================================

      const {

        start,

        end

      } = getDateRange(
        attendanceDate
      );

      // ==============================================
      // FIND DATA
      // ==============================================

      const attendance =
        await Attendance.find({

          schoolId:
            req.user.schoolId,

          classId,

          attendanceDate: {

            $gte: start,

            $lte: end
          }
        })

        .populate(

          "studentId",

          "name studentId"
        )

        .sort({

          createdAt: -1
        });

      // ==============================================
      // RESPONSE
      // ==============================================

      return res.status(200).json({

        success: true,

        attendance
      });

    } catch (error) {

      console.log(
        "GET ATTENDANCE ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch attendance"
      });
    }
  };

// ======================================================
// MONTHLY ATTENDANCE
// ======================================================

exports.getMonthlyAttendance =
  async (req, res) => {

    try {

      const {

        studentId,

        month,

        year

      } = req.query;

      // ==============================================
      // VALIDATION
      // ==============================================

      if (

        !studentId ||

        !month ||

        !year
      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Student, month and year required"
        });
      }

      // ==============================================
      // DATE RANGE
      // ==============================================

      const startDate =
        new Date(

          year,

          month - 1,

          1
        );

      const endDate =
        new Date(

          year,

          month,

          0
        );

      // ==============================================
      // FIND RECORDS
      // ==============================================

      const attendance =
        await Attendance.find({

          schoolId:
            req.user.schoolId,

          studentId,

          attendanceDate: {

            $gte:
              startDate,

            $lte:
              endDate
          }
        })

        .sort({

          attendanceDate: 1
        });

      // ==============================================
      // SUMMARY
      // ==============================================

      const totalPresent =
        attendance.filter(

          (item) =>

            item.status ===
            "Present"
        ).length;

      const totalAbsent =
        attendance.filter(

          (item) =>

            item.status ===
            "Absent"
        ).length;

      const totalLate =
        attendance.filter(

          (item) =>

            item.status ===
            "Late"
        ).length;

      const totalHalfDay =
        attendance.filter(

          (item) =>

            item.status ===
            "Half Day"
        ).length;

      const attendancePercentage =

        attendance.length > 0

          ? (
              (
                totalPresent /
                attendance.length
              ) * 100
            ).toFixed(1)

          : 0;

      // ==============================================
      // RESPONSE
      // ==============================================

      return res.status(200).json({

        success: true,

        summary: {

          totalDays:
            attendance.length,

          totalPresent,

          totalAbsent,

          totalLate,

          totalHalfDay,

          attendancePercentage
        },

        attendance
      });

    } catch (error) {

      console.log(
        "MONTHLY ATTENDANCE ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch monthly attendance"
      });
    }
  };