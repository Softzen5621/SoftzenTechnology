require("dotenv").config();

const bcrypt =
  require("bcryptjs");

const mongoose =
  require("mongoose");

const User =
  require("../models/User");

// ======================
// CONNECT DB
// ======================

mongoose.connect(

  process.env.MONGO_URI

).then(() => {

  console.log(
    "MongoDB Connected"
  );

}).catch((err) => {

  console.log(err);
});

// ======================
// CREATE SUPER ADMIN
// ======================

const createSuperAdmin =
  async () => {

    try {

      // ======================
      // CHECK EXISTING
      // ======================

      const existing =
        await User.findOne({

          role:
            "super_admin"
        });

      if (existing) {

        console.log(

          "❌ Super Admin already exists"
        );

        process.exit();
      }

      // ======================
      // PASSWORD
      // ======================

      const plainPassword =
        "Super@123";

      const hashedPassword =
        await bcrypt.hash(

          plainPassword,

          10
        );

      // ======================
      // CREATE USER
      // ======================

      const superAdmin =
        await User.create({

          name:
            "Platform Owner",

          email:
            "superadmin@erp.com",

          password:
            hashedPassword,

          role:
            "super_admin",

          schoolId:
            "SUPER_ADMIN",

          mustChangePassword:
            false,

          status:
            "active",

          isActive:
            true
        });

      // ======================
      // SUCCESS
      // ======================

      console.log(
        "====================="
      );

      console.log(
        "✅ SUPER ADMIN CREATED"
      );

      console.log(
        "====================="
      );

      console.log(

        "EMAIL:",
        "superadmin@erp.com"
      );

      console.log(

        "PASSWORD:",
        plainPassword
      );

      console.log(
        "====================="
      );

      process.exit();

    } catch (err) {

      console.error(err);

      process.exit(1);
    }
  };

// ======================
// RUN
// ======================

createSuperAdmin();