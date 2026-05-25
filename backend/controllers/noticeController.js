const Notice = require("../models/Notice");


// ======================================
// CREATE NOTICE
// ======================================

const createNotice = async (
  req,
  res
) => {

  try {

    const {
      title,
      description,
      audience,
      type,
      priority,
      popup,
      expiryDate,
    } = req.body;

    const notice =
      await Notice.create({

        title,

        description,

        audience:
          Array.isArray(audience)
            ? audience
            : [audience],

        type,

        priority,

        popup,

        expiryDate:
          expiryDate || null,

        attachment:
          req.file
            ? req.file.path
            : "",

        createdBy:
          req.user._id,
      });

    res.status(201).json({

      success: true,

      notice,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


// ======================================
// GET NOTICES
// ======================================

const getNotices = async (
  req,
  res
) => {

  try {

    const currentDate =
      new Date();

    const isAdmin =

      req.user.role ===
        "admin" ||

      req.user.role ===
        "Admin" ||

      req.user.role ===
        "schooladmin";

    let query = {

      $or: [

        {
          expiryDate: {
            $exists: false,
          },
        },

        {
          expiryDate: null,
        },

        {
          expiryDate: {
            $gte:
              currentDate,
          },
        },
      ],
    };

    // ====================================
    // USER FILTER
    // ====================================

    if (!isAdmin) {

      query.audience = {

        $in: [

          req.user.role,

          "all",
        ],
      };
    }

    let notices =
      await Notice.find(query)

        .sort({

          createdAt: -1,
        });

    // ====================================
    // REMOVE DUPLICATES
    // ====================================

    notices = notices.map(
      (notice) => {

        notice.viewedBy =
          notice.viewedBy.filter(
            (
              item,
              index,
              self
            ) =>

              index ===
              self.findIndex(
                (v) =>

                  v.userId.toString() ===
                  item.userId.toString()
              )
          );

        notice.acknowledgedBy =
          notice.acknowledgedBy.filter(
            (
              item,
              index,
              self
            ) =>

              index ===
              self.findIndex(
                (a) =>

                  a.userId.toString() ===
                  item.userId.toString()
              )
          );

        return notice;
      }
    );

    // ====================================
    // SORT
    // ====================================

    notices.sort((a, b) => {

      const order = {

        locked: 1,

        mandatory: 2,
      };

      return (
        (order[a.type] || 3) -
        (order[b.type] || 3)
      );
    });

    // ====================================
    // USER FILTER
    // ====================================

    if (!isAdmin) {

      notices =
        notices.filter(
          (notice) => {

            // LOCKED ALWAYS SHOW

            if (
              notice.type ===
              "locked"
            ) {

              return true;
            }

            // MANDATORY HIDE

            if (
              notice.type ===
              "mandatory"
            ) {

              const acknowledged =
                notice.acknowledgedBy.some(
                  (a) =>
                    a.userId.toString() ===
                    req.user._id.toString()
                );

              return !acknowledged;
            }

            return true;
          }
        );
    }

    res.status(200).json({

      success: true,

      notices,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


// ======================================
// UPDATE NOTICE
// ======================================

const updateNotice = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const notice =
      await Notice.findById(
        id
      );

    if (!notice) {

      return res.status(404).json({

        success: false,

        message:
          "Notice not found",
      });
    }

    const {
      title,
      description,
      audience,
      type,
      priority,
      popup,
      expiryDate,
    } = req.body;

    notice.title =
      title ||
      notice.title;

    notice.description =
      description ||
      notice.description;

    notice.audience =
      audience
        ? (
            Array.isArray(
              audience
            )
              ? audience
              : [audience]
          )
        : notice.audience;

    notice.type =
      type ||
      notice.type;

    notice.priority =
      priority ||
      notice.priority;

    notice.popup =
      popup !== undefined
        ? popup
        : notice.popup;

    notice.expiryDate =
      expiryDate || null;

    if (req.file) {

      notice.attachment =
        req.file.path;
    }

    await notice.save();

    res.status(200).json({

      success: true,

      message:
        "Notice updated successfully",

      notice,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


// ======================================
// DELETE NOTICE
// ======================================

const deleteNotice = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const notice =
      await Notice.findById(
        id
      );

    if (!notice) {

      return res.status(404).json({

        success: false,

        message:
          "Notice not found",
      });
    }

    await notice.deleteOne();

    res.status(200).json({

      success: true,

      message:
        "Notice deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        error.message,
    });
  }
};


// ======================================
// MARK VIEWED
// ======================================

const markNoticeViewed =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const notice =
        await Notice.findById(
          id
        );

      if (!notice) {

        return res.status(404).json({

          success: false,

          message:
            "Notice not found",
        });
      }

      // REMOVE DUPLICATES

      notice.viewedBy =
        notice.viewedBy.filter(
          (
            item,
            index,
            self
          ) =>

            index ===
            self.findIndex(
              (v) =>

                v.userId.toString() ===
                item.userId.toString()
            )
        );

      const alreadyViewed =

        notice.viewedBy.some(

          (v) =>

            v.userId.toString() ===

            req.user._id.toString()
        );

      if (!alreadyViewed) {

        notice.viewedBy.push({

          userId:
            req.user._id,

          role:
            req.user.role,

          viewedAt:
            new Date(),
        });
      }

      await notice.save();

      const updatedNotice =
        await Notice.findById(
          id
        );

      res.status(200).json({

        success: true,

        views:
          updatedNotice.viewedBy
            .length,

        notice:
          updatedNotice,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };


// ======================================
// ACKNOWLEDGE NOTICE
// ======================================

const acknowledgeNotice =
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const notice =
        await Notice.findById(
          id
        );

      if (!notice) {

        return res.status(404).json({

          success: false,

          message:
            "Notice not found",
        });
      }

      const userId =
        req.user._id.toString();

      // ==================================
      // REMOVE DUPLICATES
      // ==================================

      notice.viewedBy =
        notice.viewedBy.filter(
          (
            item,
            index,
            self
          ) =>

            index ===
            self.findIndex(
              (v) =>

                v.userId.toString() ===
                item.userId.toString()
            )
        );

      notice.acknowledgedBy =
        notice.acknowledgedBy.filter(
          (
            item,
            index,
            self
          ) =>

            index ===
            self.findIndex(
              (a) =>

                a.userId.toString() ===
                item.userId.toString()
            )
        );

      // ==================================
      // AUTO VIEW TRACK
      // ==================================

      const alreadyViewed =
        notice.viewedBy.some(
          (v) =>
            v.userId.toString() ===
            userId
        );

      if (!alreadyViewed) {

        notice.viewedBy.push({

          userId:
            req.user._id,

          role:
            req.user.role,

          viewedAt:
            new Date(),
        });
      }

      // ==================================
      // ACKNOWLEDGE TRACK
      // ==================================

      const alreadyAcknowledged =
        notice.acknowledgedBy.some(
          (a) =>
            a.userId.toString() ===
            userId
        );

      if (!alreadyAcknowledged) {

        notice.acknowledgedBy.push({

          userId:
            req.user._id,

          role:
            req.user.role,

          acknowledgedAt:
            new Date(),
        });
      }

      await notice.save();

      const updatedNotice =
        await Notice.findById(
          id
        );

      res.status(200).json({

        success: true,

        message:
          notice.type ===
          "locked"

            ? "Force notice acknowledged"

            : "Notice acknowledged",

        notice:
          updatedNotice,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };


module.exports = {

  createNotice,

  getNotices,

  updateNotice,

  deleteNotice,

  markNoticeViewed,

  acknowledgeNotice,
};