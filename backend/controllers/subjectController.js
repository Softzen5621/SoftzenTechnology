const Subject =
  require("../models/Subject");


// =====================================
// GET SUBJECTS
// =====================================

const getSubjects = async (
  req,
  res
) => {

  try {

    const subjects =
      await Subject.find({

        schoolId:
          req.user.schoolId,

      }).sort({
        createdAt: -1,
      });


    res.status(200).json({

      success: true,

      subjects,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Error fetching subjects",
    });
  }
};


// =====================================
// CREATE SUBJECT
// =====================================

const addSubject = async (
  req,
  res
) => {

  try {

    const {
      name,
      status,
    } = req.body;


    if (!name) {

      return res.status(400).json({

        success: false,

        message:
          "Subject name required",
      });
    }


    // CHECK EXISTING

    const exists =
      await Subject.findOne({

        schoolId:
          req.user.schoolId,

        name:
          name.trim(),
      });


    if (exists) {

      return res.status(400).json({

        success: false,

        message:
          "Subject already exists",
      });
    }


    // CREATE

    const subject =
      await Subject.create({

        schoolId:
          req.user.schoolId,

        name:
          name.trim(),

        status:
          status || "Active",
      });


    res.status(201).json({

      success: true,

      message:
        "Subject created successfully",

      subject,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Error adding subject",
    });
  }
};


module.exports = {

  getSubjects,

  addSubject,
};