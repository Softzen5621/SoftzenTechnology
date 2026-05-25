const Homework =
  require("../models/Homework");

const Teacher =
  require("../models/Teacher");

const Student =
  require("../models/Student");

const Section =
  require("../models/Section");

const Subject =
  require("../models/Subject");

  const Notification =
  require(
    "../models/Notification"
  );

const Parent =
  require(
    "../models/Parent"
  );

  const HomeworkSubmission =
  require(
    "../models/HomeworkSubmission"
  );

const HomeworkQuestion =
  require(
    "../models/HomeworkQuestion"
  );

// ======================================================
// CREATE HOMEWORK
// ======================================================

const createHomework =
  async (req, res) => {

    try {

      const {

        title,
        description,
        instructions,

        subjectId,

        targetType,

        sectionIds,

        studentIds,

        dueDate,

        priority,

        totalMarks,

        allowLateSubmission,

        notifyParents,

        notifyStudents

      } = req.body;

      // ======================================================
      // VALIDATION
      // ======================================================

      if (

        !title ||

        !description ||

        !subjectId ||

        !dueDate

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Required fields missing"
        });
      }

      // ======================================================
      // FIND TEACHER
      // ======================================================

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

      // ======================================================
      // VALIDATE SUBJECT
      // ======================================================

      const subject =
        await Subject.findById(
          subjectId
        );

      if (!subject) {

        return res.status(404).json({

          success: false,

          msg:
            "Subject not found"
        });
      }

      // ======================================================
      // SAFE SECTIONS
      // ======================================================

      let safeSections =
        [];

      if (

        Array.isArray(
          sectionIds
        )

      ) {

        const sections =
          await Section.find({

            _id: {

              $in:
                sectionIds
            },

            schoolId:
              req.user.schoolId
          });

        safeSections =
          sections.map(
            (item) => item._id
          );
      }

      // ======================================================
      // SAFE STUDENTS
      // ======================================================

      let safeStudents =
        [];

      if (

        Array.isArray(
          studentIds
        )

      ) {

        const students =
          await Student.find({

            _id: {

              $in:
                studentIds
            },

            schoolId:
              req.user.schoolId
          });

        safeStudents =
          students.map(
            (item) => item._id
          );
      }

      // ======================================================
      // CREATE HOMEWORK
      // ======================================================

      const homework =
        await Homework.create({

          schoolId:
            req.user.schoolId,

          teacherId:
            teacher._id,

          title,

          description,

          instructions:
            instructions || "",

          subjectId,

          targetType:
            targetType || "section",

          sectionIds:
            safeSections,

          studentIds:
            safeStudents,

          dueDate,

          priority:
            priority || "medium",

          totalMarks:
            Number(
              totalMarks
            ) || 0,

          allowLateSubmission:

            allowLateSubmission !==
            false,

          notifyParents:

            notifyParents !==
            false,

          notifyStudents:

            notifyStudents !==
            false
        });

        // ======================================================
// AUTO NOTIFICATIONS
// ======================================================

try {

  // FIND STUDENTS

  const students =
    await Student.find({

      schoolId:
        req.user.schoolId,

      $or: [

        {

          sectionId: {

            $in:
              safeSections
          }
        },

        {

          _id: {

            $in:
              safeStudents
          }
        }
      ]
    });

  // STUDENT IDS

  const studentIds =
    students.map(
      (item) => item._id
    );

  // FIND PARENTS

  const parents =
    await Parent.find({

      schoolId:
        req.user.schoolId,

      children: {

        $in:
          studentIds
      }
    });

  // CREATE NOTIFICATIONS

  const notifications =
    parents.map(
      (parent) => ({

        schoolId:
          req.user.schoolId,

        userId:
          parent._id,

        userRole:
          "parent",

        title:
          "New Homework Assigned",

        message:
          `${title} homework has been assigned.`,

        type:
          "homework",

        link:
          "/parent/homework"
      })
    );

  // INSERT

  if (
    notifications.length
  ) {

    await Notification.insertMany(
      notifications
    );
  }

  // ======================================================
// REALTIME SOCKET NOTIFICATIONS
// ======================================================

parents.forEach(

  (parent) => {

    global.io.to(

      parent._id.toString()

    ).emit(

      "new_notification",

      {

        title:
          "New Homework Assigned",

        message:
          `${title} homework assigned`,

        type:
          "homework",

        link:
          "/parent/homework"
      }
    );
  }
);

} catch (notificationError) {

  console.log(
    "NOTIFICATION ERROR:"
  );

  console.log(
    notificationError
  );
}

      // ======================================================
      // POPULATE
      // ======================================================

      await homework.populate(

        "subjectId",

        "name code"
      );

      await homework.populate(

        "sectionIds",

        "className sectionName displayName"
      );

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(201).json({

        success: true,

        msg:
          "Homework created successfully",

        homework
      });

    } catch (error) {

      console.log(
        "CREATE HOMEWORK ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to create homework"
      });
    }
  };

  // ======================================================
// GET TEACHER HOMEWORKS
// ======================================================

const getTeacherHomeworks =
  async (req, res) => {

    try {

      const homeworksRaw =
        await Homework.find({

          schoolId:
            req.user.schoolId,

          teacherId:
            req.user._id,

          isDeleted: false
        })

        .populate(
          "subjectId",
          "name code"
        )

        .populate(
          "sectionIds",
          "className sectionName displayName"
        )

        .populate(
          "studentIds",
          "name fullName studentId rollNumber admissionNumber"
        )

        .populate({
          path:
            "viewedBy.studentId",

          select:
            "name fullName studentId rollNumber admissionNumber"
        })

        .populate({
          path:
            "acknowledgedBy.studentId",

          select:
            "name fullName studentId rollNumber admissionNumber"
        })

        .sort({
          createdAt: -1
        });

      // ======================================================
      // FORMAT DATA
      // ======================================================

      const homeworks =
        homeworksRaw.map(
          (item) => {

            // ============================================
            // ASSIGNED
            // ============================================

            const assignedStudents =
              item.studentIds || [];

            // ============================================
            // UNIQUE VIEWED
            // ============================================

            const viewedMap =
              new Map();

            (item.viewedBy || [])
            .forEach((view) => {

              if (
                !view.studentId
              ) return;

              const id =
                String(
                  view.studentId._id
                );

              if (
                !viewedMap.has(id)
              ) {

                viewedMap.set(
                  id,
                  true
                );
              }
            });

            // ============================================
            // UNIQUE ACKNOWLEDGED
            // ============================================

            const acknowledgedMap =
              new Map();

            (item.acknowledgedBy || [])
            .forEach((ack) => {

              if (
                !ack.studentId
              ) return;

              const id =
                String(
                  ack.studentId._id
                );

              if (
                !acknowledgedMap.has(id)
              ) {

                acknowledgedMap.set(
                  id,
                  true
                );
              }
            });

            // ============================================
            // RETURN
            // ============================================

           return {

  ...item.toObject(),

  // ============================================
  // COUNTS
  // ============================================

  assignedStudentsCount:
    assignedStudents.length,

  assignedCount:
    assignedStudents.length,

  viewedCount:
    viewedMap.size,

  totalViewed:
    viewedMap.size,

  acknowledgedCount:
    acknowledgedMap.size,

  totalAcknowledged:
    acknowledgedMap.size,

  submittedCount:
  item.submittedBy?.length || 0,

totalSubmitted:
  item.submittedBy?.length || 0
};
          }
        );

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(200).json({

        success: true,

        homeworks
      });

    } catch (error) {

      console.log(
        "GET HOMEWORKS ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch homeworks"
      });
    }
  };

// ======================================================
// DELETE HOMEWORK
// ======================================================

const deleteHomework =
  async (req, res) => {

    try {

      const homework =
        await Homework.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,

          teacherId:
            req.user._id
        });

      if (!homework) {

        return res.status(404).json({

          success: false,

          msg:
            "Homework not found"
        });
      }

      homework.isDeleted =
        true;

      await homework.save();

      return res.status(200).json({

        success: true,

        msg:
          "Homework deleted successfully"
      });

    } catch (error) {

      console.log(
        "DELETE HOMEWORK ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to delete homework"
      });
    }
  };

// ======================================================
// GET SINGLE HOMEWORK
// ======================================================

const getSingleHomework =
  async (req, res) => {

    try {

      // ======================================================
      // FIND HOMEWORK
      // ======================================================

      const homework =
        await Homework.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId,

          isDeleted: false
        })

        // SUBJECT
        .populate(

          "subjectId",

          "name code"
        )

        // TEACHER
        .populate(

          "teacherId",

          "fullName employeeId"
        )

        // SECTIONS
        .populate(

          "sectionIds",

          "className sectionName displayName"
        )

        // ASSIGNED STUDENTS
        .populate({

          path: "studentIds",

          select:
            "name fullName email studentId rollNumber admissionNumber"
        })

        // VIEWED USERS
        .populate({

          path:
            "viewedBy.studentId",

          select:
            "name fullName studentId rollNumber admissionNumber"
        })

        .populate({

          path:
            "viewedBy.parentId",

          select:
            "name fatherName email"
        })

        // ACKNOWLEDGED USERS
        .populate({

          path:
            "acknowledgedBy.studentId",

          select:
            "name fullName studentId rollNumber admissionNumber"
        })

        .populate({

          path:
            "acknowledgedBy.parentId",

          select:
            "name fatherName email"
        })

        .populate({

  path:
    "submittedBy.parentId",

  select:
    "name fullName email"
})          

.populate({

  path:
    "submittedBy.studentId",

  select:
    "name fullName rollNumber studentId"
});

      // ======================================================
      // NOT FOUND
      // ======================================================

      if (!homework) {

        return res.status(404).json({

          success: false,

          msg:
            "Homework not found"
        });
      }

      // ======================================================
      // ASSIGNED STUDENTS
      // ======================================================

      const assignedStudents =
        (homework.studentIds || [])
        .map((student) => ({

          _id:
            student._id,

          name:

            student.name ||

            student.fullName ||

            "Student",

          studentId:

            student.rollNumber ||

            student.studentId ||

            student.admissionNumber ||

            "N/A",

          email:
            student.email || ""
        }));

      // ======================================================
      // UNIQUE VIEWED USERS
      // ======================================================

      const viewedMap =
        new Map();

      (homework.viewedBy || [])
      .forEach((item) => {

        if (
          !item.studentId
        ) return;

        const id =
          String(
            item.studentId._id
          );

        if (
          !viewedMap.has(id)
        ) {

          viewedMap.set(id, {

            _id:
              item.studentId._id,

            name:

              item.studentId.name ||

              item.studentId.fullName ||

              "Student",

            studentId:

              item.studentId.rollNumber ||

              item.studentId.studentId ||

              item.studentId.admissionNumber ||

              "N/A",

            viewedAt:
              item.viewedAt
          });
        }
      });

      const viewedUsers =
        Array.from(
          viewedMap.values()
        );

      // ======================================================
      // UNIQUE ACKNOWLEDGED USERS
      // ======================================================

      const acknowledgeMap =
        new Map();

      (homework.acknowledgedBy || [])
      .forEach((item) => {

        if (
          !item.studentId
        ) return;

        const id =
          String(
            item.studentId._id
          );

        if (
          !acknowledgeMap.has(id)
        ) {

          acknowledgeMap.set(id, {

            _id:
              item.studentId._id,

            name:

              item.studentId.name ||

              item.studentId.fullName ||

              "Student",

            studentId:

              item.studentId.rollNumber ||

              item.studentId.studentId ||

              item.studentId.admissionNumber ||

              "N/A",

            acknowledgedAt:
              item.acknowledgedAt
          });
        }
      });

      const acknowledgedUsers =
        Array.from(
          acknowledgeMap.values()
        );

      // ======================================================
      // SUBMISSIONS
      // ======================================================

      const submissions =
        await HomeworkSubmission.find({

          homeworkId:
            homework._id,

          schoolId:
            req.user.schoolId,

          isDeleted: false
        })

        .populate({

          path:
            "studentId",

          select:
            "name fullName studentId rollNumber admissionNumber"
        });

      // ======================================================
      // SUBMITTED USERS
      // ======================================================

      const submittedUsers =
        submissions.map((item) => ({

          _id:
            item.studentId?._id,

          name:

            item.studentId?.name ||

            item.studentId?.fullName ||

            "Student",

          studentId:

            item.studentId?.rollNumber ||

            item.studentId?.studentId ||

            item.studentId?.admissionNumber ||

            "N/A",

          submittedAt:
            item.submittedAt,

          marks:
            item.marks || 0,

          status:
            item.status || "submitted",
        
        grade:
  item.grade || "",

remark:
  item.remark || "",
        
        
        
          }));

      // ======================================================
      // NOT VIEWED USERS
      // ======================================================

      const viewedIds =
        viewedUsers.map(
          (item) =>
            String(item._id)
        );

      const notViewedUsers =
        assignedStudents.filter(

          (student) =>

            !viewedIds.includes(

              String(student._id)
            )
        );

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(200).json({

        success: true,

        homework: {

          ...homework.toObject(),

          assignedStudents,

          viewedUsers,

          acknowledgedUsers,

          submittedUsers,

          notViewedUsers,

          assignedCount:
            assignedStudents.length,

          viewedCount:
            viewedUsers.length,

          acknowledgedCount:
            acknowledgedUsers.length,

          submittedCount:
            submittedUsers.length,

          notViewedCount:
            notViewedUsers.length
        }
      });

    } catch (error) {

      console.log(
        "GET SINGLE HOMEWORK ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch homework"
      });
    }
  };


  // ======================================================
// GET HOMEWORK SUBMISSIONS
// ======================================================

const getHomeworkSubmissions =
  async (req, res) => {

    try {

      const submissions =
        await HomeworkSubmission.find({

          homeworkId:
            req.params.id,

          schoolId:
            req.user.schoolId,

          isDeleted: false
        })

        .populate(

          "studentId",

          "name studentId rollNumber"
        )

        .sort({

          submittedAt: -1
        });

      return res.status(200).json({

        success: true,

        submissions
      });

    } catch (error) {

      console.log(
        "GET SUBMISSIONS ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch submissions"
      });
    }
  };

// ======================================================
// GET HOMEWORK QUESTIONS
// ======================================================

const getHomeworkQuestions =
  async (req, res) => {

    try {

      const questions =
        await HomeworkQuestion.find({

          homeworkId:
            req.params.id,

          schoolId:
            req.user.schoolId,

          isDeleted: false
        })

        .populate(

          "studentId",

          "name studentId"
        )

        .populate(

          "parentId",

          "fatherName motherName"
        )

        .sort({

          createdAt: -1
        });

      return res.status(200).json({

        success: true,

        questions
      });

    } catch (error) {

      console.log(
        "GET QUESTIONS ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to fetch questions"
      });
    }
  };

  // ======================================================
// SAVE SUBMISSION REVIEW
// ======================================================
// ======================================================
// SAVE SUBMISSION REVIEW
// ======================================================

const saveSubmissionReview =
  async (req, res) => {

    try {

      const {

        homeworkId,

        studentId,

        grade,

        remark

      } = req.body;

      // ============================================
      // FIND SUBMISSION
      // ============================================

      const submission =
        await HomeworkSubmission.findOne({

          homeworkId,

          studentId,

          schoolId:
            req.user.schoolId,

          isDeleted: false
        });

      // ============================================
      // NOT FOUND
      // ============================================

      if (!submission) {

        return res.status(404).json({

          success: false,

          msg:
            "Submission not found"
        });
      }

      // ============================================
      // SAVE REVIEW
      // ============================================

      submission.grade =
        grade || "";

      submission.remark =
        remark || "";

      submission.reviewedAt =
        new Date();

      submission.reviewedBy =
        req.user._id;

      await submission.save();
      // ============================================
      // RESPONSE
      // ============================================

      return res.status(200).json({

        success: true,

        msg:
          "Review saved successfully"
      });

    } catch (error) {

      console.log(
        "SAVE REVIEW ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to save review"
      });
    }
  };
// ======================================================
// ANSWER QUESTION
// ======================================================

const answerHomeworkQuestion =
  async (req, res) => {

    try {

      const {

        answer,

        isPublic

      } = req.body;

      const question =
        await HomeworkQuestion.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId
        });

      if (!question) {

        return res.status(404).json({

          success: false,

          msg:
            "Question not found"
        });
      }

      question.answer =
        answer || "";

      question.isPublic =
        Boolean(isPublic);

      question.status =
        "answered";

      question.answeredAt =
        new Date();

      question.viewedByParent =
        false;

      await question.save();

      return res.status(200).json({

        success: true,

        msg:
          "Answer saved successfully"
      });

    } catch (error) {

      console.log(
        "ANSWER QUESTION ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to answer question"
      });
    }
  };
// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  createHomework,

  getTeacherHomeworks,

  saveSubmissionReview,

  deleteHomework,

  getSingleHomework,

  getHomeworkSubmissions,

  getHomeworkQuestions,

  answerHomeworkQuestion
};