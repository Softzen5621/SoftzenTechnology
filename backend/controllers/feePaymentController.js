const FeePayment =
  require("../models/FeePayment");

const Student =
  require("../models/Student");

const FeeStructure =
  require("../models/FeeStructure");

// ======================
// GET ALL PAYMENTS
// ======================

const getPayments =
  async (req, res) => {

    try {

      const payments =
        await FeePayment.find({

          schoolId:
            req.user.schoolId
        })

        .populate(

          "studentId",

          "name studentId"
        )

        .populate(

          "feeStructureId",

          "feeType amount"
        )

        .sort({
          createdAt: -1
        });

      res.json(payments);

    } catch (err) {

      console.error(
        "GET PAYMENTS ERROR:",
        err
      );

      res.status(500).json({

        msg:
          "Error fetching payments"
      });
    }
  };

// ======================
// ADD PAYMENT
// ======================

const addPayment =
  async (req, res) => {

    try {

      const {

        studentId,

        feeStructureId,

        amountPaid,

        paymentMode,

        paymentDate,

        remarks

      } = req.body;

      // VALIDATION
      if (

        !studentId ||

        !feeStructureId ||

        !amountPaid ||

        !paymentMode ||

        !paymentDate
      ) {

        return res.status(400).json({

          msg:
            "All required fields must be filled"
        });
      }

      // STUDENT CHECK
      const student =
        await Student.findById(
          studentId
        );

      if (!student) {

        return res.status(404).json({

          msg:
            "Student not found"
        });
      }

      // FEE CHECK
      const fee =
        await FeeStructure.findById(
          feeStructureId
        );

      if (!fee) {

        return res.status(404).json({

          msg:
            "Fee structure not found"
        });
      }

      // CALCULATIONS
      const totalAmount =
        fee.amount;

      const pendingAmount =
        totalAmount - amountPaid;

      let paymentStatus =
        "Pending";

      if (
        pendingAmount <= 0
      ) {

        paymentStatus =
          "Paid";

      } else if (
        amountPaid > 0
      ) {

        paymentStatus =
          "Partial";
      }

      // RECEIPT NUMBER
      const receiptNumber =
        "RCPT-" +
        Date.now();

      // CREATE
      const payment =
        await FeePayment.create({

          schoolId:
            req.user.schoolId,

          studentId,

          feeStructureId,

          amountPaid,

          totalAmount,

          pendingAmount,

          paymentMode,

          receiptNumber,

          paymentDate,

          paymentStatus,

          remarks
        });

      res.status(201).json({

        msg:
          "Payment collected successfully",

        payment
      });

    } catch (err) {

      console.error(
        "ADD PAYMENT ERROR:",
        err
      );

      res.status(500).json({

        msg:
          "Error collecting payment"
      });
    }
  };

// ======================
// DELETE PAYMENT
// ======================

const deletePayment =
  async (req, res) => {

    try {

      const payment =
        await FeePayment.findOneAndDelete({

          _id:
            req.params.id,

          schoolId:
            req.user.schoolId
        });

      if (!payment) {

        return res.status(404).json({

          msg:
            "Payment not found"
        });
      }

      res.json({

        msg:
          "Payment deleted"
      });

    } catch (err) {

      console.error(
        "DELETE PAYMENT ERROR:",
        err
      );

      res.status(500).json({

        msg:
          "Error deleting payment"
      });
    }
  };

module.exports = {

  getPayments,

  addPayment,

  deletePayment
};