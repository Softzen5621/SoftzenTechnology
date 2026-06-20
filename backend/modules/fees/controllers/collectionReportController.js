const FeeLedger =
require(
  "../models/FeeLedger"
);



// ======================
// DAILY COLLECTION
// ======================

const getDailyCollection =
async (req, res) => {

  try {

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );



    const tomorrow =
      new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );



    // ======================
    // FIND ENTRIES
    // ======================

    const collections =
      await FeeLedger.find({

        schoolId:
          req.user.schoolId,

        transactionType:
          "PAYMENT",

        createdAt: {

          $gte: today,

          $lt: tomorrow
        }
      });




    // ======================
    // TOTALS
    // ======================

    let totalCollection = 0;

    let cashCollection = 0;

    let onlineCollection = 0;



    collections.forEach(
      (item) => {

        totalCollection +=
          item.amount || 0;



        if (
          item.paymentMethod
          === "CASH"
        ) {

          cashCollection +=
            item.amount || 0;
        }



        if (
          item.paymentMethod
          === "ONLINE"
        ) {

          onlineCollection +=
            item.amount || 0;
        }
      }
    );



    return res.status(200).json({

      success: true,



      totalCollection,



      cashCollection,



      onlineCollection,



      totalTransactions:
        collections.length,



      collections
    });

  } catch (error) {

    console.error(

      "DAILY REPORT ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch report"
    });
  }
};



// ======================
// MONTHLY COLLECTION
// ======================

const getMonthlyCollection =
async (req, res) => {

  try {

    const start =
      new Date(

        new Date()
        .getFullYear(),

        new Date()
        .getMonth(),

        1
      );



    const end =
      new Date(

        new Date()
        .getFullYear(),

        new Date()
        .getMonth() + 1,

        1
      );



    const collections =
      await FeeLedger.find({

        schoolId:
          req.user.schoolId,

        transactionType:
          "PAYMENT",

        createdAt: {

          $gte: start,

          $lt: end
        }
      });




    const total =
      collections.reduce(

        (sum, item) =>

          sum +
          (item.amount || 0),

        0
      );



    return res.status(200).json({

      success: true,

      total,

      totalTransactions:
        collections.length,

      collections
    });

  } catch (error) {

    console.error(

      "MONTHLY REPORT ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to fetch report"
    });
  }
};



// ======================
// EXPORTS
// ======================

module.exports = {

  getDailyCollection,

  getMonthlyCollection
};