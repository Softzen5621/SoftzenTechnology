const Section =
require("../../../models/Section");

const AcademicYear =
require("../models/AcademicYear");

const cloneAcademicStructure =
async (

  schoolId,

  sourceYearId,

  targetYearId

) => {

  // =====================================
  // YEARS
  // =====================================

  const sourceYear =
  await AcademicYear.findOne({

    _id: sourceYearId,

    schoolId,

    isDeleted: false
  });

  if (!sourceYear) {

    throw new Error(
      "Source academic year not found"
    );
  }

  const targetYear =
  await AcademicYear.findOne({

    _id: targetYearId,

    schoolId,

    isDeleted: false
  });

  if (!targetYear) {

    throw new Error(
      "Target academic year not found"
    );
  }

  // =====================================
  // SECTIONS
  // =====================================

  const sections =
  await Section.find({

    schoolId,

    academicYear:
      sourceYear.name
  });

  console.log(
  "SECTIONS FOUND:",
  sections.length
);

  if (!sections.length) {

    throw new Error(
      "No sections found in source year"
    );
  }

  let createdCount = 0;

  for (const section of sections) {

    const alreadyExists =
    await Section.findOne({

      schoolId,

      academicYear:
        targetYear.name,

      displayName:
        section.displayName
    });

    console.log(
  "CLONING:",
  section.displayName
);

console.log(
  "CREATED:",
  section.displayName
);

    if (alreadyExists) {

      continue;
    }

    await Section.create({

      schoolId,

      className:
        section.className,

      promotionOrder:
        section.promotionOrder || 0,

      sectionName:
        section.sectionName,

      displayName:
        section.displayName,

      classTeacher:
        section.classTeacher,

      subjects:
        section.subjects,

      roomNumber:
        section.roomNumber,

      floor:
        section.floor,

      building:
        section.building,

      academicYear:
        targetYear.name,

      classType:
        section.classType,

      capacity:
        section.capacity,

      shift:
        section.shift,

      description:
        section.description,

      colorTheme:
        section.colorTheme,

      status:
        "Active",

      isActive:
        true,

      isArchived:
        false
    });

    createdCount++;
  }

  return {

    sourceYear:
      sourceYear.name,

    targetYear:
      targetYear.name,

    createdCount
  };
};

module.exports = {

  cloneAcademicStructure
};