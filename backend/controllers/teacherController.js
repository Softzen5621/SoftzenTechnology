const jwt =
  require("jsonwebtoken");

const bcrypt =
  require("bcryptjs");

const mongoose =
  require("mongoose");

const Teacher =
  require("../models/Teacher");

const Subject =
  require("../models/Subject");

const Section =
  require("../models/Section");

const Student =
  require("../models/Student");

  const Attendance =
  require("../models/Attendance");

const {

  generateEmployeeId,

  generatePassword,

} = require(
  "../utils/generateTeacherCredentials"
);

// ======================================================
// XLSX
// ======================================================

const XLSX =
  require("xlsx");


// ======================================================
// DOWNLOAD SAMPLE
// ======================================================

const downloadTeacherSample =
  async (req, res) => {

    try {

      const sampleData = [

        {

          "Full Name":
            "Lucky Sharma",

          Email:
            "lucky@gmail.com",

          Phone:
            "9876543210",

          Gender:
            "Male",

          DOB:
            "2001-08-08",

          Address:
            "Indore",

          "Joining Date":
            "2024-01-01",

          Qualification:
            "MCA",

          Experience:
            "2 Years",

          Salary:
            25000,

          Department:
            "Computer",

          "Teacher Type":
            "Full Time",

          Designation:
            "Teacher",

          Specialization:
            "ReactJS",

          Status:
            "Active",
        },
      ];


      const workbook =
        XLSX.utils.book_new();

      const worksheet =
        XLSX.utils.json_to_sheet(
          sampleData
        );

      XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Teachers"
      );


      const buffer =
        XLSX.write(

          workbook,

          {

            type: "buffer",

            bookType: "xlsx",
          }
        );


      res.setHeader(

        "Content-Disposition",

        "attachment; filename=teacher_sample.xlsx"
      );

      res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );


      return res.send(buffer);

    } catch (error) {

      console.log(
        "DOWNLOAD SAMPLE ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to download sample",
      });
    }
  };


// ======================================================
// IMPORT TEACHERS
// ======================================================

const importTeachers =
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Excel file required",
        });
      }


      const workbook =
        XLSX.read(
          req.file.buffer,
          {
            type: "buffer",
          }
        );


      const sheetName =
        workbook.SheetNames[0];


      const data =
        XLSX.utils.sheet_to_json(

          workbook.Sheets[sheetName]
        );


      let imported = 0;

      let duplicates = 0;

      let failed = 0;


      for (const row of data) {

        try {

          const existingTeacher =
            await Teacher.findOne({

              schoolId:
                req.user.schoolId,

              phone:
                String(
                  row.Phone || ""
                ),
            });


          if (existingTeacher) {

            duplicates++;

            continue;
          }


          const employeeId =
            await generateEmployeeId(
              Teacher
            );


          const plainPassword =
            generatePassword();


          const hashedPassword =
            await bcrypt.hash(
              plainPassword,
              10
            );


          await Teacher.create({

            schoolId:
              req.user.schoolId,

            employeeId,

            password:
              hashedPassword,

            role: "teacher",

            mustChangePassword:
              true,

            fullName:
              row["Full Name"] || "",

            email:
              row.Email || "",

            phone:
              String(
                row.Phone || ""
              ),

            gender:
              row.Gender || "Male",

            dob:
              row.DOB || "",

            address:
              row.Address || "",

            joiningDate:
              row["Joining Date"] || "",

            qualification:
              row.Qualification || "",

            experience:
              row.Experience || "",

            salary:
              Number(
                row.Salary
              ) || 0,

            department:
              row.Department || "Academic",

            teacherType:
              row["Teacher Type"] ||

              "Full Time",

            designation:
              row.Designation ||

              "Teacher",

            specialization:
              row.Specialization || "",

            status:
              row.Status || "Active",
          });


          imported++;

        } catch (error) {

          console.log(error);

          failed++;
        }
      }


      return res.status(200).json({

        success: true,

        message:
          "Teachers imported successfully",

        summary: {

          imported,

          duplicates,

          failed,
        },
      });

    } catch (error) {

      console.log(
        "IMPORT TEACHERS ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to import teachers",
      });
    }
  };


// ======================================================
// CREATE TEACHER
// ======================================================

const createTeacher =
  async (req, res) => {

    try {

      console.log(
        "REQ BODY:"
      );

      console.log(
        JSON.stringify(
          req.body,
          null,
          2
        )
      );


      const {

        fullName,
        email,
        phone,
        gender,
        dob,
        address,
        emergencyContact,

        joiningDate,
        qualification,
        experience,
        salary,
        department,
        teacherType,
        designation,
        specialization,
        status,

        assignedSubjects,
        assignedClasses,
        classTeacherOf,

      } = req.body;


      // ======================================================
      // VALIDATION
      // ======================================================

      if (!fullName || !phone) {

        return res.status(400).json({

          success: false,

          message:
            "Full name & phone required",
        });
      }


      if (!joiningDate) {

        return res.status(400).json({

          success: false,

          message:
            "Joining date required",
        });
      }


      // ======================================================
      // DUPLICATE CHECK
      // ======================================================

      const existingTeacher =
        await Teacher.findOne({

          schoolId:
            req.user.schoolId,

          $or: [

            { phone },

            ...(email
              ? [{ email }]
              : []),
          ],
        });


      if (existingTeacher) {

        let duplicateField =
          "Teacher";


        if (
          existingTeacher.phone ===
          phone
        ) {

          duplicateField =
            "Phone number";
        }

        else if (
          existingTeacher.email ===
          email
        ) {

          duplicateField =
            "Email";
        }


        return res.status(400).json({

          success: false,

          message:
            `${duplicateField} already exists`,
        });
      }


      // ======================================================
      // EMPLOYEE ID
      // ======================================================

      const employeeId =
        await generateEmployeeId(
          Teacher
        );


      // ======================================================
      // PASSWORD
      // ======================================================

      const plainPassword =
        generatePassword();


      const hashedPassword =
        await bcrypt.hash(
          plainPassword,
          10
        );


      // ======================================================
      // SAFE SUBJECTS
      // ======================================================

      const safeSubjects =

        Array.isArray(
          assignedSubjects
        )

          ? assignedSubjects.filter(

              (id) =>

                mongoose.Types.ObjectId.isValid(
                  id
                )
            )

          : [];


      // ======================================================
      // SAFE CLASSES
      // ======================================================

      let formattedClasses =
        [];


      if (
        Array.isArray(
          assignedClasses
        )
      ) {

        formattedClasses =

          assignedClasses

            .filter(

              (item) =>

                item?.classId &&

                mongoose.Types.ObjectId.isValid(
                  item.classId
                )
            )

            .map(
              (item) => ({

                classId:
                  item.classId,

                className:
                  item.className || "",

                section:
                  item.section || "",

                displayName:

                  item.section

                    ? `${item.className} - ${item.section}`

                    : item.className,

                isClassTeacher:

                  item.isClassTeacher ||
                  false,
              })
            );
      }


      // ======================================================
      // SAFE CLASS TEACHER
      // ======================================================

      let safeClassTeacher =
        {};


      if (
        classTeacherOf?.classId &&

        mongoose.Types.ObjectId.isValid(
          classTeacherOf.classId
        )
      ) {

        safeClassTeacher = {

          classId:
            classTeacherOf.classId,

          className:
            classTeacherOf.className || "",

          section:
            classTeacherOf.section || "",

          displayName:

            classTeacherOf.displayName ||

            (
              classTeacherOf.section

                ? `${classTeacherOf.className} - ${classTeacherOf.section}`

                : classTeacherOf.className
            ),
        };
      }


      // ======================================================
      // CREATE
      // ======================================================
console.log(
  "GENERATED EMPLOYEE ID:",
  employeeId
);
      const teacher =
        await Teacher.create({

          schoolId:
            req.user.schoolId,

          employeeId,

          password:
            hashedPassword,

          role: "teacher",

          mustChangePassword:
            true,

          // PERSONAL

          fullName,

          email:
            email || "",

          phone,

          gender:
            gender || "Male",

          dob:
            dob || null,

          address:
            address || "",

          emergencyContact:
            emergencyContact || "",

          // PROFESSIONAL

          joiningDate,

          qualification:
            qualification || "",

          experience:
            experience || "",

          salary:
            Number(salary) || 0,

          department:
            department || "Academic",

          teacherType:
            teacherType || "Full Time",

          designation:
            designation || "Teacher",

          specialization:
            specialization || "",

          status:
            status || "Active",

          isActive: true,

          // ACADEMIC

          assignedSubjects:
            safeSubjects,

          assignedClasses:
            formattedClasses,

          classTeacherOf:
            safeClassTeacher,
        });


      // ======================================================
      // POPULATE
      // ======================================================

      try {

        await teacher.populate(

          "assignedSubjects",

          "name code"
        );

      } catch (populateError) {

        console.log(
          "POPULATE ERROR:",
          populateError
        );
      }


      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(201).json({

        success: true,

        message:
          "Teacher created successfully",

        teacher,

        credentials: {

          teacherId:
            employeeId,

          password:
            plainPassword,
        },
      });

    } catch (error) {

      console.log(
        "CREATE TEACHER ERROR:"
      );

      console.log(error);

      console.log(
        error.stack
      );

      return res.status(500).json({

        success: false,

        message:
          error.message ||

          "Failed to create teacher",
      });
    }
  };


// ======================================================
// GET ALL TEACHERS
// ======================================================

const getTeachers =
  async (req, res) => {

    try {

      const teachers =
        await Teacher.find({

          schoolId:
            req.user.schoolId,

          isArchived: false,
        })

          .populate(

            "assignedSubjects",

            "name code department"
          )

          .sort({
            createdAt: -1,
          });


      return res.status(200).json({

        success: true,

        teachers,
      });

    } catch (error) {

      console.log(
        "GET TEACHERS ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch teachers",
      });
    }
  };


// ======================================================
// GET SINGLE TEACHER
// ======================================================

const getSingleTeacher =
  async (req, res) => {

    try {

      const teacher =
        await Teacher.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,
        })

          .populate(

            "assignedSubjects",

            "name code department"
          );


      if (!teacher) {

        return res.status(404).json({

          success: false,

          message:
            "Teacher not found",
        });
      }


      return res.status(200).json({

        success: true,

        teacher,
      });

    } catch (error) {

      console.log(
        "GET SINGLE TEACHER ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch teacher",
      });
    }
  };


// ======================================================
// UPDATE TEACHER
// ======================================================

const updateTeacher =
  async (req, res) => {

    try {

      const teacher =
        await Teacher.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,
        });


      if (!teacher) {

        return res.status(404).json({

          success: false,

          message:
            "Teacher not found",
        });
      }


      Object.assign(
        teacher,
        req.body
      );


      await teacher.save();


      return res.status(200).json({

        success: true,

        message:
          "Teacher updated successfully",

        teacher,
      });

    } catch (error) {

      console.log(
        "UPDATE TEACHER ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          error.message ||

          "Failed to update teacher",
      });
    }
  };


// ======================================================
// DELETE TEACHER
// ======================================================

const deleteTeacher =
  async (req, res) => {

    try {

      const teacher =
        await Teacher.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,
        });


      if (!teacher) {

        return res.status(404).json({

          success: false,

          message:
            "Teacher not found",
        });
      }


      teacher.isArchived =
        true;

      teacher.isActive =
        false;

      await teacher.save();


      return res.status(200).json({

        success: true,

        message:
          "Teacher archived successfully",
      });

    } catch (error) {

      console.log(
        "DELETE TEACHER ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to delete teacher",
      });
    }
  };


// ======================================================
// RESET PASSWORD
// ======================================================

const resetTeacherPassword =
  async (req, res) => {

    try {

      const teacher =
        await Teacher.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,
        });


      if (!teacher) {

        return res.status(404).json({

          success: false,

          message:
            "Teacher not found",
        });
      }


      const newPassword =
        generatePassword();


      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );


      teacher.password =
        hashedPassword;

      teacher.mustChangePassword =
        true;

      await teacher.save();


      return res.status(200).json({

        success: true,

        message:
          "Password reset successfully",

        credentials: {

          teacherId:
            teacher.employeeId,

          password:
            newPassword,
        },
      });

    } catch (error) {

      console.log(
        "RESET PASSWORD ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to reset password",
      });
    }
  };
 // ======================================================
// CHANGE TEACHER PASSWORD
// ======================================================

const changeTeacherPassword =
  async (req, res) => {

    try {

      const {

        currentPassword,

        newPassword

      } = req.body;

      // VALIDATION
      if (

        !currentPassword ||

        !newPassword

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "All fields required"
        });
      }

      // FIND TEACHER
      const teacher =
  await Teacher.findOne({

    _id:
      req.user._id,

    schoolId:
      req.user.schoolId
  })

  .select("+password");

      // NOT FOUND
      if (!teacher) {

        return res.status(404).json({

          success: false,

          msg:
            "Teacher not found"
        });
      }

      // CHECK OLD PASSWORD
      const isMatch =
        await bcrypt.compare(

          currentPassword,

          teacher.password
        );

      if (!isMatch) {

        return res.status(400).json({

          success: false,

          msg:
            "Current password incorrect"
        });
      }

      // HASH NEW PASSWORD
      const hashedPassword =
        await bcrypt.hash(

          newPassword,

          10
        );

      // UPDATE
      teacher.password =
        hashedPassword;

      teacher.mustChangePassword =
        false;

      await teacher.save();

      // RESPONSE
      return res.status(200).json({

        success: true,

        msg:
          "Password updated successfully"
      });

    } catch (error) {

      console.log(
        "CHANGE PASSWORD ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to update password"
      });
    }
  };
// ======================================================
// TEACHER DASHBOARD
// ======================================================

const getTeacherDashboard =
  async (req, res) => {

    try {

      // ==============================================
      // FIND TEACHER
      // ==============================================

      const teacher =
        await Teacher.findOne({

          _id:
            req.user._id,

          schoolId:
            req.user.schoolId

        })

        .populate(

          "assignedSubjects",

          "name code"
        );

      // ==============================================
      // NOT FOUND
      // ==============================================

      if (!teacher) {

        return res.status(404).json({

          success: false,

          msg:
            "Teacher not found"
        });
      }

      // ==============================================
      // TOTAL STUDENTS
      // ==============================================

      const classIds =

        teacher.assignedClasses.map(
          (item) => item.classId
        );

      const totalStudents =
        await Student.countDocuments({

          schoolId:
            req.user.schoolId,

          sectionId: {

            $in: classIds
          }
        });

      // ==============================================
      // TODAY ATTENDANCE
      // ==============================================

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const todayAttendance =
        await Attendance.countDocuments({

          schoolId:
            req.user.schoolId,

          teacherId:
            req.user._id,

          attendanceDate:
            today
        });

      // ==============================================
      // RESPONSE
      // ==============================================

      return res.status(200).json({

        success: true,

        dashboard: {

          teacher: {

            _id:
              teacher._id,

            fullName:
              teacher.fullName,

            employeeId:
              teacher.employeeId,

            email:
              teacher.email,

            phone:
              teacher.phone,

            designation:
              teacher.designation,

            department:
              teacher.department,

            profileImage:
              teacher.profileImage
          },

          assignedClasses:
            teacher.assignedClasses,

          assignedSubjects:
            teacher.assignedSubjects,

          classTeacherOf:
            teacher.classTeacherOf,

          stats: {

            totalClasses:

              teacher.assignedClasses
                ?.length || 0,

            totalSubjects:

              teacher.assignedSubjects
                ?.length || 0,

            totalStudents,

            todayAttendance
          }
        }
      });

    } catch (error) {

      console.log(
        "TEACHER DASHBOARD ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to load dashboard"
      });
    }
  };
  // ======================================================
// GET TEACHER CLASSES
// ======================================================

const getTeacherClasses =
  async (req, res) => {

    try {

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

      // ==============================================
      // NOT FOUND
      // ==============================================

      if (!teacher) {

        return res.status(404).json({

          success: false,

          msg:
            "Teacher not found"
        });
      }

      // ==============================================
      // PREPARE DATA
      // ==============================================

      const classes =
        await Promise.all(

          teacher.assignedClasses.map(

            async (item) => {

              // TOTAL STUDENTS
              const totalStudents =
                await Student.countDocuments({

                  schoolId:
                    req.user.schoolId,

                  sectionId:
                    item.classId
                });

              return {

                classId:
                  item.classId,

                className:
                  item.className,

                section:
                  item.section,

                displayName:
                  item.displayName,

                isClassTeacher:
                  item.isClassTeacher,

                totalStudents
              };
            }
          )
        );

      // ==============================================
      // RESPONSE
      // ==============================================

      return res.status(200).json({

        success: true,

        classes
      });

    } catch (error) {

      console.log(
        "GET TEACHER CLASSES ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to load classes"
      });
    }
  };

// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  createTeacher,

  getTeachers,

  getSingleTeacher,

  updateTeacher,

  deleteTeacher,

  resetTeacherPassword,

  importTeachers,

  downloadTeacherSample,

  changeTeacherPassword,

  getTeacherDashboard,

  getTeacherClasses
};