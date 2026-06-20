const Holiday =
  require("../models/Holiday");
const Attendance =
  require("../models/Attendance");

const Teacher =
  require("../models/Teacher");

const Student =
  require("../models/Student");

const Section =
  require("../models/Section");

// ======================================================
// DATE HELPER
// ======================================================

 exports.getStudentAttendanceHistory =
async (req,res)=>{

 try{

  const { studentId } = req.query;

  const attendance =
    await Attendance.find({

      schoolId:
        req.user.schoolId,

      studentId

    }).sort({
  attendanceDate: 1
});
  const totalPresent =
    attendance.filter(
      item =>
        item.status === "Present"
    ).length;

  const totalAbsent =
    attendance.filter(
      item =>
        item.status === "Absent"
    ).length;

  const totalLate =
    attendance.filter(
      item =>
        item.status === "Late"
    ).length;

  const totalHalfDay =
    attendance.filter(
      item =>
        item.status === "Half Day"
    ).length;

  const effectivePresent =

    totalPresent +
    totalLate +
    totalHalfDay;

  const attendancePercentage =

    attendance.length > 0

      ? (
          (
            effectivePresent /
            attendance.length
          ) * 100
        ).toFixed(1)

      : 0;

  return res.status(200).json({

    success:true,

    attendance,

    summary:{

      totalDays:
        attendance.length,

      totalPresent,

      totalAbsent,

      totalLate,

      totalHalfDay,

      attendancePercentage
    }
  });

 }catch(error){

  console.log(error);

  return res.status(500).json({

    success:false,

    msg:"Failed to fetch attendance history"
  });
 }
};


exports.getStudentAttendanceByDate =
async (req,res)=>{

 try{

  const {
    studentId,
    attendanceDate
  } = req.query;

  const attendanceDateString =
    new Date(attendanceDate)
      .toLocaleDateString(
        "en-CA",
        {
          timeZone:"Asia/Kolkata"
        }
      );

  const attendance =
    await Attendance.findOne({

      schoolId:
        req.user.schoolId,

      studentId,

      attendanceDateString
    });

  return res.status(200).json({

    success:true,

    attendance
  });

 }catch(error){

  console.log(error);

  return res.status(500).json({

    success:false
  });
 }
};


exports.getAttendanceStatusBulk =


async (req,res)=>{

 try{

  const {
    attendanceDate,
    studentIds
  } = req.body;

  if (
  !attendanceDate ||
  !studentIds ||
  !Array.isArray(studentIds)
) {
  return res.status(400).json({
    success:false,
    msg:"Invalid request"
  });
}
  const attendanceDateString =
    new Date(attendanceDate)
      .toLocaleDateString(
        "en-CA",
        {
          timeZone:"Asia/Kolkata"
        }
      );

  const attendance =
    await Attendance.find({

      schoolId:
        req.user.schoolId,

      attendanceDateString,

      studentId:{
        $in: studentIds
      }

    });

  return res.status(200).json({

    success:true,

    attendance
  });

 }catch(error){

  console.log(error);

  return res.status(500).json({

    success:false
  });
 }
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
const attendanceDateString =
  new Date(attendanceDate)
    .toLocaleDateString(
      "en-CA",
      {
        timeZone: "Asia/Kolkata"
      }
    );

    // ==============================================
// HOLIDAY VALIDATION
// ==============================================

const holiday =
  await Holiday.findOne({

    schoolId:
      req.user.schoolId,

    isActive: true,

    startDate: {
      $lte:
        new Date(attendanceDate)
    },

    endDate: {
      $gte:
        new Date(attendanceDate)
    }
  });

if (holiday) {

  return res.status(400).json({

    success: false,

    msg:
      `Attendance cannot be marked. Holiday: ${holiday.title}`
  });
}

// ==============================================
// FUTURE DATE VALIDATION
// ==============================================

const todayString =
  new Date()
    .toLocaleDateString(
      "en-CA",
      {
        timeZone:
          "Asia/Kolkata"
      }
    );

if (
  attendanceDateString >
  todayString
) {

  return res.status(400).json({

    success: false,

    msg:
      "Future attendance not allowed"
  });
}
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


      // ==============================================
      // CHECK EXISTING
      // ==============================================

      const existingAttendance =
        await Attendance.findOne({

          schoolId:
            req.user.schoolId,

          classId,

        attendanceDateString
        });

        for (
  const record
  of attendanceRecords
) {

if (
  record.status === "Absent" &&
  record.absentReason &&
  record.absentReason.length > 500
)



  {

    return res.status(400).json({

      success: false,

      msg:
        "Absent reason required"
    });
  }
}

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

  attendanceDateString
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
                    ),attendanceDateString,

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

      const attendanceDateString =
  new Date(attendanceDate)
    .toLocaleDateString(
      "en-CA",
      {
        timeZone: "Asia/Kolkata"
      }
    );
      // ==============================================
      // DATE RANGE
      // ==============================================




      // ==============================================
      // FIND EXISTING
      // ==============================================
const existingAttendance =
  await Attendance.findOne({

    schoolId:
      req.user.schoolId,

    classId,

    attendanceDateString
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

      const attendanceDateString =
  new Date(attendanceDate)
    .toLocaleDateString(
      "en-CA",
      {
        timeZone: "Asia/Kolkata"
      }
    );

      // ==============================================
      // FIND DATA
      // ==============================================
const attendance =
  await Attendance.find({

    schoolId:
      req.user.schoolId,

    classId,

    attendanceDateString
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

      const effectivePresent =

  totalPresent +
  totalLate +
  totalHalfDay;

const attendancePercentage =

  attendance.length > 0

    ? (
        (
          effectivePresent /
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
  exports.getAttendanceDashboard =
  async (req, res) => {

    try {

      const schoolId =
        req.user.schoolId;

     const todayString =
  new Date()
    .toLocaleDateString(
      "en-CA",
      {
        timeZone:
          "Asia/Kolkata"
      }
    );

const selectedDateString =
  req.query.date
    ? new Date(req.query.date)
        .toLocaleDateString(
          "en-CA",
          {
            timeZone:
              "Asia/Kolkata"
          }
        )
    : todayString;
      const totalStudents =
        await Student.countDocuments({

          schoolId,

          isActive: true
        });

      const totalClasses =
        await Section.countDocuments({

          schoolId,

          isActive: true
        });

      const todayAttendance =
        await Attendance.find({

          schoolId,
attendanceDateString:
selectedDateString
        });

       const markedStudents =
  todayAttendance.length; 

      const presentToday =
        todayAttendance.filter(
          item =>
            item.status === "Present" ||
            item.status === "Late" ||
            item.status === "Half Day"
        ).length;

      const absentToday =
        todayAttendance.filter(
          item =>
            item.status === "Absent"
        ).length;

      const lateEntries =
        todayAttendance.filter(
          item =>
            item.status === "Late"
        ).length;

      const markedClassIds =
        [
          ...new Set(

            todayAttendance.map(
              item =>
                item.classId.toString()
            )
          )
        ];

      const markedClasses =
        await Section.find({

          _id: {

            $in:
              markedClassIds
          }
        });

      const allClasses =
        await Section.find({

          schoolId,

          isActive: true
        });

      const pendingClasses =
        allClasses.filter(
          cls =>

            !markedClassIds.includes(
              cls._id.toString()
            )
        );

     const attendancePercentage =

  markedStudents > 0

    ? (
        (
          presentToday /
          markedStudents
        ) * 100
      ).toFixed(1)

    : 0;
      return res.status(200).json({

        success: true,

        stats: [

          {
            title:
              "Total Students",
            value:
              totalStudents
          },

          {
            title:
              "Present Today",
            value:
              presentToday
          },

          {
            title:
              "Absent Today",
            value:
              absentToday
          },

          {
            title:
              "Late Entries",
            value:
              lateEntries
          },

          {
            title:
              "Attendance %",
            value:
              `${attendancePercentage}%`
          },

          {
            title:
              "Classes Marked",
            value:
              markedClasses.length
          }

        ],

        markedClassList:
          markedClasses.map(
            cls =>
              cls.displayName
          ),

        pendingClassList:
          pendingClasses.map(
            cls =>
              cls.displayName
          ),

        markedCount:
          markedClasses.length,

        pendingCount:
          pendingClasses.length,

        totalClasses
      });

    } catch (error) {

      console.log(
        "ATTENDANCE DASHBOARD ERROR"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to load dashboard"
      });
    }
  };