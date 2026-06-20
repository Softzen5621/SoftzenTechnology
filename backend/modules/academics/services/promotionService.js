const Student =
require("../../../models/Student");

const AcademicYear =
require("../models/AcademicYear");

const PromotionHistory =
require("../models/PromotionHistory");

const Section =
require("../../../models/Section");

// ======================================================
// CLASS PROMOTION MAP
// ======================================================

const CLASS_PROMOTION_MAP = {

  "Nursery": "LKG",

  "LKG": "UKG",

  "UKG": "Class 1",

  "Class 1": "Class 2",

  "Class 2": "Class 3",

  "Class 3": "Class 4",

  "Class 4": "Class 5",

  "Class 5": "Class 6",

  "Class 6": "Class 7",

  "Class 7": "Class 8",

  "Class 8": "Class 9",

  "Class 9": "Class 10",

  "Class 10": "Class 11",

  "Class 11": "Class 12",

  "Class 12": null
};

// ======================================================
// GET ACTIVE + NEXT YEAR
// ======================================================

const getNextAcademicYear =
async (schoolId) => {

  const activeYear =
  await AcademicYear.findOne({

    schoolId,

    isActive: true,

    isDeleted: false
  });

  if (!activeYear) {

    throw new Error(
      "Active academic year not found"
    );
  }

  const nextYear =
  await AcademicYear.findOne({

    schoolId,

    isDeleted: false,

    startDate: {

      $gt:
      activeYear.startDate
    }

  }).sort({

    startDate: 1
  });

  if (!nextYear) {

    throw new Error(
      "Next academic year not found"
    );
  }

  return {

    activeYear,

    nextYear
  };
};

// ======================================================
// PREVIEW PROMOTION
// ======================================================

const previewPromotion =
async (schoolId) => {

  const students =
  await Student.find({

    schoolId,

    $or: [

      {

        studentStatus:
        "ACTIVE"
      },

      {

        studentStatus:
        { $exists: false }
      }
    ],

    isDeleted: false
  });

  return students.map(

    (student) => ({

      studentId:
      student.studentId,

      name:
      student.name,

      currentClass:
      student.currentClassName,

      currentSection:
      student.currentSection,

      nextClass:

      CLASS_PROMOTION_MAP[
        student.currentClassName
      ] ||

      "PASSED_OUT"
    })
  );
};

// ======================================================
// PROMOTE WHOLE SCHOOL
// ======================================================

const promoteSchool =
async (

  schoolId,

  promotedBy

) => {

  const {

    activeYear,

    nextYear

  } = await getNextAcademicYear(

    schoolId
  );

  const students =
  await Student.find({

    schoolId,

    studentStatus:
      "ACTIVE",

    isDeleted: false
  });

  let promotedCount = 0;

  let passedOutCount = 0;

  for (

    const student of students

  ) {

    const nextClass =

      CLASS_PROMOTION_MAP[
        student.currentClassName
      ];

    // =====================
    // CLASS 12 -> PASSED OUT
    // =====================

    if (!nextClass) {

      student.studentStatus =
        "PASSED_OUT";

      await student.save();

      passedOutCount++;

      continue;
    }

    // =====================
    // FIND TARGET SECTION
    // =====================

    const targetSection =
    await Section.findOne({

      schoolId,

      academicYear:
        nextYear.name,

      className:
        nextClass,

      sectionName:
        student.currentSection
    });

    console.log(
  "SEARCHING:",
  nextClass,
  student.currentSection,
  nextYear.name
);

console.log(
  "FOUND SECTION:",
  targetSection
);

    // target class not found
   if (!targetSection) {

  console.log(
    "TARGET SECTION NOT FOUND"
  );

  continue;
}
    // =====================
    // ACADEMIC HISTORY
    // =====================

    student.academicHistory.push({

      academicYearId:
        activeYear._id,

      academicYear:
        activeYear.name,

      className:
        student.currentClassName,

      section:
        student.currentSection,

      rollNumber:
        student.currentRollNumber || "",

      resultStatus:
        "PROMOTED",

      promotedTo:
        nextClass,

      promotedDate:
        new Date()
    });

    // =====================
    // PROMOTION HISTORY
    // =====================

    await PromotionHistory.create({

      schoolId,

      studentId:
        student._id,

      fromAcademicYear:
        activeYear.name,

      toAcademicYear:
        nextYear.name,

      fromClass:
        student.currentClassName,

      toClass:
        nextClass,

      fromSection:
        student.currentSection,

      toSection:
        student.currentSection,

      resultStatus:
        "PROMOTED",

      promotedBy
    });

    // =====================
// NEXT YEAR HISTORY
// =====================

student.academicHistory.push({

  academicYearId:
    nextYear._id,

  academicYear:
    nextYear.name,

  className:
    nextClass,

  section:
    student.currentSection,

  rollNumber:
    student.currentRollNumber || "",

  joinedDate:
    new Date(),

  resultStatus:
    "ACTIVE",

  promotedTo:
    "",

  promotedDate:
    null
});

    // =====================
    // UPDATE STUDENT
    // =====================

    student.currentAcademicYearId =
      nextYear._id;

    student.currentAcademicYear =
      nextYear.name;

    student.currentClassName =
      nextClass;

    student.sectionId =
      targetSection._id;

    await student.save();

    promotedCount++;
  }

  return {

    message:
      "School promoted successfully",

    activeYear:
      activeYear.name,

    nextYear:
      nextYear.name,

    promotedCount,

    passedOutCount
  };
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {

  previewPromotion,

  getNextAcademicYear,

  promoteSchool,

  CLASS_PROMOTION_MAP
};