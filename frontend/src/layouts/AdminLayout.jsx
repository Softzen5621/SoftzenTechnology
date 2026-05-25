import {
  useState
} from "react";

import {
  Link,
  Outlet,
  useLocation
} from "react-router-dom";

import {
  LayoutDashboard,
  GraduationCap,
  Users,
  School,
  BookOpen,
  CalendarDays,
  CalendarCheck,
  Wallet,
  CreditCard,
  AlertCircle,
  FileText,
  ClipboardCheck,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  ScrollText
} from "lucide-react";



import {
  useAuth
} from "../context/AuthContext";

export default function AdminLayout() {

  const [open, setOpen] =
    useState(true);

  const location =
    useLocation();

  const {
    user,
    logout
  } = useAuth();

  // ======================
  // MENU
  // ======================

  const menu = [

    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard
    },

    {
      name: "Students",
      path: "/admin/students",
      icon: GraduationCap
    },

    {
      name: "Teachers",
      path: "/admin/teachers",
      icon: Users
    },

    {
      name: "Classes",
      path: "/admin/classes",
      icon: School
    },

    {
      name: "Subjects",
      path: "/admin/subjects",
      icon: BookOpen
    },

    {
      name: "Attendance",
      path: "/admin/attendance",
      icon: CalendarCheck
    },

    {
      name: "Fees",
      path: "/admin/fees",
      icon: Wallet
    },

    {
      name: "Collect Fees",
      path: "/admin/collect-fees",
      icon: CreditCard
    },

    {
      name: "Pending Fees",
      path: "/admin/pending-fees",
      icon: AlertCircle
    },

    {
      name: "Exams",
      path: "/admin/exams",
      icon: FileText
    },

    {
      name: "Marks Entry",
      path: "/admin/marks-entry",
      icon: ClipboardCheck
    },

    {
      name: "Results",
      path: "/admin/results",
      icon: BarChart3
    },
    {
  name: "Holidays",

  path: "/admin/holidays",

  icon: CalendarDays
},

    {
  name: "Activity Logs",
  path: "/admin/activity-logs",
  icon: ScrollText
},

{
  name: "Notices",
  path: "/admin/notices",
  icon: Bell
},

{
  name: "Settings",
  path: "/admin/settings",
  icon: Settings
}
  ];

  return (

    <div
      className="
        flex
        min-h-screen
        bg-slate-100
      "
    >

      {/* SIDEBAR */}
      <div
        className={`

          ${
            open
              ? "w-[270px]"
              : "w-[90px]"
          }

          transition-all
          duration-300
          bg-[#071028]
          text-white
          flex
          flex-col
          border-r
          border-slate-800
          shadow-2xl
        `}
      >

        {/* LOGO */}
        <div
          className="
            h-[85px]
            px-6
            flex
            items-center
            justify-between
            border-b
            border-slate-800
          "
        >

          {open && (

            <div>

              <h1
                className="
                  text-3xl
                  font-black
                  tracking-tight
                  bg-gradient-to-r
                  from-cyan-400
                  to-blue-500
                  bg-clip-text
                  text-transparent
                "
              >
                SOFTZEN
              </h1>
              

              <p
                className="
                  text-xs
                  text-slate-400
                  mt-1
                "
              >
                Enterprise ERP
              </p>

            </div>
          )}

          <button

            onClick={() =>
              setOpen(!open)
            }

            className="
              w-10
              h-10
              rounded-xl
              bg-slate-800
              hover:bg-slate-700
              flex
              items-center
              justify-center
              transition
            "
          >

            {

              open

                ? <X size={20} />

                : <Menu size={20} />
            }

          </button>
        </div>

        {/* MENU */}
        <div
          className="
            flex-1
            py-6
            px-4
            overflow-y-auto
          "
        >

          <div
            className="
              space-y-2
            "
          >

            {menu.map((item) => {

              const Icon =
                item.icon;

              const active =

                location.pathname ===
                item.path ||

                location.pathname.startsWith(
                  item.path + "/"
                );

              return (

                <Link

                  key={item.path}

                  to={item.path}

                  className={`

                    flex
                    items-center
                    gap-4
                    px-4
                    py-4
                    rounded-2xl
                    transition-all
                    duration-200
                    group

                    ${
                      active

                        ? `
                          bg-gradient-to-r
                          from-cyan-500
                          to-blue-600
                          shadow-lg
                          shadow-cyan-500/20
                        `

                        : `
                          hover:bg-slate-800
                        `
                    }
                  `}
                >

                  <Icon
                    size={22}
                  />

                  {open && (

                    <span
                      className="
                        font-medium
                        text-[15px]
                      "
                    >
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* USER */}
        <div
          className="
            border-t
            border-slate-800
            p-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              bg-slate-900
              rounded-2xl
              p-3
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-full
                bg-gradient-to-r
                from-cyan-400
                to-blue-600
                flex
                items-center
                justify-center
                text-lg
                font-bold
              "
            >
              {

                user?.fullName || user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "A"
              }
            </div>

            {open && (

              <div
                className="
                  flex-1
                "
              >

                <h3
                  className="
                    font-semibold
                    text-sm
                  "
                >
                  {
                    user?.fullName || user?.name ||
                    "Admin User"
                  }
                </h3>

                <p
                  className="
                    text-xs
                    text-slate-400
                    mt-1
                  "
                >
                  {
                    user?.role ||
                    "Administrator"
                  }
                </p>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div
        className="
          flex-1
          flex
          flex-col
        "
      >

        {/* TOPBAR */}
        <div
          className="
            h-[85px]
            bg-white
            border-b
            border-slate-200
            px-8
            flex
            items-center
            justify-between
            sticky
            top-0
            z-50
          "
        >

          {/* LEFT */}
          <div>

            <h1
              className="
                text-3xl
                font-black
                text-slate-800
              "
            >
              School Management
            </h1>

            <p
              className="
                text-slate-500
                mt-1
              "
            >
              Smart ERP Dashboard
            </p>

          </div>

          {/* RIGHT */}
          <div
            className="
              flex
              items-center
              gap-5
            "
          >

            {/* SEARCH */}
            <div
              className="
                hidden
                md:flex
                items-center
                gap-3
                bg-slate-100
                px-4
                py-3
                rounded-2xl
                w-[280px]
              "
            >

              <Search
                size={18}
                className="
                  text-slate-400
                "
              />

              <input
                placeholder="Search..."
                className="
                  bg-transparent
                  outline-none
                  text-sm
                  w-full
                "
              />

            </div>

            {/* NOTIFICATION */}
            <button
              className="
                relative
                w-12
                h-12
                rounded-2xl
                bg-slate-100
                flex
                items-center
                justify-center
                hover:bg-slate-200
                transition
              "
            >

              <Bell
                size={20}
              />

              <span
                className="
                  absolute
                  top-2
                  right-2
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-red-500
                "
              />

            </button>

            {/* USER */}
            <div
              className="
                flex
                items-center
                gap-4
                bg-slate-100
                rounded-2xl
                px-4
                py-2
              "
            >

              <div
                className="
                  hidden
                  md:block
                  text-right
                "
              >

                <h4
                  className="
                    font-semibold
                    text-sm
                    text-slate-800
                  "
                >
                  {
                    user?.fullName || user?.name ||
                    "Admin"
                  }
                </h4>

                <p
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  {
                    user?.schoolId ||
                    "School ERP"
                  }
                </p>

              </div>

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  flex
                  items-center
                  justify-center
                  text-white
                  font-bold
                  text-lg
                "
              >
                {

                  user?.fullName || user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "A"
                }
              </div>

            </div>

            {/* LOGOUT */}
            <button

              onClick={() => {

  localStorage.clear();

  sessionStorage.clear();

  window.location.replace("/");
}}

              className="
                flex
                items-center
                gap-2
                px-5
                py-3
                rounded-2xl
                bg-red-500
                hover:bg-red-600
                text-white
                font-medium
                transition
              "
            >

              <LogOut
                size={18}
              />

              Logout

            </button>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div
          className="
            flex-1
            p-8
          "
        >

          <Outlet />

        </div>
      </div>
    </div>
  );
}