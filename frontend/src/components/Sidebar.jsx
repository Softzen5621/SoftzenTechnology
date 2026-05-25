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
      name: "Fees",
      icon: "💰",
      path: "/admin/fees"
    },

    {
      name: "Exams",
      icon: "📝",
      path: "/admin/exams"
    },

    {
      name: "Reports",
      icon: "📊",
      path: "/admin/reports"
    },

    {
      name: "Settings",
      icon: "⚙️",
      path: "/admin/settings"
    }
  ];

  return (

    <div className="sidebar">

      {/* LOGO */}

      <div className="sidebar-logo">

        <h2>
          SoftZen ERP
        </h2>

      </div>

      {/* MENU */}

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