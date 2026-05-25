import {
  Outlet,
  NavLink
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

import NotificationBell
from "../components/NotificationBell";

export default function ParentLayout() {

  // ======================================================
  // AUTH
  // ======================================================

  const {

    user,

    logout

  } = useAuth();

  // ======================================================
  // NAV STYLE
  // ======================================================

  const navClass =
    ({ isActive }) => `

      px-4
      py-4
      rounded-2xl
      transition-all
      duration-200
      flex
      items-center
      gap-3
      font-semibold
      border

      ${

        isActive

          ? `
              bg-cyan-500/20
              border-cyan-500/30
              text-cyan-300
              shadow-lg
              shadow-cyan-500/10
            `

          : `
              bg-white/5
              border-white/5
              hover:bg-cyan-500/10
              hover:border-cyan-500/20
              text-slate-300
            `
      }
    `;

  // ======================================================
  // UI
  // ======================================================

  return (

    <div
      className="
        min-h-screen
        bg-slate-950
        text-white
        flex
      "
    >

      {/* SIDEBAR */}

      <aside
        className="
          w-72
          bg-slate-900
          border-r
          border-white/10
          p-6
          flex
          flex-col
          sticky
          top-0
          h-screen
        "
      >

        {/* TOP */}

        <div>

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h1
                className="
                  text-3xl
                  font-black
                  text-cyan-400
                "
              >
                Parent Panel
              </h1>

              <p
                className="
                  text-slate-400
                  mt-2
                  text-sm
                "
              >
                Welcome back
              </p>

            </div>

          
          </div>

          {/* USER */}

          <div
            className="
              mt-6
              p-4
              rounded-3xl
              bg-white/5
              border
              border-white/10
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  h-14
                  w-14
                  rounded-2xl
                  bg-cyan-500/20
                  flex
                  items-center
                  justify-center
                  text-2xl
                  font-black
                  text-cyan-300
                "
              >

                {

                  user?.name?.charAt(0) ||

                  "P"
                }

              </div>

              <div>

                <h2
                  className="
                    font-bold
                    text-lg
                  "
                >
                  {
                    user?.name
                  }
                </h2>

                <p
                  className="
                    text-slate-400
                    text-sm
                  "
                >
                  Parent Account
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* MENU */}

        <nav
          className="
            mt-10
            flex
            flex-col
            gap-3
          "
        >

          {/* DASHBOARD */}

          <NavLink
            to="/parent/dashboard"
            className={navClass}
          >
            <span>
              📊
            </span>

            Dashboard
          </NavLink>

          {/* ATTENDANCE */}

          <NavLink
            to="/parent/attendance"
            className={navClass}
          >
            <span>
              📅
            </span>

            Attendance
          </NavLink>

          {/* RESULTS */}

          <NavLink
            to="/parent/results"
            className={navClass}
          >
            <span>
              🏆
            </span>

            Results
          </NavLink>

          {/* HOMEWORK */}

          <NavLink
            to="/parent/homework"
            className={navClass}
          >
            <span>
              📚
            </span>

            Homework
          </NavLink>

          {/* FEES */}

          <NavLink
            to="/parent/fees"
            className={navClass}
          >
            <span>
              💳
            </span>

            Fees
          </NavLink>

        </nav>

        {/* LOGOUT */}

        <button

          onClick={logout}

          className="
            mt-auto
            bg-red-500/10
            border
            border-red-500/20
            hover:bg-red-500/20
            rounded-2xl
            py-4
            font-bold
            transition-all
            duration-200
            flex
            items-center
            justify-center
            gap-3
            text-red-300
          "
        >

          🚪 Logout

        </button>

      </aside>

      {/* MAIN */}

      <main
        className="
          flex-1
          p-8
          overflow-x-hidden
        "
      >

        <Outlet />

      </main>

    </div>
  );
}