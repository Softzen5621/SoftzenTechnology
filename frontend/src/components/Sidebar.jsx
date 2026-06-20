import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  Bell,
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = () => {

  const location =
    useLocation();

  const menuItems = [

    {
      name: "Dashboard",
      icon: "🏠",
      path: "/admin"
    },

    {
      name: "Students",
      icon: "🎓",
      path: "/admin/students"
    },

    {
      name: "Teachers",
      icon: "👨‍🏫",
      path: "/admin/teachers"
    },

    {
      name: "Classes",
      icon: "🏫",
      path: "/admin/classes"
    },

    {
      name: "Subjects",
      icon: "📘",
      path: "/admin/subjects"
    },

    {
      name: "Academic Years",
      icon: "📅",
      path: "/admin/academic-years"
    },

    {
      name: "Promotion Management",
      icon: "🚀",
      path: "/admin/promotions"
    },

    {
      name: "Attendance",
      icon: "🗓️",
      path: "/admin/attendance"
    },

    {
      name: "Notices",
      icon: <Bell size={18} />,
      path: "/admin/notices"
    },

    {
      name: "Finance Dashboard",
      icon: "💰",
      path: "/admin/finance"
    },

    {
      name: "Fee Structures",
      icon: "📑",
      path: "/admin/fee-structures"
    },

    {
      name: "Collect Fees",
      icon: "💵",
      path: "/admin/collect-fees"
    },

    {
      name: "Collection Reports",
      icon: "📊",
      path: "/admin/collection-reports"
    },

    {
      name: "Exams",
      icon: "📝",
      path: "/admin/exams"
    },

    {
      name: "Marks Entry",
      icon: "✍️",
      path: "/admin/marks-entry"
    },

    {
      name: "Results",
      icon: "🏆",
      path: "/admin/results"
    },

    {
      name: "Holidays",
      icon: "🎉",
      path: "/admin/holidays"
    },

    {
      name: "Activity Logs",
      icon: "📋",
      path: "/admin/activity-logs"
    }
  ];

  return (

    <div className="sidebar">

      <div className="sidebar-logo">

        <h2>
          SoftZen ERP
        </h2>

      </div>

      <div className="sidebar-menu">

        {
          menuItems.map((item) => (

            <Link
              key={item.name}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >

              <span className="icon">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </Link>
          ))
        }

      </div>

    </div>
  );
};

export default Sidebar;