const Section =
  require("../models/Section");

const Teacher =
  require("../models/Teacher");

const Subject =
  require("../models/Subject");

const Student =
  require("../models/Student");

  const AcademicYear =
require(
  "../modules/academics/models/AcademicYear"
);


// ======================================================
// CLEAN PAYLOAD
// ======================================================

const cleanSectionPayload =
  (body = {}) => {

    const {
      schoolId,
      ...payload
    } = body;


    if (
      payload.className
    ) {

      payload.className =
        payload.className
          .trim();
    }


    if (
      payload.sectionName
    ) {

      payload.sectionName =
        payload.sectionName
          .trim();
    }


    return payload;
  };

// ======================================================
// GET ALL CLASSES / SECTIONS
// ======================================================

const getSections =
  async (req, res) => {

    try {

      const activeYear =
        await AcademicYear.findOne({

          schoolId:
            req.user.schoolId,

          isActive: true,

          isDeleted: false,
        });

      const sections =
        await Section.find({

          schoolId:
            req.user.schoolId,

          academicYear:
            activeYear?.name,
        })

          .populate(

            "classTeacher",

            `
            fullName
            profileImage
            phone
            email
            qualification
            experience
            `
          )

          .populate(

            "subjects.subjectId",

            `
            name
            code
            `
          )

          .populate(

            "subjects.teacherId",

            `
            fullName
            profileImage
            `
          )

          .sort({
            className: 1,
          });

      const enrichedSections =
        await Promise.all(

          sections.map(
            async (section) => {

              const studentCount =
                await Student.countDocuments({

                  schoolId:
                    req.user.schoolId,

                  sectionId:
                    section._id,
                });

              return {

                ...section.toObject(),

                totalStudents:
                  studentCount,
              };
            }
          )
        );

      res.status(200).json({

        success: true,

        activeYear:
          activeYear?.name,

        sections:
          enrichedSections,
      });

    } catch (err) {

      console.error(
        "GET SECTIONS ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          err.message ||

          "Error fetching classes",
      });
    }
  };

// ======================================================
// GET SINGLE SECTION
// ======================================================

const getSectionById =
  async (req, res) => {

    try {

      const section =
        await Section.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,
        })

          .populate(

            "classTeacher",

            `
            fullName
            profileImage
            phone
            email
            qualification
            experience
            department
            `
          )

          .populate(

            "subjects.subjectId",

            `
            name
            code
            `
          )

          .populate(

            "subjects.teacherId",

            `
            fullName
            profileImage
            phone
            email
            `
          );


      if (!section) {

        return res.status(404).json({

          success: false,

          msg:
            "Class not found",
        });
      }


      // ======================================================
      // STUDENTS
      // ======================================================

      const students =
        await Student.find({

          schoolId:
            req.user.schoolId,

          sectionId:
            section._id,
        })

        .select(

          `
          studentId
          rollNumber
          name
          gender
          mobile
          fatherName
          category
          photo
          feesStatus
          `
        )

        .sort({
          createdAt: -1,
        });


      // ======================================================
      // ANALYTICS
      // ======================================================

      const boys =
        students.filter(

          (s) =>
            s.gender === "Male"
        ).length;


      const girls =
        students.filter(

          (s) =>
            s.gender === "Female"
        ).length;


      res.status(200).json({

        success: true,

        section,

        students,

        analytics: {

          totalStudents:
            students.length,

          totalSubjects:
            section.subjects.length,

          boys,

          girls,
        },
      });

    } catch (err) {

      console.error(
        "GET SINGLE ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          err.message ||

          "Error fetching class",
      });
    }
  };


// ======================================================
// CREATE CLASS / SECTION
// ======================================================

const addSection =
  async (req, res) => {

    try {

      const {
        className,
        sectionName,
        classTeacher,
        subjects,
        roomNumber,
        academicYear,
        classType,
      } = cleanSectionPayload(
        req.body
      );

      const activeYear =
await AcademicYear.findOne({

  schoolId:
    req.user.schoolId,

  isActive: true,

  isDeleted: false
});


      // ======================================================
      // VALIDATION
      // ======================================================

      if (!className) {

        return res.status(400).json({

          success: false,

          msg:
            "Class name required",
        });
      }


      // ======================================================
      // DISPLAY NAME
      // ======================================================

      const displayName =

        sectionName

          ? `${className} - ${sectionName}`

          : className;


      // ======================================================
      // DUPLICATE CHECK
      // ======================================================

     const exists =
await Section.findOne({

  schoolId:
    req.user.schoolId,

  academicYear:
    academicYear ||

    activeYear?.name ||

    "",

  displayName,
});


      if (exists) {

        return res.status(400).json({

          success: false,

          msg:
            "Class already exists",
        });
      }


      // ======================================================
      // CREATE
      // ======================================================

      const section =
        await Section.create({

          schoolId:
            req.user.schoolId,

          className,

          sectionName:
            sectionName || "",

          displayName,

          classTeacher:
            classTeacher || null,

          subjects:
            subjects || [],

          roomNumber:
            roomNumber || "",
academicYear:
  academicYear ||

  activeYear?.name ||

  "",
          classType:
            classType || "Regular",

          status: "Active",

          isActive: true,
        });


      res.status(201).json({

        success: true,

        msg:
          "Class created successfully",

        section,
      });

    } catch (err) {

      console.error(
        "CREATE CLASS ERROR:",
        err
      );


      if (err.code === 11000) {

        return res.status(400).json({

          success: false,

          msg:
            "Duplicate class found",
        });
      }


      res.status(500).json({

        success: false,

        msg:
          err.message ||

          "Error creating class",
      });
    }
  };


// ======================================================
// UPDATE CLASS
// ======================================================

const updateSection =
  async (req, res) => {

    try {

      const payload =
        cleanSectionPayload(
          req.body
        );


      payload.displayName =

        payload.sectionName

          ? `${payload.className} - ${payload.sectionName}`

          : payload.className;


      const updated =
        await Section.findOneAndUpdate(

          {

            _id:
              req.params.id,

            schoolId:
              req.user.schoolId,
          },

          payload,

          {
            new: true,
          }
        );


      if (!updated) {

        return res.status(404).json({

          success: false,

          msg:
            "Class not found",
        });
      }


      res.status(200).json({

        success: true,

        msg:
          "Updated successfully",

        updated,
      });

    } catch (err) {

      console.error(
        "UPDATE ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          err.message ||

          "Update failed",
      });
    }
  };


// ======================================================
// DELETE CLASS
// ======================================================

const deleteSection =
  async (req, res) => {

    try {

      const studentCount =
        await Student.countDocuments({

          schoolId:
            req.user.schoolId,

          sectionId:
            req.params.id,
        });


      if (studentCount > 0) {

        return res.status(400).json({

          success: false,

          msg:
            "Cannot delete class with students",
        });
      }


      const deleted =
        await Section.findOneAndDelete({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,
        });


      if (!deleted) {

        return res.status(404).json({

          success: false,

          msg:
            "Class not found",
        });
      }


      res.status(200).json({

        success: true,

        msg:
          "Deleted successfully",
      });

    } catch (err) {

      console.error(
        "DELETE ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          err.message ||

          "Delete failed",
      });
    }
  };


// ======================================================
// ASSIGN CLASS TEACHER
// ======================================================

const assignClassTeacher =
  async (req, res) => {

    try {

      const {
        teacherId
      } = req.body;


      const section =
        await Section.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,
        });


      if (!section) {

        return res.status(404).json({

          success: false,

          msg:
            "Class not found",
        });
      }


      const teacher =
        await Teacher.findOne({

          _id:
            teacherId,

          schoolId:
            req.user.schoolId,
        });


      if (!teacher) {

        return res.status(404).json({

          success: false,

          msg:
            "Teacher not found",
        });
      }


      // ASSIGN

      section.classTeacher =
        teacher._id;

      await section.save();


      // UPDATE TEACHER SIDE

      teacher.classTeacherOf = {

        className:
          section.className,

        section:
          section.sectionName,
      };

      await teacher.save();


      res.status(200).json({

        success: true,

        msg:
          "Class teacher assigned successfully",
      });

    } catch (err) {

      console.error(
        "ASSIGN CLASS TEACHER ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          err.message,
      });
    }
  };


// ======================================================
// ASSIGN SUBJECT
// ======================================================

const assignSubject =
  async (req, res) => {

    try {

      const {
        subjectId,
        teacherId,
        weeklyLectures,
      } = req.body;


      const section =
        await Section.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,
        });


      if (!section) {

        return res.status(404).json({

          success: false,

          msg:
            "Class not found",
        });
      }


      const subject =
        await Subject.findById(
          subjectId
        );


      if (!subject) {

        return res.status(404).json({

          success: false,

          msg:
            "Subject not found",
        });
      }


      const teacher =
        await Teacher.findById(
          teacherId
        );


      if (!teacher) {

        return res.status(404).json({

          success: false,

          msg:
            "Teacher not found",
        });
      }


      // ======================================================
      // ALREADY EXISTS
      // ======================================================

      const alreadyExists =

        section.subjects.find(

          (item) =>

            item.subjectId
              ?.toString() ===
            subjectId
        );


      if (alreadyExists) {

        return res.status(400).json({

          success: false,

          msg:
            "Subject already assigned",
        });
      }


      // ======================================================
      // ADD SUBJECT
      // ======================================================

      section.subjects.push({

        subjectId,

        teacherId,

        weeklyLectures:
          weeklyLectures || 0,
      });


      await section.save();


      // ======================================================
      // UPDATE TEACHER SIDE
      // ======================================================

      if (

        !teacher.assignedSubjects.includes(
          subjectId
        )

      ) {

        teacher.assignedSubjects.push(
          subjectId
        );
      }


      const alreadyClassAssigned =

        teacher.assignedClasses.find(

          (c) =>

            c.className ===
              section.className &&

            c.section ===
              section.sectionName
        );


      if (
        !alreadyClassAssigned
      ) {

        teacher.assignedClasses.push({

          className:
            section.className,

          section:
            section.sectionName,

          isClassTeacher:
            false,
        });
      }


      await teacher.save();


      res.status(200).json({

        success: true,

        msg:
          "Subject assigned successfully",
      });

    } catch (err) {

      console.error(
        "ASSIGN SUBJECT ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          err.message,
      });
    }
  };


// ======================================================
// REMOVE SUBJECT
// ======================================================

const removeSubject =
  async (req, res) => {

    try {

      const {
        subjectId
      } = req.body;


      const section =
        await Section.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,
        });


      if (!section) {

        return res.status(404).json({

          success: false,

          msg:
            "Class not found",
        });
      }


      section.subjects =

        section.subjects.filter(

          (item) =>

            item.subjectId
              ?.toString() !==
            subjectId
        );


      await section.save();


      res.status(200).json({

        success: true,

        msg:
          "Subject removed successfully",
      });

    } catch (err) {

      console.error(
        "REMOVE SUBJECT ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          err.message,
      });
    }
  };


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  getSections,

  getSectionById,

  addSection,

  updateSection,

  deleteSection,

  assignClassTeacher,

  assignSubject,

  removeSubject,
};