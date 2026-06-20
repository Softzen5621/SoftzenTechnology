import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// ======================================================
// AUTH PAGES
// ======================================================

import Login
from "./pages/Login";

import ChangePassword
from "./pages/teacher/ChangePassword";


// ======================================================
// ROUTE PROTECTION
// ======================================================

import ProtectedRoute
from "./components/ProtectedRoute";

import PublicRoute
from "./components/PublicRoute";

// ======================================================
// LAYOUTS
// ======================================================

import AdminLayout
from "./layouts/AdminLayout";

import SuperAdminLayout
from "./layouts/SuperAdminLayout";

import TeacherLayout
from "./layouts/TeacherLayout";

import ParentLayout
from "./layouts/ParentLayout";


// ======================================================
// SUPER ADMIN PAGES
// ======================================================

import Overview
from "./pages/superadmin/Overview";

import Schools
from "./pages/superadmin/Schools";

import Users
from "./pages/superadmin/Users";

import Subscriptions
from "./pages/superadmin/Subscriptions";

import Security
from "./pages/superadmin/Security";

import Activity
from "./pages/superadmin/Activity";

import AICenter
from "./pages/superadmin/AICenter";

import SuperAdminSettings
from "./pages/superadmin/Settings";
// ======================================================
// ADMIN PAGES
// ======================================================


import Dashboard
from "./pages/admin/Dashboard";

import Students
from "./pages/admin/Students";

import AddStudent
from "./pages/admin/AddStudent";

import StudentProfile
from "./pages/admin/StudentProfile";

import Teachers
from "./pages/admin/Teachers";

import TeacherDetails
from "./pages/admin/TeacherDetails";

import TransferCertificates
from "./pages/admin/TransferCertificates";

import TransferCertificateView
from "./pages/admin/TransferCertificateView";

import Attendance
from "./pages/admin/Attendance";

import Subjects
from "./pages/admin/Subjects";

import Sections
from "./pages/admin/Sections";

import SectionDetails
from "./pages/admin/SectionDetails";

import AdminFinanceDashboard
from "./pages/admin/AdminFinanceDashboard";

import PromotionManagement
from "./pages/admin/PromotionManagement";

import AcademicYears
from "./pages/admin/AcademicYears";
import Settings
from "./pages/admin/Settings";


import ActivityLogs
from "./pages/admin/ActivityLogs";

// ======================================================
// FEES
// ======================================================


import FeeStructures
from "./pages/admin/FeeStructures";



import CollectFees
from "./pages/admin/CollectFees";

import CollectionReports
from "./pages/admin/CollectionReports";

// ======================================================
// EXAMS
// ======================================================

import Exams
from "./pages/admin/Exams";

import MarksEntry
from "./pages/admin/MarksEntry";

import Results
from "./pages/admin/Results";

import Holidays
from "./pages/admin/Holidays";

// ======================================================
// TEACHER PAGES
// ======================================================

import TeacherDashboard
from "./pages/teacher/Dashboard";

import TeacherAttendance
from "./pages/teacher/Attendance";

import Homework
from "./pages/teacher/Homework";

import HomeworkDetails
from "./pages/teacher/HomeworkDetails";

import MyClasses
from "./pages/teacher/MyClasses";

import Timetable
from "./pages/teacher/Timetable";

import Leave
from "./pages/teacher/Leave";

import Profile
from "./pages/teacher/Profile";

// ======================================================
// PARENT PAGES
// ======================================================

import ParentDashboard
from "./pages/parent/Dashboard";

import ParentAttendance
from "./pages/parent/Attendance";

import ParentFees
from "./pages/parent/Fees";

import ParentResults
from "./pages/parent/Results";

import ParentHomework
from "./pages/parent/ParentHomework";

import FeesDashboard
from "./pages/parent/FeesDashboard";

import Notices from "./pages/admin/Notices";
import AllNotices from "./pages/shared/AllNotices";

// ======================================================
// APP
// ======================================================

export default function App() {

  return (

    <Routes>

      {/* ======================================================
          PUBLIC ROUTES
      ====================================================== */}

      <Route
        path="/"
        element={

          <PublicRoute>

            <Login />

          </PublicRoute>
        }
      />

      {/* ======================================================
          SUPER ADMIN PANEL
      ====================================================== */}

      <Route
        path="/super-admin"
        element={

          <ProtectedRoute
            allowedRoles={[
              "super_admin"
            ]}
          >

            <SuperAdminLayout />

          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<Overview />}
        />

        <Route
          path="schools"
          element={<Schools />}
        />

        <Route
          path="users"
          element={<Users />}
        />

        <Route
          path="subscriptions"
          element={<Subscriptions />}
        />

        <Route
          path="security"
          element={<Security />}
        />

        <Route
          path="activity"
          element={<Activity />}
        />

        <Route
          path="ai"
          element={<AICenter />}
        />

        <Route
  path="settings"
  element={<SuperAdminSettings />}
/>
      </Route>

      {/* ======================================================
          ADMIN PANEL
      ====================================================== */}

      <Route
        path="/admin"
        element={

          <ProtectedRoute
            allowedRoles={[
              "admin"
            ]}
          >

            <AdminLayout />

          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<Dashboard />}
        />
<Route
  path="transfer-certificates"
  element={
    <TransferCertificates />
  }
/>

<Route
  path="transfer-certificates/:id"
  element={<TransferCertificateView />}
/>

        <Route
          path="students"
          element={<Students />}
        />

        <Route
  path="students/add"
  element={<AddStudent />}
/>
        
        <Route
          path="student/:id"
          element={<StudentProfile />}
        />

        

        <Route
          path="teachers"
          element={<Teachers />}
        />

        <Route
          path="teachers/:id"
          element={<TeacherDetails />}
        />

        <Route
          path="attendance"
          element={<Attendance />}
        />
        

        <Route
          path="subjects"
          element={<Subjects />}
        />

        <Route
          path="classes"
          element={<Sections />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />

        <Route
          path="classes/:id"
          element={<SectionDetails />}
        />

       <Route
  path="promotions"
  element={<PromotionManagement />}
/>

<Route
  path="academic-years"
  element={<AcademicYears />}
/>

       <Route

  path="fee-structures"

  element={<FeeStructures />}

/>

        <Route
          path="collect-fees"
          element={<CollectFees />}
        />

       <Route

  path="collection-reports"

  element={
    <CollectionReports />
  }

/>

      <Route

  path="finance"

  element={
    <AdminFinanceDashboard />
  }

/>

      

        <Route
          path="activity-logs"
          element={<ActivityLogs />}
        />

        <Route
          path="exams"
          element={<Exams />}
        />

        <Route
          path="marks-entry"
          element={<MarksEntry />}
        />

        <Route
          path="results"
          element={<Results />}
        />

        <Route
          path="holidays"
          element={<Holidays />}
        />
        <Route
  path="notices"
  element={<Notices />}
/>

<Route
  path="all-notices"
  element={<AllNotices />}
/>

      </Route>

      {/* ======================================================
          TEACHER CHANGE PASSWORD
      ====================================================== */}

      <Route
        path="/teacher/change-password"
        element={

          <ProtectedRoute
            allowedRoles={[
              "teacher"
            ]}
          >

            <ChangePassword />

          </ProtectedRoute>
        }
      />

      {/* ======================================================
          TEACHER PANEL
      ====================================================== */}

      <Route
        path="/teacher"
        element={

          <ProtectedRoute
            allowedRoles={[
              "teacher"
            ]}
          >

            <TeacherLayout />

          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<TeacherDashboard />}
        />

        <Route
          path="attendance"
          element={<TeacherAttendance />}
        />

        <Route
          path="homework"
          element={<Homework />}
        />

        <Route
          path="homeworks/:id"
          element={<HomeworkDetails />}
        />

        <Route
          path="classes"
          element={<MyClasses />}
        />

        <Route
          path="timetable"
          element={<Timetable />}
        />

        <Route
          path="leave"
          element={<Leave />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        <Route
  path="notices"
  element={<AllNotices />}
/>

      </Route>

      {/* ======================================================
          PARENT PANEL
      ====================================================== */}

      <Route
        path="/parent"
        element={

          <ProtectedRoute
            allowedRoles={[
              "parent"
            ]}
          >

            <ParentLayout />

          </ProtectedRoute>
        }
      >

        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={
            <ParentDashboard />
          }
        />

        <Route
          path="attendance"
          element={
            <ParentAttendance />
          }
        />

        <Route
          path="fees"
          element={
            <ParentFees />
          }
        />

        <Route
          path="results"
          element={
            <ParentResults />
          }
        />

        <Route
          path="homework"
          element={
            <ParentHomework />
          }
        />
<Route

  path="fees-dashboard"

  element={<FeesDashboard />}

/>
        

        <Route
  path="notices"
  element={<AllNotices />}
/>

     
      </Route>

      {/* ======================================================
          FALLBACK ROUTE
      ====================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}