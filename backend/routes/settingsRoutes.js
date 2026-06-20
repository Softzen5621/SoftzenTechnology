const express =
require("express");

const router =
express.Router();

const protect =
require("../middlewares/authMiddleware");

const upload =
require("../middlewares/upload");

const {

  getSettings,

  updateSettings

} = require(
  "../controllers/settingsController"
);

router.use(protect);

router.get(
  "/",
  getSettings
);

router.put(
  "/",
  upload.fields([

    {
      name: "logo",
      maxCount: 1
    },

    {
      name: "principalSignature",
      maxCount: 1
    },

    {
      name: "schoolSeal",
      maxCount: 1
    }

  ]),
  updateSettings
);

module.exports =
router;