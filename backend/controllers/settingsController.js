const fs =
require("fs");

const path =
require("path");

const School =
require("../models/School");

// ======================
// GET SETTINGS
// ======================

const getSettings =
async (req,res) => {

  try {

    const school =
    await School.findOne({

      schoolCode:
      req.user.schoolId
    });

    if(!school){

      return res.status(404).json({

        success:false,
        msg:"School not found"
      });
    }

    res.json({

      success:true,
      school
    });

  } catch(err){

    res.status(500).json({

      success:false,
      msg:err.message
    });
  }
};

// ======================
// UPDATE SETTINGS
// ======================

const updateSettings =
async (req,res) => {

  try {

    const updateData =
    { ...req.body };

    const uploadDir =
    path.join(

      __dirname,
      "../../uploads/schools"
    );

    if(
      !fs.existsSync(
        uploadDir
      )
    ){
      fs.mkdirSync(
        uploadDir,
        {
          recursive:true
        }
      );
    }

    // LOGO

    if(
      req.files?.logo?.[0]
    ){

      const file =
      req.files.logo[0];

      const fileName =
      `logo_${Date.now()}.png`;

      fs.writeFileSync(

        path.join(
          uploadDir,
          fileName
        ),

        file.buffer
      );

      updateData.logo =
      `/uploads/schools/${fileName}`;
    }

    // SIGNATURE

    if(
      req.files?.principalSignature?.[0]
    ){

      const file =
      req.files
      .principalSignature[0];

      const fileName =
      `sign_${Date.now()}.png`;

      fs.writeFileSync(

        path.join(
          uploadDir,
          fileName
        ),

        file.buffer
      );

      updateData.principalSignature =
      `/uploads/schools/${fileName}`;
    }

    // SEAL

    if(
      req.files?.schoolSeal?.[0]
    ){

      const file =
      req.files.schoolSeal[0];

      const fileName =
      `seal_${Date.now()}.png`;

      fs.writeFileSync(

        path.join(
          uploadDir,
          fileName
        ),

        file.buffer
      );

      updateData.schoolSeal =
      `/uploads/schools/${fileName}`;
    }

    const school =
    await School.findOneAndUpdate(

      {
        schoolCode:
        req.user.schoolId
      },

      updateData,

      {
        new:true
      }
    );

    res.json({

      success:true,
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

  getSettings,

  updateSettings
};