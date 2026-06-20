const FeeLedger =
require(
  "../models/FeeLedger"
);

const StudentFeeProfile =
require(
  "../models/StudentFeeProfile"
);

const PaymentOrder =
require(
  "../models/PaymentOrder"
);



// ======================
// GET ADMIN DASHBOARD
// ======================

const getAdminFinanceDashboard =
async (req, res) => {

  try {

    const schoolId =
      req.user.schoolId;



    // ======================
    // TOTAL COLLECTION
    // ======================

    const totalCollectionResult =

      await FeeLedger.aggregate([

        {

          $match: {

            schoolId,

            transactionType:
              "PAYMENT_SUCCESS",

            status:
              "SUCCESS",

            isDeleted: false
          }
        },

        {

          $group: {

            _id: null,

            total: {

              $sum: "$amount"
            }
          }
        }
      ]);



    const totalCollection =

      totalCollectionResult[0]
      ?.total || 0;



    // ======================
    // TOTAL PENDING
    // ======================

    const pendingResult =

      await StudentFeeProfile.aggregate([

        {

          $match: {

            schoolId,

            isDeleted: false
          }
        },

        {

          $group: {

            _id: null,

            totalPending: {

              $sum:
                "$totalPendingAmount"
            }
          }
        }
      ]);



    const totalPending =

      pendingResult[0]
      ?.totalPending || 0;



    // ======================
    // CASH COLLECTION
    // ======================

    const cashCollectionResult =

      await FeeLedger.aggregate([

        {

          $match: {

            schoolId,

            transactionType:
              "PAYMENT_SUCCESS",

            paymentMethod:
              "CASH",

            status:
              "SUCCESS"
          }
        },

        {

          $group: {

            _id: null,

            total: {

              $sum: "$amount"
            }
          }
        }
      ]);



    const cashCollection =

      cashCollectionResult[0]
      ?.total || 0;



    // ======================
    // ONLINE COLLECTION
    // ======================

    const onlineCollectionResult =

      await FeeLedger.aggregate([

        {

          $match: {

            schoolId,

            transactionType:
              "PAYMENT_SUCCESS",

            paymentMethod:
              "ONLINE",

            status:
              "SUCCESS"
          }
        },

        {

          $group: {

            _id: null,

            total: {

              $sum: "$amount"
            }
          }
        }
      ]);



    const onlineCollection =

      onlineCollectionResult[0]
      ?.total || 0;



    // ======================
    // FAILED PAYMENTS
    // ======================

    const failedPayments =

      await PaymentOrder.countDocuments({

        schoolId,

        paymentStatus:
          "FAILED"
      });



    // ======================
    // RECENT PAYMENTS
    // ======================

    const recentTransactions =

      await FeeLedger.find({

        schoolId,

        transactionType:
          "PAYMENT_SUCCESS"

      })

      .sort({

        createdAt: -1
      })

      .limit(10);




    // ======================
    // DAILY COLLECTION
    // ======================

    const dailyCollection =

      await FeeLedger.aggregate([

        {

          $match: {

            schoolId,

            transactionType:
              "PAYMENT_SUCCESS",

            status:
              "SUCCESS"
          }
        },

        {

          $group: {

            _id: {

              date: {

                $dateToString: {

                  format:
                    "%Y-%m-%d",

                  date:
                    "$createdAt"
                }
              }
            },

            total: {

              $sum: "$amount"
            }
          }
        },

        {

          $sort: {

            "_id.date": -1
          }
        },

        {

          $limit: 7
        }
      ]);



    // ======================
    // RESPONSE
    // ======================

    return res.status(200).json({

      success: true,



      summary: {

        totalCollection,

        totalPending,

        cashCollection,

        onlineCollection,

        failedPayments
      },



      dailyCollection,



      recentTransactions
    });

  } catch (error) {

    console.error(

      "ADMIN FINANCE DASHBOARD ERROR:",

      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Failed to load dashboard"
    });
  }
};



// ======================
// EXPORTS
// ======================

module.exports = {

  getAdminFinanceDashboard
};