// ======================================================
// ENV CONFIG
// ======================================================

require("dotenv").config();

// ======================================================
// CORE PACKAGES
// ======================================================

const express =
  require("express");

const cors =
  require("cors");

const path =
  require("path");

const http =
  require("http");

 const noticeRoutes = require("./routes/noticeRoutes");
// ======================================================
// SOCKET.IO
// ======================================================

const {

  Server

} = require(
  "socket.io"
);

// ======================================================
// DATABASE
// ======================================================

const connectDB =
  require("./config/db");

// ======================================================
// EXPRESS APP
// ======================================================

const app =
  express();

// ======================================================
// HTTP SERVER
// ======================================================

const server =
  http.createServer(app);

// ======================================================
// SOCKET SERVER
// ======================================================

const io =
  new Server(server, {

    cors: {

      origin: "*",

      methods: [

        "GET",

        "POST",

        "PUT",

        "DELETE"
      ]
    }
  });

// GLOBAL SOCKET ACCESS

global.io = io;

// ======================================================
// ROUTES IMPORTS
// ======================================================

const teacherRoutes =
  require("./routes/teacherRoutes");

const homeworkRoutes =
  require(
    "./routes/homeworkRoutes"
  );

const parentHomeworkRoutes =
  require(
    "./routes/parentHomeworkRoutes"
  );

  const settingsRoutes =
require("./routes/settingsRoutes");

const notificationRoutes =
  require(
    "./routes/notificationRoutes"
  );

  const paymentRoutes =
require(

  "./modules/fees/routes/paymentRoutes"
);

const parentFeesRoutes =
require(

  "./modules/fees/routes/parentFeesRoutes"
);

const adminFinanceRoutes =
require(

  "./modules/fees/routes/adminFinanceRoutes"
);

const feeStructureRoutes =
require(

  "./modules/fees/routes/feeStructureRoutes"
);

const studentFinanceRoutes =
require(

  "./modules/fees/routes/studentFinanceRoutes"
);

const collectionReportRoutes =
require(

  "./modules/fees/routes/collectionReportRoutes"
);

const academicYearRoutes =
require(

  "./modules/academics/routes/academicYearRoutes"
);

const transferCertificateRoutes =
require(
"./modules/certificates/routes/transferCertificateRoutes"
);

const promotionRoutes =
require(

"./modules/academics/routes/promotionRoutes"
);
// ======================================================
// CONNECT DATABASE
// ======================================================

connectDB();

// ======================================================
// SOCKET CONNECTION
// ======================================================

io.on(

  "connection",

  (socket) => {

    console.log(
      "🔌 SOCKET CONNECTED:",
      socket.id
    );

    // ======================================================
    // USER JOIN ROOM
    // ======================================================
socket.on(

  "join",

  (userId) => {

    console.log(
      "USER JOIN REQUEST:",
      userId
    );

    socket.join(
      userId.toString()
    );

    console.log(
      "USER JOINED ROOM:",
      userId
    );

    console.log(
      "SOCKET ROOMS:",
      socket.rooms
    );
  }
);

    // ======================================================
    // DISCONNECT
    // ======================================================

    socket.on(

      "disconnect",

      () => {

        console.log(
          "❌ SOCKET DISCONNECTED"
        );
      }
    );
  }
);

// ======================================================
// MIDDLEWARES
// ======================================================
app.use(

  "/api/payments/webhook/razorpay",

  require(

    "./modules/fees/routes/paymentRoutes"
  )
);

app.use(cors());

app.use(express.json({

  limit: "10mb"
}));

app.use(express.urlencoded({

  extended: true,

  limit: "10mb"
}));

// ======================================================
// STATIC FILES
// ======================================================
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);
// ======================================================
// API ROUTES
// ======================================================

// AUTH

app.use(

  "/api/auth",

  require("./routes/authRoutes")
);

// SUPER ADMIN

app.use(

  "/api/super-admin",

  require(
    "./routes/superAdminRoutes"
  )
);

// DASHBOARD

app.use(

  "/api/dashboard",

  require("./routes/dashboardRoutes")
);

// STUDENTS

app.use(

  "/api/students",

  require("./routes/studentRoutes")
);

// TEACHERS

app.use(

  "/api/teachers",

  teacherRoutes
);

// HOMEWORK

app.use(

  "/api/homeworks",

  homeworkRoutes
);

// PARENT HOMEWORK

app.use(

  "/api/parent-homework",

  parentHomeworkRoutes
);

// NOTIFICATIONS

app.use(

  "/api/notifications",

  notificationRoutes
);

// Notice
app.use("/api/notices", noticeRoutes);

// ATTENDANCE

app.use(

  "/api/attendance",

  require("./routes/attendanceRoutes")
);

// HOLIDAYS

app.use(

  "/api/holidays",

  require(
    "./routes/holidayRoutes"
  )
);

// SUBJECTS

app.use(

  "/api/subjects",

  require("./routes/subjectRoutes")
);

// SECTIONS

app.use(

  "/api/sections",

  require("./routes/sectionRoutes")
);

// FEES

// FEE PAYMENTS

app.use(

  "/api/collection-reports",

  collectionReportRoutes
);

app.use(

  "/api/transfer-certificates",

  transferCertificateRoutes
);

app.use(

  "/api/academic-years",

  academicYearRoutes
);

app.use(

"/api/promotions",

promotionRoutes
);


app.use(
  "/api/settings",
  settingsRoutes
);



app.use(

  "/api/student-finance",

  studentFinanceRoutes
);



app.use(

  "/api/admin-finance",

  adminFinanceRoutes
);

// ACTIVITY LOGS

app.use(

  "/api/activity-logs",

  require(
    "./routes/activityLogRoutes"
  )
);

app.use(

  "/api/payments",

  paymentRoutes
);

app.use(

  "/api/parent-fees",

  parentFeesRoutes
);

app.use(

  "/api/fee-structures",

  feeStructureRoutes
);


// ======================================================
// HOME ROUTE
// ======================================================

app.get(

  "/",

  (req, res) => {

    res.send(

      "🚀 School ERP API Running"
    );
  }
);

// ======================================================
// 404 ROUTE
// ======================================================

app.use(

  (req, res) => {

    res.status(404).json({

      success: false,

      msg:
        "Route not found"
    });
  }
);

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(

  (

    err,

    req,

    res,

    next

  ) => {

    console.error(

      "❌ SERVER ERROR:",

      err
    );

    return res.status(500).json({

      success: false,

      msg:

        err.message ||

        "Internal Server Error"
    });
  }
);

// ======================================================
// PORT
// ======================================================

const PORT =

  process.env.PORT ||

  5000;

// ======================================================
// START SERVER
// ======================================================

server.listen(

  PORT,

  () => {

    console.log(

      `🚀 Server running on port ${PORT}`
    );
  }
);