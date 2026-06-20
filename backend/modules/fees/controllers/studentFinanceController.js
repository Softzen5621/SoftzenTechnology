const StudentFeeProfile =
require(
  "../models/StudentFeeProfile"
);

const Student =
require(
  "../../../models/Student"
);



// ======================
// SEARCH STUDENT FEES
// ======================

const searchStudentFees =
async (req, res) => {

  try {

    const {

      search

    } = req.query;



    // ======================
    // VALIDATION
    // ======================

    if (!search) {

      return res.status(400).json({

        success: false,

        message:
          "Search query required"
      });
    }



    // ======================
    // STUDENT SEARCH
    // ======================

    const student =
      await Student.findOne({

        schoolId:
          req.user.schoolId,

        $or: [

          {

            fullName: {

              $regex:
                search,

              $options:
                "i"
            }
          },

          {

            name: {

              $regex:
                search,

              $options:
                "i"
            }
          },

          {

            admissionNumber: {

              $regex:
                search,

              $options:
                "i"
            }
          },

          {

            rollNumber: {

              $regex:
                search,

              $options:
                "i"
            }
          },

          {

            parentPhone: {

              $regex:
                search,

              $options:
                "i"
            }
          }
        ]
      });




    // ======================
    // NOT FOUND
    // ======================

    if (!student) {

      return res.status(404).json({

        success: false,

        message:
          "Student not found"
      });
    }



    // ======================
    // PROFILE
    // ======================

    const profile =
      await StudentFeeProfile.findOne({

        schoolId:
          req.user.schoolId,

        studentId:
          student._id,

        isDeleted: false
      });




    // ======================
    // NO PROFILE
    // ======================

    if (!profile) {

      return res.status(404).json({

        success: false,

        message:
          "Fee profile not found"
      });
    }



    // ======================
    // SORT ASSIGNMENTS
    // ======================

    profile.feeAssignments.sort(

      (a, b) =>

        new Date(a.dueDate) -

        new Date(b.dueDate)
    );



    // ======================
    // TOTALS
    // ======================

    let totalAssignedAmount = 0;

    let totalPaidAmount = 0;

    let totalPendingAmount = 0;

    let totalDiscountAmount = 0;

    let totalFineAmount = 0;



    profile.feeAssignments.forEach(

      (item) => {

        totalAssignedAmount +=

          item.amount || 0;



        totalPaidAmount +=

          item.paidAmount || 0;



        totalPendingAmount +=

          item.pendingAmount || 0;



        totalDiscountAmount +=

          item.discountAmount || 0;



        totalFineAmount +=

          item.fineAmount || 0;
      }
    );



    // ======================
    // RESPONSE
    // ======================

    return res.status(200).json({

      success: true,



      student: {

        _id:
          student._id,



        fullName:

          student.fullName ||

          student.name,



        admissionNumber:
          student.admissionNumber,



        rollNumber:
          student.rollNumber,



        className:
          student.className,



        section:
          student.section,



        parentPhone:
          student.parentPhone
      },



      profile: {

        ...profile.toObject(),



        totalAssignedAmount,



        totalPaidAmount,



        totalPendingAmount,



        totalDiscountAmount,



        totalFineAmount
      }
    });

  } catch (error) {

    console.error(

      "SEARCH FEES ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch student fees"
    });
  }
};



// ======================
// EXPORTS
// ======================

module.exports = {

  searchStudentFees
};