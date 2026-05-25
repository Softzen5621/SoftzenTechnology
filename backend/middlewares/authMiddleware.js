const jwt =
  require("jsonwebtoken");

// ======================================================
// GET TOKEN
// ======================================================

const getToken =
  (authorizationHeader = "") => {

    try {

      if (!authorizationHeader) {

        return "";
      }

      // ======================================================
      // BEARER TOKEN
      // ======================================================

      if (

        authorizationHeader.startsWith(
          "Bearer "
        )

      ) {

        return authorizationHeader
          .split(" ")[1]
          .trim();
      }

      return authorizationHeader.trim();

    } catch (err) {

      return "";
    }
  };

// ======================================================
// AUTH MIDDLEWARE
// ======================================================

const protect =
  (

    req,

    res,

    next

  ) => {

    try {

      // ======================================================
      // GET TOKEN
      // ======================================================

      const token =
        getToken(

          req.headers.authorization
        );

      // ======================================================
      // NO TOKEN
      // ======================================================

      if (!token) {

        return res.status(401).json({

          success: false,

          msg:
            "Authorization token required"
        });
      }

      // ======================================================
      // VERIFY TOKEN
      // ======================================================

      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET ||
          "secret"
        );

      // ======================================================
      // INVALID TOKEN
      // ======================================================

      if (!decoded) {

        return res.status(401).json({

          success: false,

          msg:
            "Invalid token"
        });
      }

      // ======================================================
      // SCHOOL SECURITY
      // ======================================================

      if (!decoded.schoolId) {

        return res.status(401).json({

          success: false,

          msg:
            "Invalid school context"
        });
      }

      // ======================================================
      // SET USER
      // ======================================================

      req.user = {

        _id:
          decoded._id || "",

        name:
          decoded.name || "",

        email:
          decoded.email || "",

        role:

          decoded.role
            ?.toLowerCase() || "",

        schoolId:
          decoded.schoolId || ""
      };

      // ======================================================
      // NEXT
      // ======================================================

      return next();

    } catch (error) {

      console.error(

        "AUTH ERROR:",

        error.message
      );

      return res.status(401).json({

        success: false,

        msg:
          "Invalid or expired token"
      });
    }
  };

// ======================================================
// ROLE AUTHORIZATION
// ======================================================

const authorizeRoles =
  (...roles) => {

    return (

      req,

      res,

      next

    ) => {

      try {

        // ======================================================
        // USER CHECK
        // ======================================================

        if (!req.user) {

          return res.status(401).json({

            success: false,

            msg:
              "Unauthorized access"
          });
        }

        // ======================================================
        // NORMALIZE ROLES
        // ======================================================

        const allowedRoles =

          roles.map(

            (role) =>

              role.toLowerCase()
          );

        const userRole =

          req.user.role?.toLowerCase();

        // ======================================================
        // ROLE CHECK
        // ======================================================

        if (

          !allowedRoles.includes(
            userRole
          )

        ) {

          return res.status(403).json({

            success: false,

            msg:
              "Access denied"
          });
        }

        // ======================================================
        // NEXT
        // ======================================================

        return next();

      } catch (err) {

        console.error(

          "ROLE ERROR:",

          err.message
        );

        return res.status(500).json({

          success: false,

          msg:
            "Authorization failed"
        });
      }
    };
  };

// ======================================================
// EXPORTS
// ======================================================

module.exports =
  protect;

module.exports.authorizeRoles =
  authorizeRoles;