// ======================================================
// ADD THIS IMPORT AT TOP
// ======================================================

const Notification =
  require(
    "../models/Notification"
  );


const Homework =
  require("../models/Homework");

const HomeworkQuestion =
  require("../models/HomeworkQuestion");

const HomeworkSubmission =
  require("../models/HomeworkSubmission");

const Parent =
  require("../models/Parent");

const Student =
  require("../models/Student");

  // ======================================================
// SUBMIT HOMEWORK
// ======================================================

const submitHomework =
  async (req, res) => {

    try {

      const homework =
        await Homework.findById(

          req.params.id
        );

      if (!homework) {

        return res.status(404).json({

          success: false,

          msg:
            "Homework not found"
        });
      }

      const alreadySubmitted =

        homework.submittedBy?.find(

          (item) =>

            String(
              item.parentId
            ) ===

            String(
              req.user._id
            )
        );

      if (
        alreadySubmitted
      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Already submitted"
        });
      }

      homework.submittedBy.push({

        parentId:
          req.user._id,

        studentId:
          req.body.studentId,

        submittedAt:
          new Date()
      });

      await homework.save();

      return res.status(200).json({

        success: true,

        msg:
          "Homework submitted"
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to submit homework"
      });
    }
  };

// ======================================================
// GET CHILD HOMEWORKS
// ======================================================

const getChildHomeworks =
  async (req, res) => {

    try {

      // ======================================================
      // FIND PARENT
      // ======================================================

      const parent =
        await Parent.findOne({

          _id:
            req.user._id,

          schoolId:
            req.user.schoolId
        });

      // ======================================================
      // NOT FOUND
      // ======================================================

      if (!parent) {

        return res.status(404).json({

          success: false,

          msg:
            "Parent not found"
        });
      }

      // ======================================================
      // CHILD ARRAY
      // ======================================================

      const childrenIds =

        Array.isArray(
          parent.children
        )

          ? parent.children

          : [];

      // ======================================================
      // FIND CHILDREN
      // ======================================================

      const children =
        await Student.find({

          _id: {

            $in:
              childrenIds
          },

          schoolId:
            req.user.schoolId
        });

      // ======================================================
      // IDS
      // ======================================================

      const sectionIds =
        children.map(

          (child) =>
            child.sectionId
        );

      const studentIds =
        children.map(

          (child) =>
            child._id
        );

      // ======================================================
      // FETCH HOMEWORKS
      // ======================================================

      const homeworks =
        await Homework.find({

          schoolId:
            req.user.schoolId,

          isDeleted: false,

          $or: [

            {

              sectionIds: {

                $in:
                  sectionIds
              }
            },

            {

              studentIds: {

                $in:
                  studentIds
              }
            }
          ]
        })

        .populate(

          "subjectId",

          "name code"
        )

        .populate(

          "teacherId",

          "fullName"
        )

        .sort({

          createdAt: -1
        });

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(200).json({

        success: true,

        children,

        homeworks
      });

    } catch (error) {

      console.log(
        "GET CHILD HOMEWORKS ERROR:"
      );

      console.log(error);

      console.log(
        error.stack
      );

      return res.status(500).json({

        success: false,

        msg:
          error.message ||

          "Failed to load homeworks"
      });
    }
  };

// ======================================================
// ASK HOMEWORK QUESTION
// ======================================================

const askHomeworkQuestion =
  async (req, res) => {

    try {

      // ======================================================
      // BODY
      // ======================================================

      const {

        homeworkId,

        studentId,

        question

      } = req.body;

      console.log(
        "QUESTION BODY:",
        req.body
      );

      // ======================================================
      // VALIDATION
      // ======================================================

      if (

        !homeworkId ||

        !studentId ||

        !question
      ) {

        return res.status(400).json({

          success: false,

          msg:
            "All fields required"
        });
      }

      // ======================================================
      // FIND PARENT
      // ======================================================

      const parent =
        await Parent.findOne({

          _id:
            req.user._id,

          schoolId:
            req.user.schoolId
        });

      // ======================================================
      // NOT FOUND
      // ======================================================

      if (!parent) {

        return res.status(404).json({

          success: false,

          msg:
            "Parent not found"
        });
      }

      // ======================================================
      // CHILD ARRAY
      // ======================================================

      const childrenArray =

        Array.isArray(
          parent.children
        )

          ? parent.children

          : [];

      // ======================================================
      // VERIFY CHILD
      // ======================================================

      const isOwnChild =

        childrenArray.some(

          (id) =>

            id.toString() ===

            studentId.toString()
        );

      // ======================================================
      // ACCESS DENIED
      // ======================================================

      if (!isOwnChild) {

        return res.status(403).json({

          success: false,

          msg:
            "Access denied"
        });
      }

      // ======================================================
      // FIND STUDENT
      // ======================================================

      const student =
        await Student.findOne({

          _id:
            studentId,

          schoolId:
            req.user.schoolId
        });

      // ======================================================
      // STUDENT NOT FOUND
      // ======================================================

      if (!student) {

        return res.status(404).json({

          success: false,

          msg:
            "Student not found"
        });
      }

      // ======================================================
      // FIND HOMEWORK
      // ======================================================

      const homework =
        await Homework.findOne({

          _id:
            homeworkId,

          schoolId:
            req.user.schoolId
        });

      // ======================================================
      // HOMEWORK NOT FOUND
      // ======================================================

      if (!homework) {

        return res.status(404).json({

          success: false,

          msg:
            "Homework not found"
        });
      }

      // ======================================================
      // PUBLIC FAQ ID
      // ======================================================

      const totalQuestions =
        await HomeworkQuestion.countDocuments({

          schoolId:
            req.user.schoolId
        });

      const publicQuestionId =
        `FAQ-${1000 + totalQuestions + 1}`;

      // ======================================================
      // CREATE QUESTION
      // ======================================================

      const newQuestion =
        await HomeworkQuestion.create({

          schoolId:
            req.user.schoolId,

          homeworkId,

          parentId:
            req.user._id,

          studentId,

          teacherId:
            homework.teacherId,

          publicQuestionId,

          question,

          answer: "",

          isAnswered: false,

          isPublic: false,

          viewedByTeacher: false,

          viewedByParent: true,

          isDeleted: false
        });

      console.log(
        "QUESTION CREATED:",
        newQuestion._id
      );
      // ======================================================
// SAVE NOTIFICATION
// ======================================================

await Notification.create({

  schoolId:
    req.user.schoolId,

  userId:
    homework.teacherId,

  userRole:
    "teacher",

  title:
    "📚 New Homework Question",

  message:
    `${student.name} parent asked a homework question`,

  type:
    "homework_question",

  priority:
    "high",

  icon:
    "📚",

  relatedId:
    homework._id,

  relatedModel:
    "Homework",

  actionText:
    "View Question",

  isRead: false,

  isRealtime: true
});

      // ======================================================
      // SOCKET NOTIFICATION
      // ======================================================

      try {

        if (

          global.io &&

          homework.teacherId
        ) {

          const teacherRoom =

            homework.teacherId.toString();

          console.log(
            "=================================="
          );

          console.log(
            "EMITTING QUESTION NOTIFICATION TO:",
            teacherRoom
          );

          console.log(
            "=================================="
          );

          const clients =
            await global.io

              .in(
                teacherRoom
              )

              .fetchSockets();

          console.log(
            "CONNECTED CLIENTS:",
            clients.length
          );

          global.io.to(
            teacherRoom
          ).emit(

            "new_notification",

            {

              title:
                "📚 New Homework Question",

              message:
                `${student.name} parent asked a question`,

              type:
                "homework_question"
            }
          );

          console.log(
            "QUESTION NOTIFICATION SENT"
          );
        }

      } catch (socketError) {

        console.log(
          "SOCKET ERROR:"
        );

        console.log(
          socketError
        );
      }

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(201).json({

        success: true,

        msg:
          "Question submitted successfully",

        question:
          newQuestion
      });

    } catch (error) {

      console.log(
        "ASK QUESTION ERROR:"
      );

      console.log(error);

      console.log(
        error.stack
      );

      return res.status(500).json({

        success: false,

        msg:
          error.message ||

          "Failed to submit question"
      });
    }
  };
// ======================================================
// MARK HOMEWORK VIEWED
// ======================================================

const markHomeworkViewed =
  async (req, res) => {

    try {

      // ======================================================
      // HOMEWORK
      // ======================================================

      const homework =
        await Homework.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId
        });

      if (!homework) {

        return res.status(404).json({

          success: false,

          msg:
            "Homework not found"
        });
      }

      // ======================================================
      // PARENT
      // ======================================================

      const parent =
        await Parent.findOne({

          _id:
            req.user._id,

          schoolId:
            req.user.schoolId
        });

      if (!parent) {

        return res.status(404).json({

          success: false,

          msg:
            "Parent not found"
        });
      }

      // ======================================================
      // STUDENT ID
      // ======================================================

      const studentId =
        req.body.studentId;

      // ======================================================
      // DUPLICATE CHECK
      // ======================================================

      const alreadyViewed =

        homework.viewedBy.find(

          (item) =>

            item.parentId?.toString() ===

            req.user._id.toString()

            &&

            item.studentId?.toString() ===

            studentId?.toString()
        );

      // ======================================================
      // ADD VIEW ONLY ONCE
      // ======================================================

      if (!alreadyViewed) {

        homework.viewedBy.push({

          parentId:
            req.user._id,

          parentName:
            parent.fullName ||

            parent.name ||

            "Parent",

          studentId,

          viewedAt:
            new Date()
        });

        // ======================================================
        // TOTAL VIEWED
        // ======================================================

        homework.totalViewed =

          homework.viewedBy.length;

        await homework.save();

        // ======================================================
        // SAVE NOTIFICATION
        // ======================================================

        await Notification.create({

          schoolId:
            req.user.schoolId,

          userId:
            homework.teacherId,

          userRole:
            "teacher",

          title:
            "👀 Homework Viewed",

          message:
            `${parent.fullName || parent.name} viewed homework`,

          type:
            "homework_viewed",

          priority:
            "medium",

          icon:
            "👀",

          relatedId:
            homework._id,

          relatedModel:
            "Homework",

          actionText:
            "Open Homework",

          isRead: false,

          isRealtime: true
        });

        // ======================================================
        // SOCKET EVENT
        // ======================================================

        if (

          global.io &&

          homework.teacherId
        ) {

          global.io.to(

            homework.teacherId.toString()

          ).emit(

            "new_notification",

            {

              title:
                "👀 Homework Viewed",

              message:
                `${parent.fullName || parent.name} viewed homework`,

              type:
                "homework_viewed"
            }
          );
        }
      }

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(200).json({

        success: true,

        msg:
          "Homework viewed tracked"
      });

    } catch (error) {

      console.log(
        "MARK VIEW ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to track view"
      });
    }
  };

  // ======================================================
// ACKNOWLEDGE HOMEWORK
// ======================================================

const acknowledgeHomework =
  async (req, res) => {

    try {

      // ======================================================
      // HOMEWORK
      // ======================================================

      const homework =
        await Homework.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId
        });

      if (!homework) {

        return res.status(404).json({

          success: false,

          msg:
            "Homework not found"
        });
      }

      // ======================================================
      // PARENT
      // ======================================================

      const parent =
        await Parent.findOne({

          _id:
            req.user._id,

          schoolId:
            req.user.schoolId
        });

      if (!parent) {

        return res.status(404).json({

          success: false,

          msg:
            "Parent not found"
        });
      }

      // ======================================================
      // STUDENT ID
      // ======================================================

      const studentId =
        req.body.studentId;

      // ======================================================
      // DUPLICATE CHECK
      // ======================================================

      const alreadyAcknowledged =

        homework.acknowledgedBy.find(

          (item) =>

            item.parentId?.toString() ===

            req.user._id.toString()

            &&

            item.studentId?.toString() ===

            studentId?.toString()
        );

      // ======================================================
      // ADD ONLY ONCE
      // ======================================================

      if (!alreadyAcknowledged) {

        homework.acknowledgedBy.push({

          parentId:
            req.user._id,

          parentName:
            parent.fullName ||

            parent.name ||

            "Parent",

          studentId,

          acknowledgedAt:
            new Date()
        });

        // ======================================================
        // TOTAL ACKNOWLEDGED
        // ======================================================

        homework.totalAcknowledged =

          homework.acknowledgedBy.length;

        await homework.save();

        // ======================================================
        // SAVE NOTIFICATION
        // ======================================================

        await Notification.create({

          schoolId:
            req.user.schoolId,

          userId:
            homework.teacherId,

          userRole:
            "teacher",

          title:
            "✅ Homework Acknowledged",

          message:
            `${parent.fullName || parent.name} acknowledged homework`,

          type:
            "homework_acknowledged",

          priority:
            "high",

          icon:
            "✅",

          relatedId:
            homework._id,

          relatedModel:
            "Homework",

          actionText:
            "Open Homework",

          isRead: false,

          isRealtime: true
        });

        // ======================================================
        // SOCKET
        // ======================================================

        if (

          global.io &&

          homework.teacherId
        ) {

          global.io.to(

            homework.teacherId.toString()

          ).emit(

            "new_notification",

            {

              title:
                "✅ Homework Acknowledged",

              message:
                `${parent.fullName || parent.name} acknowledged homework`,

              type:
                "homework_acknowledged"
            }
          );
        }
      }

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(200).json({

        success: true,

        msg:
          "Homework acknowledged"
      });

    } catch (error) {

      console.log(
        "ACKNOWLEDGE ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to acknowledge homework"
      });
    }
  };

// ======================================================
// GET HOMEWORK FAQ
// ======================================================

const getHomeworkFAQ =
  async (req, res) => {

    try {

      const questions =
        await HomeworkQuestion.find({

          homeworkId:
            req.params.id,

          schoolId:
            req.user.schoolId,

          isPublic: true,

          isDeleted: false
        })

        .sort({

          createdAt: -1
        });

      return res.status(200).json({

        success: true,

        questions
      });

    } catch (error) {

      console.log(
        "GET FAQ ERROR:"
      );

      console.log(error);

      return res.status(500).json({

        success: false,

        msg:
          "Failed to load FAQ"
      });
    }
  };

// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  getChildHomeworks,

  askHomeworkQuestion,

  markHomeworkViewed,

  acknowledgeHomework,

  submitHomework,

  getHomeworkFAQ
};