const School =
require("../../../models/School");

const Student =
require("../../../models/Student");

const TransferCertificate =
require("../models/TransferCertificate");

// =====================================
// GENERATE TC NUMBER
// =====================================

const generateTCNumber =
async (schoolId) => {

  const school =
  await School.findOneAndUpdate(

    {
      schoolCode: schoolId
    },

    {
      $inc: {
        lastTcNumber: 1
      }
    },

    {
      new: true
    }
  );

  if (!school) {

    throw new Error(
      "School not found"
    );
  }

  const year =
  new Date().getFullYear();

  return `TC/${year}/${String(
    school.lastTcNumber
  ).padStart(4,"0")}`;
};

// =====================================
// ISSUE TC
// =====================================

const issueTC =
async (req,res) => {

  try {

    const {

      studentId,

      reasonForLeaving,

      result,

      remarks

    } = req.body;

    const student =
    await Student.findOne({

      _id: studentId,

      schoolId:
      req.user.schoolId
    });

    if(!student){

      return res.status(404).json({

        success:false,

        msg:"Student not found"
      });
    }

    const existingTC =
    await TransferCertificate.findOne({

      studentId:
      student._id,

      status:"ISSUED"
    });

    if(existingTC){

      return res.status(400).json({

        success:false,

        msg:"TC already issued"
      });
    }

    const tcNumber =
    await generateTCNumber(

      req.user.schoolId
    );

    const tc =
    await TransferCertificate.create({

      schoolId:
      req.user.schoolId,

      studentId:
      student._id,

      tcNumber,

      reasonForLeaving,

      result,

      remarks,

      issuedBy:
      req.user.name,

      lastClassStudied:
      student.currentClassName
    });

    // const pdf =
    // await generateTCPdf(
    //   tc._id
    // );

    // tc.pdfUrl =
    // pdf.pdfUrl;

    // await tc.save();

    student.studentStatus =
    "TC";

    await student.save();

    res.status(201).json({

      success:true,

      tc
    });

  } catch(err){

    console.error(err);

    res.status(500).json({

      success:false,

      msg:err.message
    });
  }
};

// =====================================
// GET ALL TCs
// =====================================

const getTCs =
async (req,res) => {

  try {

    const tcs =
    await TransferCertificate.find({

      schoolId:
      req.user.schoolId
    })

    .populate(

      "studentId",

      "name admissionNumber currentClassName"
    )

    .sort({

      createdAt:-1
    });

    res.json({

      success:true,

      tcs
    });

  } catch(err){

    res.status(500).json({

      success:false,

      msg:err.message
    });
  }
};

// =====================================
// GET TC BY ID
// =====================================

const getTCById =
async (req,res) => {

  try {

    const tc =
    await TransferCertificate.findOne({

      _id: req.params.id,

      schoolId:
      req.user.schoolId
    })

    .populate("studentId");

    if(!tc){

      return res.status(404).json({

        success:false,

        msg:"TC not found"
      });
    }

    const school =
    await School.findOne({

      schoolCode:
      req.user.schoolId
    });

    res.json({

      success:true,

      tc,

      school
    });

  } catch(err){

    console.error(err);

    res.status(500).json({

      success:false,

      msg:err.message
    });
  }
};

module.exports = {

  issueTC,

  getTCs,

  getTCById
};