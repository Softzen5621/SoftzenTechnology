const express =
  require("express");

const multer =
  require("multer");

const path =
  require("path");

const fs =
  require("fs");

const protect =
  require("../middlewares/authMiddleware");

const {

  getStudents,

  getStudentsBySection,

  getStudentById,

  addStudent,

  deleteStudent,

  updateStudent,

  importStudents

} = require(
  "../controllers/studentController"
);

const router =
  express.Router();

// CREATE UPLOADS FOLDER
const uploadPath =
  path.join(
    __dirname,
    "../uploads"
  );

if (
  !fs.existsSync(uploadPath)
) {

  fs.mkdirSync(uploadPath);
}

// MULTER STORAGE
const storage =
  multer.diskStorage({

    destination:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          uploadPath
        );
      },

    filename:
      function (
        req,
        file,
        cb
      ) {

        cb(

          null,

          Date.now() +

          "-" +

          file.originalname
        );
      }
  });

// FILE FILTER
const fileFilter =
  (
    req,
    file,
    cb
  ) => {

    const allowed =
      [

        ".xlsx",
        ".xls",
        ".csv"
      ];

    const ext =
      path.extname(
        file.originalname
      ).toLowerCase();

    if (
      allowed.includes(ext)
    ) {

      cb(null, true);

    } else {

      cb(

        new Error(
          "Only Excel or CSV files allowed"
        )
      );
    }
  };

// UPLOAD
const upload =
  multer({

    storage,

    fileFilter,

    limits: {
      fileSize:
        10 * 1024 * 1024
    }
  });

// PROTECT
router.use(protect);

// =========================
// IMPORT ROUTE
// IMPORTANT:
// KEEP ABOVE "/:id"
// =========================
router.post(

  "/import",

  upload.single("file"),

  importStudents
);

// GET ALL
router.get(
  "/",
  getStudents
);

// GET BY SECTION
router.get(
  "/section/:id",
  getStudentsBySection
);

// GET SINGLE
router.get(
  "/:id",
  getStudentById
);

// CREATE
router.post(
  "/",
  addStudent
);

// UPDATE
router.put(
  "/:id",
  updateStudent
);

// DELETE
router.delete(
  "/:id",
  deleteStudent
);

module.exports =
  router;
