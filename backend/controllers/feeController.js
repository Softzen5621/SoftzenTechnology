const FeeStructure =
  require("../models/FeeStructure");

const logActivity =
  require("../utils/logActivity");

// ======================
// GET ALL FEES
// ======================

const getFees =
  async (req, res) => {

    try {

      const fees =
        await FeeStructure.find({

          schoolId:
            req.user.schoolId
        })

        .sort({

          createdAt: -1
        });

      res.json(fees);

    } catch (err) {

      console.error(
        "GET FEES ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          "Error fetching fees"
      });
    }
  };

// ======================
// ADD FEE
// ======================

const addFee =
  async (req, res) => {

    console.log(
      "🚀 ADD FEE API HIT"
    );

    try {

      console.log(
        "REQ USER:",
        req.user
      );

      const {

        academicYear,

        className,

        feeType,

        amount,

        frequency,

        dueDate,

        reason
      } = req.body;

      // VALIDATION
      if (

        !academicYear ||

        !className ||

        !feeType ||

        !amount ||

        !frequency ||

        !dueDate
      ) {

        return res.status(400).json({

          success: false,

          msg:
            "All fields are required"
        });
      }

      // CREATE
      const fee =
        await FeeStructure.create({

          schoolId:
            req.user.schoolId,

          academicYear,

          className,

          feeType,

          amount,

          frequency,

          dueDate
        });

      console.log(
        "✅ FEE CREATED"
      );

      // ======================
      // ACTIVITY LOG
      // ======================

      console.log(
        "🔥 BEFORE LOG ACTIVITY"
      );

      await logActivity({

        req,

        actionType:
          "CREATE",

        module:
          "FEES",

        description:
          "New fee structure created",

        documentId:
          fee._id.toString(),

        collectionName:
          "FeeStructure",

        newData:
          fee,

        changedFields: [

          "academicYear",

          "className",

          "feeType",

          "amount"
        ],

        reason:

          reason ||

          "New fee structure added",

        isSensitive: true,

        severity: "HIGH"
      });

      console.log(
        "✅ ACTIVITY LOG SAVED"
      );

      res.status(201).json({

        success: true,

        msg:
          "Fee structure created",

        fee
      });

    } catch (err) {

      console.error(
        "❌ ADD FEE ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          err.message ||
          "Error adding fee"
      });
    }
  };

// ======================
// UPDATE FEE
// ======================

const updateFee =
  async (req, res) => {

    try {

      const oldFee =
        await FeeStructure.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId
        });

      if (!oldFee) {

        return res.status(404).json({

          success: false,

          msg:
            "Fee structure not found"
        });
      }

      // UPDATE
      const updatedFee =
        await FeeStructure.findOneAndUpdate(

          {

            _id:
              req.params.id,

            schoolId:
              req.user.schoolId
          },

          req.body,

          {

            new: true
          }
        );

      console.log(
        "✅ FEE UPDATED"
      );

      // CHANGED FIELDS
      const changedFields =
        Object.keys(req.body);

      // ======================
      // LOG
      // ======================

      await logActivity({

        req,

        actionType:
          "UPDATE",

        module:
          "FEES",

        description:
          "Fee structure updated",

        documentId:
          updatedFee._id.toString(),

        collectionName:
          "FeeStructure",

        oldData:
          oldFee,

        newData:
          updatedFee,

        changedFields,

        reason:

          req.body.reason ||

          "Fee updated",

        isSensitive: true,

        severity: "HIGH"
      });

      console.log(
        "✅ UPDATE LOG SAVED"
      );

      res.json({

        success: true,

        msg:
          "Fee updated",

        fee:
          updatedFee
      });

    } catch (err) {

      console.error(
        "❌ UPDATE FEE ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          err.message ||
          "Error updating fee"
      });
    }
  };

// ======================
// DELETE FEE
// ======================

const deleteFee =
  async (req, res) => {

    try {

      // FIND
      const fee =
        await FeeStructure.findOne({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId
        });

      if (!fee) {

        return res.status(404).json({

          success: false,

          msg:
            "Fee structure not found"
        });
      }

      // DELETE
      await FeeStructure.deleteOne({

        _id:
          req.params.id
      });

      console.log(
        "✅ FEE DELETED"
      );

      // ======================
      // LOG
      // ======================

      await logActivity({

        req,

        actionType:
          "DELETE",

        module:
          "FEES",

        description:
          "Fee structure deleted",

        documentId:
          fee._id.toString(),

        collectionName:
          "FeeStructure",

        oldData:
          fee,

        changedFields: [

          "deleted"
        ],

        reason:

  req.body?.reason ||

  "Fee deleted",

        isSensitive: true,

        severity:
          "CRITICAL"
      });

      console.log(
        "✅ DELETE LOG SAVED"
      );

      res.json({

        success: true,

        msg:
          "Fee deleted"
      });

    } catch (err) {

      console.error(
        "❌ DELETE FEE ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        msg:
          err.message ||
          "Error deleting fee"
      });
    }
  };

// ======================
// EXPORTS
// ======================

module.exports = {

  getFees,

  addFee,

  updateFee,

  deleteFee
};