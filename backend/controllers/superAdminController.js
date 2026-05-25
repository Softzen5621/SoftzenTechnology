const bcrypt =
  require("bcryptjs");

const crypto =
  require("crypto");

const School =
  require("../models/School");

const User =
  require("../models/User");

// ======================
// GENERATE PASSWORD
// ======================

const generatePassword =
  () => {

    return (

      "ERP@" +

      Math.floor(

        1000 +

        Math.random() * 9000
      )
    );
  };

// ======================
// GENERATE SCHOOL CODE
// ======================

const generateSchoolCode =
  (schoolName) => {

    const shortName =

      schoolName

        .replace(/\s+/g, "")

        .substring(0, 4)

        .toUpperCase();

    const random =
      crypto
        .randomBytes(2)
        .toString("hex")
        .toUpperCase();

    return `${shortName}${random}`;
  };

// ======================
// CREATE SCHOOL
// ======================

const createSchool =
  async (req, res) => {

    try {

      const {

        schoolName,

        email,

        phone,

        address,

        website,

        adminName,

        adminEmail,

        plan
      } = req.body;

      // ======================
      // VALIDATION
      // ======================

      if (

        !schoolName ||

        !adminName ||

        !adminEmail
      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Required fields missing"
        });
      }

      // ======================
      // SCHOOL CODE
      // ======================

      const schoolCode =

        generateSchoolCode(
          schoolName
        );

      // ======================
      // PASSWORD
      // ======================

      const plainPassword =

        generatePassword();

      const hashedPassword =

        await bcrypt.hash(

          plainPassword,

          10
        );

      // ======================
      // CREATE ADMIN
      // ======================

      const admin =
        await User.create({

          name:
            adminName,

          email:
            adminEmail,

          password:
            hashedPassword,

          role:
            "admin",

          schoolId:
            schoolCode,

          mustChangePassword:
            true,

          status:
            "active",

          isActive:
            true
        });

      // ======================
      // CREATE SCHOOL
      // ======================

      const school =
        await School.create({

          schoolName,

          schoolCode,

          email,

          phone,

          address,

          website,

          adminId:
            admin._id,

          adminName,

          adminEmail,

          plan:
            plan || "FREE"
        });

      // ======================
      // RESPONSE
      // ======================

      res.status(201).json({

        success: true,

        msg:
          "School created successfully",

        school,

        adminCredentials: {

          email:
            adminEmail,

          password:
            plainPassword,

          schoolCode
        }
      });

    } catch (err) {

      console.error(
        "CREATE SCHOOL ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          "Server Error"
      });
    }
  };

// ======================
// GET SCHOOLS
// ======================

const getSchools =
  async (req, res) => {

    try {

      const schools =
        await School.find()

          .sort({

            createdAt: -1
          });

      res.json({

        success: true,

        schools
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({

        success: false,

        msg:
          "Server Error"
      });
    }
  };

// ======================
// EXPORTS
// ======================

module.exports = {

  createSchool,

  getSchools
};