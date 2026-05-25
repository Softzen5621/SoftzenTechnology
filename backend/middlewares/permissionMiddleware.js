const checkPermission =

  (...allowedRoles) => {

    return (

      req,

      res,

      next

    ) => {

      try {

        // ======================
        // USER CHECK
        // ======================

        if (!req.user) {

          return res.status(401).json({

            success: false,

            message:
              "Unauthorized access"
          });
        }

        // ======================
        // ROLE CHECK
        // ======================

        if (

          !allowedRoles.includes(
            req.user.role
          )

        ) {

          return res.status(403).json({

            success: false,

            message:
              "Access denied"
          });
        }

        next();

      } catch (err) {

        console.error(err);

        return res.status(500).json({

          success: false,

          message:
            "Permission middleware error"
        });
      }
    };
  };

// ✅ IMPORTANT EXPORT
module.exports =
  checkPermission;