const bcrypt =
  require("bcryptjs");

const Parent =
  require("../models/Parent");

const sendEmail =
  require("../utils/sendEmail");

const Section =
  require("../models/Section");

const Student =
  require("../models/Student");

const XLSX =
  require("xlsx");

const fs =
  require("fs");

// =====================================
// GENERATE STUDENT ID
// =====================================

const generateStudentId =
  async () => {

    let studentId = "";
    let exists = true;

    while (exists) {

      const random =
        Math.floor(
          1000 +
          Math.random() * 9000
        );

      studentId =
        `SI${random}`;

      const existing =
        await Student.findOne({
          studentId
        });

      exists = !!existing;
    }

    return studentId;
  };

// =====================================
// CLEAN PAYLOAD
// =====================================

const cleanPayload =
  (body = {}) => {

    const payload = {
      ...body
    };

    delete payload.schoolId;

    Object.keys(payload).forEach(

      (key) => {

        if (
          payload[key] === null ||
          payload[key] === undefined
        ) {

          payload[key] = "";
        }

        if (
          typeof payload[key] === "string"
        ) {

          payload[key] =
            payload[key].trim();
        }
      }
    );

    // NORMALIZE EMAILS

    if (
      payload.email
    ) {

      payload.email =
        payload.email
          .trim()
          .toLowerCase();
    }

    if (
      payload.parentEmail
    ) {

      payload.parentEmail =
        payload.parentEmail
          .trim()
          .toLowerCase();
    }

    return payload;
  };

// =====================================
// VALIDATE SECTION
// =====================================

const validateSection =
  async (
    sectionId,
    schoolId
  ) => {

    if (!sectionId)
      return false;

    const section =
      await Section.findOne({

        _id: sectionId,

        schoolId
      });

    return Boolean(section);
  };

// =====================================
// VALIDATE STUDENT
// =====================================

const validateStudent =
  async (
    payload,
    schoolId,
    editingId = null
  ) => {

    const errors = {};

    // PARENT EMAIL

    if (
      !payload.parentEmail
    ) {

      errors.parentEmail =
        "Parent email is required";
    }

    // NAME

    if (
      !payload.name
    ) {

      errors.name =
        "Student name is required";

    } else if (
      !/^[A-Za-z\s.-]+$/.test(
        payload.name
      )
    ) {

      errors.name =
        "Only letters allowed";
    }

    // GENDER

    if (
      !payload.gender
    ) {

      errors.gender =
        "Gender is required";
    }

    // DOB

    if (
      !payload.dob
    ) {

      errors.dob =
        "Date of birth is required";
    }

    // PARENT MOBILE

    if (
      payload.parentMobile &&
      !/^[6-9]\d{9}$/.test(
        payload.parentMobile
      )
    ) {

      errors.parentMobile =
        "Enter valid parent mobile";
    }

    // EMAIL

    if (
      payload.email &&
      !/^\S+@\S+\.\S+$/.test(
        payload.email
      )
    ) {

      errors.email =
        "Invalid email address";
    }

    // PARENT EMAIL

    if (
      payload.parentEmail &&
      !/^\S+@\S+\.\S+$/.test(
        payload.parentEmail
      )
    ) {

      errors.parentEmail =
        "Invalid parent email";
    }

    // SECTION

    if (
      !payload.sectionId
    ) {

      errors.sectionId =
        "Section is required";

    } else {

      const sectionValid =
        await validateSection(

          payload.sectionId,
          schoolId
        );

      if (!sectionValid) {

        errors.sectionId =
          "Invalid section selected";
      }
    }

    return errors;
  };

// =====================================
// GET ALL STUDENTS
// =====================================

const getStudents =
  async (req, res) => {

    try {

      const {

        classId,

        className,

        search,

        page = 1,

        limit = 50

      } = req.query;

      const filter = {

        schoolId:
          req.user.schoolId
      };

      // CLASS ID FILTER

      if (classId) {

        filter.sectionId = classId;

        const sectionExists =
          await Section.findOne({

            _id: classId,

            schoolId:
              req.user.schoolId
          });

        if (!sectionExists) {

          const matchingSections =
            await Section.find({

              schoolId:
                req.user.schoolId,

              $or: [

                {

                  className: {

                    $regex:
                      `^${classId}$`,

                    $options: "i"
                  }
                },

                {

                  displayName: {

                    $regex:
                      `^${classId}$`,

                    $options: "i"
                  }
                }
              ]
            });

          const sectionIds =
            matchingSections.map(
              (s) => s._id
            );

          filter.sectionId = {

            $in: sectionIds
          };
        }
      }

      // CLASS NAME FILTER

      if (className) {

        const matchingSections =
          await Section.find({

            schoolId:
              req.user.schoolId,

            $or: [

              {

                className: {

                  $regex:
                    `^${className}$`,

                  $options: "i"
                }
              },

              {

                displayName: {

                  $regex:
                    `^${className}$`,

                  $options: "i"
                }
              }
            ]
          });

        const sectionIds =
          matchingSections.map(
            (s) => s._id
          );

        filter.sectionId = {

          $in: sectionIds
        };
      }

      // SEARCH

      if (search) {

        filter.$or = [

          {

            name: {

              $regex:
                search,

              $options: "i"
            }
          },

          {

            studentId: {

              $regex:
                search,

              $options: "i"
            }
          },

          {

            mobile: {

              $regex:
                search,

              $options: "i"
            }
          }
        ];
      }

      // TOTAL

      const totalStudents =
        await Student.countDocuments(
          filter
        );

      // FETCH

      const students =
        await Student.find(
          filter
        )

          .populate(
            "sectionId",
            "className sectionName displayName"
          )

          .populate(
            "parentId",
            "fatherName motherName email mobile"
          )

          .sort({
            createdAt: -1
          })

          .skip(

            (Number(page) - 1) *

            Number(limit)
          )

          .limit(
            Math.min(
              Number(limit),
              100
            )
          );

      return res.status(200).json({

        success: true,

        totalStudents,

        currentPage:
          Number(page),

        totalPages:
          Math.ceil(
            totalStudents /
            Number(limit)
          ),

        students
      });

    } catch (err) {

      console.error(
        "GET STUDENTS ERROR:",
        err
      );

      return res.status(500).json({

        success: false,

        msg:
          err.message ||
          "Error fetching students"
      });
    }
  };

// =====================================
// GET SINGLE STUDENT
// =====================================

const getStudentById =
  async (req, res) => {

    try {

      const student =
        await Student.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId

        })

          .populate(
            "sectionId"
          )

          .populate(
            "parentId",
            "fatherName motherName email mobile"
          );

      if (!student) {

        return res.status(404).json({

          msg:
            "Student not found"
        });
      }

      res.json(student);

    } catch (err) {

      console.error(
        "GET STUDENT ERROR:",
        err
      );

      res.status(500).json({

        msg:
          err.message ||

          "Error fetching student"
      });
    }
  };

// =====================================
// GET STUDENTS BY SECTION
// =====================================

const getStudentsBySection =
  async (req, res) => {

    try {

      const students =
        await Student.find({

          schoolId:
            req.user.schoolId,

          sectionId:
            req.params.id
        })

        .populate(
          "sectionId",
          "className sectionName displayName"
        )

        .populate(
          "parentId",
          "fatherName motherName email mobile"
        );

      res.json(students);

    } catch (err) {

      console.error(
        "SECTION ERROR:",
        err
      );

      res.status(500).json({

        msg:
          err.message ||

          "Error fetching students"
      });
    }
  };

// =====================================
// ADD STUDENT
// =====================================

const addStudent =
  async (req, res) => {

    try {

      const payload =
        cleanPayload(
          req.body
        );

      const errors =
        await validateStudent(

          payload,
          req.user.schoolId
        );

      if (
        Object.keys(errors).length
      ) {

        return res.status(400).json({
          errors
        });
      }

      // CHECK DUPLICATE

      const duplicateStudent =
        await Student.findOne({

          schoolId:
            req.user.schoolId,

          name:
            payload.name,

          parentEmail:
            payload.parentEmail
        });

      if (duplicateStudent) {

        return res.status(400).json({

          success: false,

          msg:
            "Student already exists"
        });
      }

      // FIND EXISTING PARENT

      let parent =
        await Parent.findOne({

          email:
            payload.parentEmail,

          schoolId:
            req.user.schoolId
        });

      let plainPassword = "";

      // CREATE PARENT

      if (!parent) {

        plainPassword =

          "PAR" +

          Math.floor(
            1000 +
            Math.random() * 9000
          );

        const hashedPassword =
          await bcrypt.hash(
            plainPassword,
            10
          );

        parent =
          await Parent.create({

            schoolId:
              req.user.schoolId,

            fatherName:
              payload.fatherName,

            motherName:
              payload.motherName,

            email:
              payload.parentEmail,

            mobile:
              payload.parentMobile,

            password:
              hashedPassword,

            children: []
          });

        // SEND EMAIL

        if (
          payload.parentEmail
        ) {

          try {

            await sendEmail(

              payload.parentEmail,

              "Parent Portal Credentials",

              `
              <h2>Parent Portal Login</h2>

              <p>
                Your parent account has been created.
              </p>

              <p>
                <b>Email:</b>
                ${payload.parentEmail}
              </p>

              <p>
                <b>Password:</b>
                ${plainPassword}
              </p>

              <p>
                Please change your password after login.
              </p>
              `
            );

          } catch (emailError) {

            console.log(
              "EMAIL ERROR:",
              emailError.message
            );
          }
        }
      }

      // GENERATE STUDENT ID

      const studentId =
        await generateStudentId();

      // CREATE STUDENT

      const student =
        await Student.create({

          ...payload,

          studentId,

          schoolId:
            req.user.schoolId,

          parentId:
            parent?._id || null
        });

      // LINK CHILD

      if (parent) {

        const alreadyLinked =
          parent.children.some(

            (id) =>

              id.toString() ===
              student._id.toString()
          );

        if (!alreadyLinked) {

          parent.children.push(
            student._id
          );

          await parent.save();
        }
      }

      res.status(201).json({

        success: true,

        msg:
          "Student added successfully",

        student,

        parentCredentials:

          plainPassword

            ? {

                email:
                  payload.parentEmail,

                password:
                  plainPassword
              }

            : null
      });

    } catch (err) {

      console.error(
        "ADD STUDENT ERROR:",
        err
      );

      res.status(500).json({

        msg:
          err.message ||

          "Error adding student"
      });
    }
  };

// =====================================
// UPDATE STUDENT
// =====================================

const updateStudent =
  async (req, res) => {

    try {

      const payload =
        cleanPayload(
          req.body
        );

      // GET EXISTING STUDENT

      const existingStudent =
        await Student.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId
        });

      if (!existingStudent) {

        return res.status(404).json({

          msg:
            "Student not found"
        });
      }

      // VALIDATE

      const errors =
        await validateStudent(

          payload,

          req.user.schoolId,

          req.params.id
        );

      if (
        Object.keys(errors).length
      ) {

        return res.status(400).json({
          errors
        });
      }

      // CHECK DUPLICATE

      const duplicateStudent =
        await Student.findOne({

          schoolId:
            req.user.schoolId,

          name:
            payload.name,

          parentEmail:
            payload.parentEmail,

          _id: {

            $ne:
              req.params.id
          }
        });

      if (duplicateStudent) {

        return res.status(400).json({

          success: false,

          msg:
            "Student already exists"
        });
      }

      // FIND PARENT

      let parent =
        null;

      if (
        payload.parentEmail
      ) {

        parent =
          await Parent.findOne({

            email:
              payload.parentEmail,

            schoolId:
              req.user.schoolId
          });
      }

      // CREATE NEW PARENT

      if (
        !parent &&
        payload.parentEmail
      ) {

        const plainPassword =

          "PAR" +

          Math.floor(
            1000 +
            Math.random() * 9000
          );

        const hashedPassword =
          await bcrypt.hash(
            plainPassword,
            10
          );

        parent =
          await Parent.create({

            schoolId:
              req.user.schoolId,

            fatherName:
              payload.fatherName,

            motherName:
              payload.motherName,

            email:
              payload.parentEmail,

            mobile:
              payload.parentMobile,

            password:
              hashedPassword,

            children: [
              existingStudent._id
            ]
          });

        // SEND EMAIL

        try {

          await sendEmail(

            payload.parentEmail,

            "Parent Portal Credentials",

            `
            <h2>Parent Portal Login</h2>

            <p>
              Your parent account has been created.
            </p>

            <p>
              <b>Email:</b>
              ${payload.parentEmail}
            </p>

            <p>
              <b>Password:</b>
              ${plainPassword}
            </p>

            <p>
              Please change your password after login.
            </p>
            `
          );

        } catch (emailError) {

          console.log(

            "UPDATE EMAIL ERROR:",

            emailError.message
          );
        }
      }

      // UPDATE EXISTING PARENT

      else if (parent) {

        await Parent.findByIdAndUpdate(

          parent._id,

          {

            fatherName:
              payload.fatherName,

            motherName:
              payload.motherName,

            email:
              payload.parentEmail,

            mobile:
              payload.parentMobile
          }
        );
      }

      // UPDATE PARENT ID

      payload.parentId =
        parent?._id || null;

      // REMOVE CHILD FROM OLD PARENT

      if (
        existingStudent.parentId &&
        existingStudent.parentId.toString() !==
        payload.parentId?.toString()
      ) {

        await Parent.updateOne(

          {
            _id:
              existingStudent.parentId
          },

          {

            $pull: {

              children:
                existingStudent._id
            }
          }
        );
      }

      // LINK CHILD TO NEW PARENT

      if (parent) {

        const alreadyLinked =
          parent.children.some(

            (id) =>

              id.toString() ===
              existingStudent._id.toString()
          );

        if (!alreadyLinked) {

          parent.children.push(
            existingStudent._id
          );

          await parent.save();
        }
      }

      // UPDATE STUDENT

      const student =
        await Student.findOneAndUpdate(

          {
            _id:
              req.params.id,

            schoolId:
              req.user.schoolId
          },

          payload,

          {
            new: true
          }
        );

      res.json({

        success: true,

        msg:
          "Student updated successfully",

        student
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

          "Error updating student"
      });
    }
  };

// =====================================
// DELETE STUDENT
// =====================================

const deleteStudent =
  async (req, res) => {

    try {

      const deleted =
        await Student.findOneAndDelete({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId
        });

      if (!deleted) {

        return res.status(404).json({

          success: false,

          msg:
            "Student not found"
        });
      }

      // REMOVE CHILD FROM PARENT

      if (
        deleted.parentId
      ) {

        await Parent.updateOne(

          {
            _id:
              deleted.parentId
          },

          {

            $pull: {

              children:
                deleted._id
            }
          }
        );

        const parent =
          await Parent.findById(
            deleted.parentId
          );

        // DELETE EMPTY PARENT

        if (
          parent &&
          parent.children.length === 0
        ) {

          await Parent.findByIdAndDelete(
            deleted.parentId
          );

          console.log(
            "EMPTY PARENT REMOVED"
          );
        }
      }

      return res.json({

        success: true,

        msg:
          "Student deleted successfully"
      });

    } catch (err) {

      console.error(
        "DELETE ERROR:",
        err
      );

      return res.status(500).json({

        success: false,

        msg:
          err.message ||

          "Error deleting student"
      });
    }
  };

// =====================================
// IMPORT STUDENTS
// =====================================

const importStudents =
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({

          msg:
            "No file uploaded"
        });
      }

      const workbook =
        XLSX.readFile(
          req.file.path
        );

      const sheetName =
        workbook.SheetNames[0];

      const data =
        XLSX.utils.sheet_to_json(

          workbook.Sheets[sheetName],

          {
            defval: "",
          }
        );

      fs.unlinkSync(
        req.file.path
      );

      if (!data.length) {

        return res.status(400).json({

          msg:
            "Excel file is empty"
        });
      }

      let successCount = 0;

      let failedRows = [];

      // LOOP

      for (
        let i = 0;
        i < data.length;
        i++
      ) {

        try {

          const row =
            data[i];

          // FIND SECTION

          const section =
            await Section.findOne({

              schoolId:
                req.user.schoolId,

              $or: [

                {
                  sectionName: {

                    $regex:
                      `^${row.section}$`,

                    $options: "i",
                  },
                },

                {
                  displayName: {

                    $regex:
                      `^${row.section}$`,

                    $options: "i",
                  },
                },
              ],
            });

          if (!section) {

            failedRows.push({

              row:
                i + 2,

              reason:
                "Section not found"
            });

            continue;
          }

          // FORMAT GENDER

          const formattedGender =
            row.gender
              ?.toString()
              .trim()
              .toLowerCase();

          // RAW PAYLOAD

          const payload = {

            name:
              row.name || "",

            gender:
              formattedGender === "female"
                ? "Female"
                : formattedGender === "male"
                ? "Male"
                : "",

            dob:
              row.dob || "",

            mobile:
              String(
                row.mobile || ""
              ),

            email:
              row.email || "",

            fatherName:
              row.fatherName || "",

            motherName:
              row.motherName || "",

            parentMobile:
              String(
                row.parentMobile || ""
              ),

            parentEmail:
              row.parentEmail || "",

            sectionId:
              section._id
          };

          // CLEAN PAYLOAD

          const cleanedPayload =
            cleanPayload(payload);

          // VALIDATE

          const errors =
            await validateStudent(

              cleanedPayload,

              req.user.schoolId
            );

          if (
            Object.keys(errors).length
          ) {

            failedRows.push({

              row:
                i + 2,

              reason:
                Object.values(errors)
                  .join(", ")
            });

            continue;
          }

          // CHECK DUPLICATE

          const duplicateStudent =
            await Student.findOne({

              schoolId:
                req.user.schoolId,

              name:
                cleanedPayload.name,

              parentEmail:
                cleanedPayload.parentEmail
            });

          if (duplicateStudent) {

            failedRows.push({

              row:
                i + 2,

              reason:
                "Student already exists"
            });

            continue;
          }

          // FIND PARENT

          let parent =
            await Parent.findOne({

              email:
                cleanedPayload.parentEmail,

              schoolId:
                req.user.schoolId
            });

          // CREATE PARENT

          if (!parent) {

            const plainPassword =

              "PAR" +

              Math.floor(

                1000 +

                Math.random() * 9000
              );

            const hashedPassword =
              await bcrypt.hash(

                plainPassword,

                10
              );

            parent =
              await Parent.create({

                schoolId:
                  req.user.schoolId,

                fatherName:
                  cleanedPayload.fatherName,

                motherName:
                  cleanedPayload.motherName,

                email:
                  cleanedPayload.parentEmail,

                mobile:
                  cleanedPayload.parentMobile,

                password:
                  hashedPassword,

                children: []
              });

            // SEND EMAIL

            if (
              cleanedPayload.parentEmail
            ) {

              try {

                await sendEmail(

                  cleanedPayload.parentEmail,

                  "Parent Portal Credentials",

                  `
                  <h2>Parent Portal Login</h2>

                  <p>
                    Your parent account has been created.
                  </p>

                  <p>
                    <b>Email:</b>
                    ${cleanedPayload.parentEmail}
                  </p>

                  <p>
                    <b>Password:</b>
                    ${plainPassword}
                  </p>

                  <p>
                    Please change your password after login.
                  </p>
                  `
                );

              } catch (emailError) {

                console.log(

                  "IMPORT EMAIL ERROR:",

                  emailError.message
                );
              }
            }
          }

          // GENERATE STUDENT ID

          const studentId =
            await generateStudentId();

          // CREATE STUDENT

          const student =
            await Student.create({

              ...cleanedPayload,

              studentId,

              schoolId:
                req.user.schoolId,

              parentId:
                parent?._id || null
            });

          // LINK CHILD

          if (parent) {

            const alreadyLinked =
              parent.children.some(

                (id) =>

                  id.toString() ===
                  student._id.toString()
              );

            if (!alreadyLinked) {

              parent.children.push(
                student._id
              );

              await parent.save();
            }
          }

          successCount++;

        } catch (err) {

          failedRows.push({

            row:
              i + 2,

            reason:
              err.message
          });
        }
      }

      // RESPONSE

      res.json({

        msg:
          "Import completed",

        successCount,

        failedCount:
          failedRows.length,

        failedRows
      });

    } catch (err) {

      console.error(
        "IMPORT ERROR:",
        err
      );

      res.status(500).json({

        msg:
          err.message ||

          "Import failed"
      });
    }
  };

// =====================================
// EXPORTS
// =====================================

module.exports = {

  getStudents,

  getStudentsBySection,

  getStudentById,

  addStudent,

  updateStudent,

  deleteStudent,

  importStudents
};