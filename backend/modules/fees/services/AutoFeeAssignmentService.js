const FeeStructure =
require(
  "../models/FeeStructure"
);

const Student =
require(
  "../../../models/Student"
);

const StudentFeeProfile =
require(
  "../models/StudentFeeProfile"
);



// ======================
// GENERATE DUE DATE
// ======================

const generateDueDate =
(dueDay = 5) => {

  const date =
    new Date();

  date.setDate(dueDay);

  return date;
};



// ======================
// CREATE ASSIGNMENT
// ======================

const createFeeAssignments =
(feeItems = []) => {

  return feeItems.map(
    (item) => ({

      feeItemId:
        item._id,



      title:
        item.title,



      code:
        item.code,



      category:
        item.category,



      recurringType:
        item.recurringType,



      mandatory:
        item.mandatory,



      amount:
        item.amount,



      originalAmount:
        item.amount,



      payableAmount:
        item.amount,



      paidAmount: 0,



      pendingAmount:
        item.amount,



      dueDate:
        generateDueDate(
          item.dueDay
        ),



      status:
        "PENDING",



      installmentAllowed:
        item.installmentAllowed,



      lateFineEnabled:
        item.lateFineEnabled,



      lateFineAmount:
        item.lateFineAmount || 0
    })
  );
};



// ======================
// ASSIGN FEES TO STUDENT
// ======================

const assignFeesToStudent =
async ({

  schoolId,

  studentId,

  academicYear,

  className,

  section = "ALL"

}) => {

  try {

    // ======================
    // STUDENT
    // ======================

    const student =
      await Student.findById(
        studentId
      );

    if (!student) {

      throw new Error(
        "Student not found"
      );
    }



    // ======================
    // FEE STRUCTURE
    // ======================

    const structure =
      await FeeStructure.findOne({

        schoolId,

        academicYear,

        className,

        isDeleted: false,

        status: "ACTIVE"
      });

    if (!structure) {

      throw new Error(
        "Fee structure not found"
      );
    }



    // ======================
    // ALREADY EXISTS?
    // ======================

    const existingProfile =
      await StudentFeeProfile.findOne({

        schoolId,

        studentId,

        academicYear,

        isDeleted: false
      });

    if (existingProfile) {

      return existingProfile;
    }



    // ======================
    // ASSIGNMENTS
    // ======================

    const assignments =
      createFeeAssignments(

        structure.feeItems
      );



    // ======================
    // TOTALS
    // ======================

    const totalAmount =
      assignments.reduce(

        (sum, item) =>

          sum + item.amount,

        0
      );



    // ======================
    // CREATE PROFILE
    // ======================

    const profile =
      await StudentFeeProfile.create({

        schoolId,



        studentId,



        academicYear,



        className,



        section,



        feeStructureId:
          structure._id,



        feeAssignments:
          assignments,



        totalAssignedAmount:
          totalAmount,



        totalPaidAmount: 0,



        totalPendingAmount:
          totalAmount,



        totalDiscountAmount: 0,



        totalFineAmount: 0,



        status:
          "ACTIVE"
      });



    return profile;

  } catch (error) {

    console.error(

      "AUTO ASSIGN ERROR:",

      error
    );

    throw error;
  }
};



// ======================
// ASSIGN WHOLE CLASS
// ======================

const assignFeesToWholeClass =
async ({

  schoolId,

  academicYear,

  className,

  section = "ALL"

}) => {

  try {

    // ======================
    // STUDENTS
    // ======================

    const students =
      await Student.find({

        schoolId,

        className,

        isDeleted: false
      });




    const results = [];



    // ======================
    // LOOP
    // ======================

    for (
      const student
      of students
    ) {

      try {

        const profile =
          await assignFeesToStudent({

            schoolId,

            studentId:
              student._id,

            academicYear,

            className,

            section
          });



        results.push({

          studentId:
            student._id,

          success: true,

          profileId:
            profile._id
        });

      } catch (error) {

        results.push({

          studentId:
            student._id,

          success: false,

          error:
            error.message
        });
      }
    }



    return results;

  } catch (error) {

    console.error(

      "CLASS ASSIGN ERROR:",

      error
    );

    throw error;
  }
};



// ======================
// EXPORTS
// ======================

module.exports = {

  assignFeesToStudent,

  assignFeesToWholeClass
};