const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");

const Teacher =
  require("../models/Teacher");

const Parent =
  require("../models/Parent");

const sendEmail =
  require("../utils/sendEmail");

// ======================================================
// CREATE TOKEN
// ======================================================

const createToken =
  (payload) => {

    return jwt.sign(

      {

        _id:
          payload._id,

        name:
          payload.name,

        role:
          payload.role,

        schoolId:
          payload.schoolId
      },

      process.env.JWT_SECRET ||

      "secret",

      {

        expiresIn: "1d"
      }
    );
  };

// ======================================================
// NORMALIZE LOGIN INPUT
// ======================================================

const normalizeLoginInput =
  ({

    email,

    schoolId

  }) => ({

    email:
      email
        ?.trim()
        .toLowerCase(),

    schoolId:
      schoolId?.trim()
  });

// ======================================================
// REGISTER ADMIN
// ======================================================

exports.register =
  async (req, res) => {

    try {

      const {

        name,

        password

      } = req.body;

      const {

        email,

        schoolId

      } = normalizeLoginInput(
        req.body
      );

      if (

        !name ||

        !email ||

        !password ||

        !schoolId

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "All fields required"
        });
      }

      const existingUser =
        await User.findOne({

          email,

          schoolId
        });

      if (existingUser) {

        return res.status(400).json({

          success: false,

          msg:
            "User already exists"
        });
      }

      const hashedPassword =
        await bcrypt.hash(

          password,

          10
        );

      const user =
        await User.create({

          name,

          email,

          password:
            hashedPassword,

          role:
            "admin",

          schoolId
        });

      return res.status(201).json({

        success: true,

        msg:
          "User registered successfully",

        user: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          schoolId:
            user.schoolId
        }
      });

    } catch (error) {

      console.error(
        "REGISTER ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        msg:
          "Server error"
      });
    }
  };

// ======================================================
// ADMIN LOGIN
// ======================================================

exports.login =
  async (req, res) => {

    try {

      const {

        password

      } = req.body;

      const {

        email,

        schoolId

      } = normalizeLoginInput(
        req.body
      );

      if (

        !email ||

        !password ||

        !schoolId

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "All fields required"
        });
      }

      const user =
        await User.findOne({

          email,

          schoolId
        });

      if (!user) {

        return res.status(404).json({

          success: false,

          msg:
            "User not found"
        });
      }

      const isMatch =
        await bcrypt.compare(

          password,

          user.password
        );

      if (!isMatch) {

        return res.status(400).json({

          success: false,

          msg:
            "Wrong password"
        });
      }

      const token =
        createToken({

          _id:
            user._id,

          name:
            user.name,

          role:
            user.role,

          schoolId:
            user.schoolId
        });

      return res.status(200).json({

        success: true,

        msg:
          "Login successful",

        token,

        user: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          schoolId:
            user.schoolId
        }
      });

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        msg:
          "Server error"
      });
    }
  };

// ======================================================
// TEACHER LOGIN
// ======================================================

exports.teacherLogin =
  async (req, res) => {

    try {

      const {

        employeeId,

        password,

        schoolId

      } = req.body;

      if (

        !employeeId ||

        !password ||

        !schoolId

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "All fields required"
        });
      }

      const teacher =
        await Teacher.findOne({

          employeeId:
            employeeId
              .trim()
              .toUpperCase(),

          schoolId:
            schoolId.trim()
        })

        .select("+password");

      if (!teacher) {

        return res.status(404).json({

          success: false,

          msg:
            "Teacher not found"
        });
      }

      const isMatch =
        await bcrypt.compare(

          password,

          teacher.password
        );

      if (!isMatch) {

        return res.status(400).json({

          success: false,

          msg:
            "Wrong password"
        });
      }

      const token =
        createToken({

          _id:
            teacher._id,

          name:
            teacher.fullName,

          role:
            "teacher",

          schoolId:
            teacher.schoolId
        });

      return res.status(200).json({

        success: true,

        msg:
          "Teacher login successful",

        token,

        mustChangePassword:
          teacher.mustChangePassword,

        teacher: {

          _id:
            teacher._id,

          fullName:
            teacher.fullName,

          employeeId:
            teacher.employeeId,

          schoolId:
            teacher.schoolId,

          role:
            "teacher"
        }
      });

    } catch (error) {

      console.error(
        "TEACHER LOGIN ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        msg:
          "Server error"
      });
    }
  };

// ======================================================
// PARENT LOGIN
// ======================================================

exports.parentLogin =
  async (req, res) => {

    try {

      const {

        email,

        password,

        schoolId

      } = req.body;

      if (

        !email ||

        !password ||

        !schoolId

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "All fields required"
        });
      }

      const parent =
        await Parent.findOne({

          email:
            email
              .trim()
              .toLowerCase(),

          schoolId:
            schoolId.trim()
        })

        .select("+password")

        .populate({

          path: "children",

          populate: {

            path: "sectionId",

            select:
              "className sectionName displayName"
          }
        });

      if (!parent) {

        return res.status(404).json({

          success: false,

          msg:
            "Parent not found"
        });
      }

      const isMatch =
        await bcrypt.compare(

          password,

          parent.password
        );

      if (!isMatch) {

        return res.status(400).json({

          success: false,

          msg:
            "Wrong password"
        });
      }

      const token =
        createToken({

          _id:
            parent._id,

          name:
            parent.fatherName,

          role:
            "parent",

          schoolId:
            parent.schoolId
        });

      return res.status(200).json({

        success: true,

        msg:
          "Parent login successful",

        token,

        mustChangePassword:
          parent.mustChangePassword,

        parent: {

          _id:
            parent._id,

          fatherName:
            parent.fatherName,

          motherName:
            parent.motherName,

          email:
            parent.email,

          mobile:
            parent.mobile,

          schoolId:
            parent.schoolId,

          role:
            "parent",

          children:
            parent.children
        }
      });

    } catch (error) {

      console.error(
        "PARENT LOGIN ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        msg:
          "Server error"
      });
    }
  };

// ======================================================
// PARENT FORGOT PASSWORD
// ======================================================

exports.parentForgotPassword =
  async (req, res) => {

    try {

      const {

        email,

        schoolId

      } = req.body;

      if (

        !email ||

        !schoolId

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Email and school ID required"
        });
      }

      const parent =
        await Parent.findOne({

          email:
            email
              .trim()
              .toLowerCase(),

          schoolId:
            schoolId.trim()
        });

      if (!parent) {

        return res.status(404).json({

          success: false,

          msg:
            "Parent not found"
        });
      }

      const otp =

        Math.floor(

          100000 +

          Math.random() * 900000
        ).toString();

      parent.resetOtp =
        otp;

      parent.otpExpiry =
        new Date(

          Date.now() +

          10 * 60 * 1000
        );

      await parent.save();

      await sendEmail(

        parent.email,

        "Parent Password Reset OTP",

        `
        <h2>Password Reset OTP</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>OTP valid for 10 minutes.</p>
        `
      );

      return res.status(200).json({

        success: true,

        msg:
          "OTP sent successfully"
      });

    } catch (error) {

      console.error(
        "FORGOT PASSWORD ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        msg:
          "Server error"
      });
    }
  };

// ======================================================
// PARENT RESET PASSWORD
// ======================================================

exports.parentResetPassword =
  async (req, res) => {

    try {

      const {

        email,

        schoolId,

        otp,

        newPassword

      } = req.body;

      if (

        !email ||

        !schoolId ||

        !otp ||

        !newPassword

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "All fields required"
        });
      }

      const parent =
        await Parent.findOne({

          email:
            email
              .trim()
              .toLowerCase(),

          schoolId:
            schoolId.trim()
        })

        .select("+password");

      if (!parent) {

        return res.status(404).json({

          success: false,

          msg:
            "Parent not found"
        });
      }

      if (

        parent.resetOtp !== otp

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Invalid OTP"
        });
      }

      if (

        !parent.otpExpiry ||

        parent.otpExpiry <
        new Date()

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "OTP expired"
        });
      }

      const hashedPassword =
        await bcrypt.hash(

          newPassword,

          10
        );

      parent.password =
        hashedPassword;

      parent.mustChangePassword =
        false;

      parent.resetOtp = "";

      parent.otpExpiry =
        null;

      await parent.save();

      return res.status(200).json({

        success: true,

        msg:
          "Password reset successful"
      });

    } catch (error) {

      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        msg:
          "Server error"
      });
    }
  };
// ======================================================
// ADMIN FORGOT PASSWORD
// ======================================================

exports.adminForgotPassword =
  async (req, res) => {

    try {

      const {

        email,

        schoolId

      } = req.body;

      if (

        !email ||

        !schoolId

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Email and school ID required"
        });
      }

      const admin =
        await User.findOne({

          email:
            email
              .trim()
              .toLowerCase(),

          schoolId:
            schoolId.trim(),

          role: "admin"
        });

      if (!admin) {

        return res.status(404).json({

          success: false,

          msg:
            "Admin not found"
        });
      }

      const otp =

        Math.floor(

          100000 +

          Math.random() * 900000
        ).toString();

      admin.resetOtp =
        otp;

      admin.otpExpiry =
        new Date(

          Date.now() +

          10 * 60 * 1000
        );

      await admin.save();

      await sendEmail(

        admin.email,

        "Admin Password Reset OTP",

        `
        <h2>Admin Password Reset </h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>OTP valid for 10 minutes.</p>
        `
      );

      return res.status(200).json({

        success: true,

        msg:
          "OTP sent successfully"
      });

    } catch (error) {

      console.error(
        "ADMIN FORGOT ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        msg:
          "Server error"
      });
    }
  };

// ======================================================
// ADMIN RESET PASSWORD
// ======================================================

exports.adminResetPassword =
  async (req, res) => {

    try {

      const {

        email,

        schoolId,

        otp,

        newPassword

      } = req.body;

      if (

        !email ||

        !schoolId ||

        !otp ||

        !newPassword

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "All fields required"
        });
      }

      const admin =
        await User.findOne({

          email:
            email
              .trim()
              .toLowerCase(),

          schoolId:
            schoolId.trim(),

          role: "admin"
        });

      if (!admin) {

        return res.status(404).json({

          success: false,

          msg:
            "Admin not found"
        });
      }

      if (

        admin.resetOtp !== otp

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Invalid OTP"
        });
      }

      if (

        !admin.otpExpiry ||

        admin.otpExpiry <
        new Date()

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "OTP expired"
        });
      }

      const hashedPassword =
        await bcrypt.hash(

          newPassword,

          10
        );

      admin.password =
        hashedPassword;

      admin.resetOtp = "";

      admin.otpExpiry =
        null;

      await admin.save();

      return res.status(200).json({

        success: true,

        msg:
          "Password reset successful"
      });

    } catch (error) {

      console.error(
        "ADMIN RESET ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        msg:
          "Server error"
      });
    }
  };

// ======================================================
// TEACHER FORGOT PASSWORD
// ======================================================

exports.teacherForgotPassword =
  async (req, res) => {

    try {

      const {

        email,

        schoolId

      } = req.body;

      if (

        !email ||

        !schoolId

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Email and school ID required"
        });
      }

      const teacher =
        await Teacher.findOne({

          email:
            email
              .trim()
              .toLowerCase(),

          schoolId:
            schoolId.trim()
        });

      if (!teacher) {

        return res.status(404).json({

          success: false,

          msg:
            "Teacher not found"
        });
      }

      const otp =

        Math.floor(

          100000 +

          Math.random() * 900000
        ).toString();

      teacher.resetOtp =
        otp;

      teacher.otpExpiry =
        new Date(

          Date.now() +

          10 * 60 * 1000
        );

      await teacher.save();

      await sendEmail(

        teacher.email,

        "Teacher Password Reset OTP",

        `
        <h2>Teacher Password Reset</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>OTP valid for 10 minutes.</p>
        `
      );

      return res.status(200).json({

        success: true,

        msg:
          "OTP sent successfully"
      });

    } catch (error) {

      console.error(
        "TEACHER FORGOT ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        msg:
          "Server error"
      });
    }
  };

// ======================================================
// TEACHER RESET PASSWORD
// ======================================================

exports.teacherResetPassword =
  async (req, res) => {

    try {

      const {

        email,

        schoolId,

        otp,

        newPassword

      } = req.body;

      if (

        !email ||

        !schoolId ||

        !otp ||

        !newPassword

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "All fields required"
        });
      }

      const teacher =
        await Teacher.findOne({

          email:
            email
              .trim()
              .toLowerCase(),

          schoolId:
            schoolId.trim()
        })

        .select("+password");

      if (!teacher) {

        return res.status(404).json({

          success: false,

          msg:
            "Teacher not found"
        });
      }

      if (

        teacher.resetOtp !== otp

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "Invalid OTP"
        });
      }

      if (

        !teacher.otpExpiry ||

        teacher.otpExpiry <
        new Date()

      ) {

        return res.status(400).json({

          success: false,

          msg:
            "OTP expired"
        });
      }

      const hashedPassword =
        await bcrypt.hash(

          newPassword,

          10
        );

      teacher.password =
        hashedPassword;

      teacher.resetOtp = "";

      teacher.otpExpiry =
        null;

      await teacher.save();

      return res.status(200).json({

        success: true,

        msg:
          "Password reset successful"
      });

    } catch (error) {

      console.error(
        "TEACHER RESET ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        msg:
          "Server error"
      });
    }
  };