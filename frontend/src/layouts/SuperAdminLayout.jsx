import {
  Outlet,
  NavLink
} from "react-router-dom";

import {

  LayoutDashboard,

  School,

  Shield,

  CreditCard,

  Activity,

  Settings,

  Brain,

  Users,

  LogOut

} from "lucide-react";

// ======================================================
// MENU
// ======================================================

const menu = [

  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/super-admin"
  },

  {
    name: "Schools",
    icon: School,
    path: "/super-admin/schools"
  },

  {
    name: "Users",
    icon: Users,
    path: "/super-admin/users"
  },

  {
    name: "Subscriptions",
    icon: CreditCard,
    path: "/super-admin/subscriptions"
  },

  {
    name: "Security",
    icon: Shield,
    path: "/super-admin/security"
  },

  {
    name: "Live Activity",
    icon: Activity,
    path: "/super-admin/activity"
  },

  {
    name: "AI Center",
    icon: Brain,
    path: "/super-admin/ai"
  },

  {
    name: "Settings",
    icon: Settings,
    path: "/super-admin/settings"
  }
];

// ======================================================
// COMPONENT
// ======================================================

export default function SuperAdminLayout() {

  // ======================================================
  // AUTH DATA
  // ======================================================

  let authData = {};

  try {

    authData =

      JSON.parse(

        localStorage.getItem(
          "erp_auth"
        )
      ) || {};

  } catch (error) {

    console.log(
      "AUTH PARSE ERROR:",
      error
    );

    authData = {};
  }

  // ======================================================
  // USER
  // ======================================================

  const superAdminName =

    authData?.fullName ||

    authData?.name ||

    "Super Admin";

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout =
    () => {

      // CLEAR STORAGE
      localStorage.clear();

      sessionStorage.clear();

      // REDIRECT
      window.location.replace("/");
    };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div
      className="
        min-h-screen
        bg-[#020617]
        text-white
        flex
      "
    >

      {/* SIDEBAR */}

      <div
        className="
          w-[290px]
          bg-black/40
          border-r
          border-white/10
          p-6
          flex
          flex-col
          justify-between
        "
      >

        <div>

          {/* LOGO */}

          <div
            className="
              mb-10
            "
          >

            <h1
              className="
                text-4xl
                font-black
                tracking-tight
              "
            >
              ⚡ SoftZen
            </h1>

            <p
              className="
                text-slate-400
                mt-2
              "
            >
              Enterprise ERP
            </p>

          </div>

          {/* MENU */}

          <div
            className="
              flex
              flex-col
              gap-2
            "
          >

            {

              menu.map((item) => {

                const Icon =
                  item.icon;

                return (

                  <NavLink

                    key={item.name}

                    to={item.path}

                    end={
                      item.path ===
                      "/super-admin"
                    }

                    className={

                      ({ isActive }) =>

                        `
                          flex
                          items-center
                          gap-4
                          px-5
                          py-4
                          rounded-2xl
                          transition-all
                          duration-300
                          font-medium

                          ${
                            isActive

                              ? `
                                bg-cyan-500
                                text-black
                                shadow-lg
                              `

                              : `
                                hover:bg-white/10
                                text-slate-300
                              `
                          }
                        `
                    }
                  >

                    <Icon
                      size={20}
                    />

                    {item.name}

                  </NavLink>
                );
              })
            }

          </div>

        </div>

        {/* FOOTER */}

        <div>

          {/* USER */}

          <div
            className="
              mb-4
              px-5
              py-4
              rounded-2xl
              bg-white/5
              border
              border-white/10
            "
          >

            <p
              className="
                text-sm
                text-slate-400
              "
            >
              Logged in as
            </p>

            <h3
              className="
                font-semibold
                mt-1
              "
            >
              {superAdminName}
            </h3>

          </div>

          {/* LOGOUT */}

          <button

            onClick={handleLogout}

            className="
              w-full
              flex
              items-center
              justify-center
              gap-3
              bg-red-500
              hover:bg-red-600
              transition-all
              py-4
              rounded-2xl
              font-semibold
            "
          >

            <LogOut
              size={20}
            />

            Logout

          </button>

        </div>

      </div>

      {/* MAIN */}

      <div
        className="
          flex-1
          p-8
          overflow-auto
        "
      >

        {/* TOPBAR */}

        <div
          className="
            flex
            justify-between
            items-center
            mb-10
          "
        >

          <div>

            <h1
              className="
                text-4xl
                font-black
              "
            >
              Super Admin Panel
            </h1>

            <p
              className="
                text-slate-400
                mt-1
              "
            >
              Enterprise SaaS Control
            </p>

          </div>

          {/* STATUS */}

          <div
            className="
              bg-green-500/10
              border
              border-green-500/20
              px-5
              py-3
              rounded-2xl
              text-green-400
              font-semibold
            "
          >

            Platform Live

          </div>

        </div>

        {/* PAGE */}

        <Outlet />

      </div>

    </div>
  );
}