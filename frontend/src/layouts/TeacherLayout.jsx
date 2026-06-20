import {
  Bell,
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  GraduationCap,
  Clock3,
  FileText,
  User,
  LogOut
} from "lucide-react";


import {
  Outlet,
  NavLink
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import axios
from "axios";

import {
  io
} from "socket.io-client";

// ======================================================
// COMPONENT
// ======================================================

export default function TeacherLayout() {

  // ======================================================
  // AUTH DATA
  // ======================================================

  const authData =
    JSON.parse(

      localStorage.getItem(
        "erp_auth"
      )
    ) || {};

  // ======================================================
  // TOKEN
  // ======================================================

  const token =
    localStorage.getItem(
      "token"
    );

  // ======================================================
  // AXIOS CONFIG
  // ======================================================

  const axiosConfig = {

    headers: {

      Authorization:
        `Bearer ${token}`
    }
  };

  // ======================================================
  // USER
  // ======================================================

  const teacherName =

  authData?.user?.name ||

  authData?.fullName ||

  authData?.name ||

  "Teacher";  
  // ======================================================
  // STATES
  // ======================================================

  const [

    notifications,

    setNotifications

  ] = useState([]);

  const [

    notificationOpen,

    setNotificationOpen

  ] = useState(false);

  const [

    unreadCount,

    setUnreadCount

  ] = useState(0);

  const [

    loading,

    setLoading

  ] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);
  // ======================================================
  // FETCH NOTIFICATIONS
  // ======================================================

  const fetchNotifications =
    async () => {

      try {

        setLoading(true);

        const res =
          await axios.get(

            `${import.meta.env.VITE_API_URL}/notifications`,

            axiosConfig
          );

        console.log(
          "NOTIFICATIONS:",
          res.data
        );

        setNotifications(

          res.data.notifications || []
        );

        setUnreadCount(

          res.data.unreadCount || 0
        );

      } catch (error) {

        console.log(
          "FETCH NOTIFICATIONS ERROR:"
        );

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {

    fetchNotifications();

  }, []);

  // ======================================================
  // SOCKET
  // ======================================================

  useEffect(() => {

    const socket =
      io(

        import.meta.env.VITE_API_URL.replace("/api", ""),

        {

          transports: [
            "websocket"
          ]
        }
      );

    // ======================================================
    // CONNECT
    // ======================================================

    socket.on(

      "connect",

      () => {

        console.log(
          "SOCKET CONNECTED:",
          socket.id
        );

        if (
          authData?._id
        ) {

          socket.emit(

            "join",

            authData._id
          );

          console.log(
            "JOINED ROOM:",
            authData._id
          );
        }
      }
    );

    // ======================================================
    // LISTEN
    // ======================================================

    socket.on(

      "new_notification",

      async (data) => {

        console.log(
          "NEW NOTIFICATION:",
          data
        );

        // ======================================================
        // SOUND
        // ======================================================

        try {

          const audio =
            new Audio(
              "/notification.mp3"
            );

          audio.play();

        } catch (err) {

          console.log(err);
        }

        // ======================================================
        // TEMP UI UPDATE
        // ======================================================

        const realtimeItem = {

          _id:
            Date.now(),

          title:
            data.title,

          message:
            data.message,

          type:
            data.type,

          createdAt:
            new Date(),

          isRead: false
        };

        setNotifications(

          (prev) => [

            realtimeItem,

            ...prev
          ]
        );

        setUnreadCount(

          (prev) =>
            prev + 1
        );

        // ======================================================
        // REFRESH FROM DB
        // ======================================================

        setTimeout(() => {

          fetchNotifications();

        }, 1000);
      }
    );

    // ======================================================
    // CLEANUP
    // ======================================================

    return () => {

      socket.disconnect();
    };

  }, []);

  // ======================================================
  // ACKNOWLEDGE
  // ======================================================

  const acknowledgeNotification =
    async (id) => {

      try {

        await axios.put(

          `${import.meta.env.VITE_API_URL}/notifications/acknowledge/${id}`,

          {},

          axiosConfig
        );

        setNotifications(

          (prev) =>

            prev.filter(

              (item) =>

                item._id !== id
            )
        );

        setUnreadCount(

          (prev) =>

            prev > 0

              ? prev - 1

              : 0
        );

      } catch (error) {

        console.log(
          "ACKNOWLEDGE ERROR:"
        );

        console.log(error);
      }
    };

  // ======================================================
  // MARK READ
  // ======================================================

  const markRead =
    async (id) => {

      try {

        await axios.put(

          `${import.meta.env.VITE_API_URL}/notifications/read/${id}`,

          {},

          axiosConfig
        );

        setNotifications(

          (prev) =>

            prev.map(

              (item) =>

                item._id === id

                  ? {

                      ...item,

                      isRead: true
                    }

                  : item
            )
        );

      } catch (error) {

        console.log(error);
      }
    };

  // ======================================================
  // MARK ALL READ
  // ======================================================

  const markAllRead =
    async () => {

      try {

        await axios.put(

          `${import.meta.env.VITE_API_URL}/notifications/read-all`,

          {},

          axiosConfig
        );

        setNotifications(

          (prev) =>

            prev.map(

              (item) => ({

                ...item,

                isRead: true
              })
            )
        );

        setUnreadCount(0);

      } catch (error) {

        console.log(error);
      }
    };

  // ======================================================
  // CLEAR ALL
  // ======================================================

  const clearAllNotifications =
    async () => {

      try {

        await axios.delete(

          `${import.meta.env.VITE_API_URL}/notifications/clear-all`,

          axiosConfig
        );

        setNotifications([]);

        setUnreadCount(0);

      } catch (error) {

        console.log(error);
      }
    };

  // ======================================================
  // MENU
  // ======================================================
const teacherMenu = [
  {
    name: "Dashboard",
    path: "/teacher/dashboard",
    icon: <LayoutDashboard size={18} />
  },
  {
    name: "Attendance",
    path: "/teacher/attendance",
    icon: <CalendarCheck size={18} />
  },
  {
    name: "Homework",
    path: "/teacher/homework",
    icon: <BookOpen size={18} />
  },
  {
    name: "My Classes",
    path: "/teacher/classes",
    icon: <GraduationCap size={18} />
  },
  // {
  //   name: "Timetable",
  //   path: "/teacher/timetable",
  //   icon: <Clock3 size={18} />
  // },
  // {
  //   name: "Leave",
  //   path: "/teacher/leave",
  //   icon: <FileText size={18} />
  // },
  // {
  //   name: "Profile",
  //   path: "/teacher/profile",
  //   icon: <User size={18} />
  // }
];
  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout =
    () => {

      localStorage.clear();

      sessionStorage.clear();

      window.location.replace("/");
    };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div
  className="
    flex
    min-h-screen
    bg-slate-950
    text-white
  "
>

      {/* SIDEBAR */}

      <aside
  className={`
    fixed
    top-0
    left-0
    h-screen
    w-[220px]
    bg-black/95
    border-r
    border-white/10
    backdrop-blur-xl
    p-6
    flex
    flex-col
    justify-between
    z-50
    transition-transform
    duration-300

    ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full lg:translate-x-0"
    }
  `}
>

        {/* LOGO */}
<div>
        <div
          className="
            mb-10
          "
        >
          <button
  onClick={() => setSidebarOpen(false)}
  className="
    lg:hidden
    absolute
    top-4
    right-4
    text-xl
    bg-white/10
    rounded-lg
    px-3
    py-1
  "
>
  ✕
</button>

          <h1
            className="
              text-4xl
              font-black
              bg-gradient-to-r
              from-blue-400
              to-cyan-400
              bg-clip-text
              text-transparent
            "
          >
            SOFTZEN
          </h1>

          <div
  className="
    mt-4
    p-3
    rounded-xl
    bg-white/5
    border
    border-white/10
  "
>
  <p className="font-semibold">
    {teacherName}
  </p>

  <p className="text-xs text-slate-400">
    Teacher ERP Panel
  </p>
</div>

        </div>

        {/* MENU */}

        <nav
  className="
    space-y-3
    mt-8
  "
>
          {

            teacherMenu.map(

              (item, index) => (

                <NavLink

                  key={index}

                  to={item.path}

                  end={

                    item.path ===
                    "/teacher/dashboard"
                  }

                  className={({

                    isActive

                  }) =>

                    `
                      flex
                      items-center
                      gap-4
                      px-5
                      py-4
                      rounded-2xl
                      transition-all
                      duration-300
                      border

                      ${
                        isActive

                          ? `
                            bg-gradient-to-r
                            from-cyan-500
to-blue-600
shadow-cyan-500/20
                            border-transparent
                            shadow-lg
                          `

                          : `
                            bg-white/5
                            border-white/10
                            hover:bg-white/10
                          `
                      }
                    `
                  }
                >

                  <span
                    className="
                      text-xl
                    "
                  >
                    {item.icon}
                  </span>

                  <span>
                    {item.name}
                  </span>

                </NavLink>
              )
            )
          }

        </nav>
        </div>

        {/* LOGOUT */}

       <div className="mt-auto pt-4 border-t border-white/10">

  
 <button
  onClick={handleLogout}
  className="
    w-full
    flex
    items-center
    justify-center
    gap-2
    p-3
    rounded-xl
    bg-red-500/10
    border
    border-red-500/20
    text-red-400
    hover:bg-red-500/20
    transition
  "
>
  <LogOut size={18} />
  Logout
</button>

</div>
      </aside>

      {
  sidebarOpen && (
    <div
      onClick={() => setSidebarOpen(false)}
      className="
        fixed
        inset-0
        bg-black/50
        z-40
        lg:hidden
      "
    />
  )
}

      {/* MAIN */}

 <main
  className="
  flex-1
  lg:ml-[220px]
  p-4 md:p-8
  overflow-auto
"
>

        {/* TOPBAR */}

        <div
  className="
    flex
    flex-col
    md:flex-row
    md:items-center
    justify-between
    mb-8
    gap-4
  "
>
<div className="flex items-center gap-3">

  <button
    onClick={() => setSidebarOpen(true)}
    className="
      lg:hidden
      text-xl
      px-3
      py-2
      rounded-xl
      bg-white/10
      border
      border-white/10
    "
  >
    ☰
  </button>

<div>
  <h2
    className="
      text-2xl
      md:text-4xl
      font-black
    "
  >
    Welcome back,
    <span className="text-cyan-400 ml-2">
      {teacherName}
    </span>
  </h2>

  <p
    className="
      text-slate-400
      mt-2
    "
  >
    Academic Management Portal
  </p>
</div>
</div>

          {/* RIGHT */}

          <div
            className="
  flex
  items-center
  gap-2
"
          >

            {/* NOTIFICATION */}

            <div
              className="
                relative
              "
            >

              {/* BELL */}

              <button

                onClick={() =>

                  setNotificationOpen(

                    !notificationOpen
                  )
                }

                className="
                  relative
                  w-10 h-10 md:w-14 md:h-14
                  rounded-2xl
                  bg-white/5
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-2xl
                  hover:bg-white/10
                  transition-all
                "
              >

                <Bell size={22} />

                {

                  unreadCount > 0 && (

                    <div
                      className="
                        absolute
                        -top-2
                        -right-2
                        min-w-[28px]
                        h-[28px]
                        px-2
                        rounded-full
                        bg-red-500
                        flex
                        items-center
                        justify-center
                        text-xs
                        font-black
                        animate-pulse
                      "
                    >

                      {
                        unreadCount
                      }

                    </div>
                  )
                }

              </button>

              {/* DROPDOWN */}

              {

                notificationOpen && (

                  <div
                    className="
                      absolute
                      top-16
                      right-0
                      w-[430px]
                      max-h-[650px]
                      overflow-auto
                      rounded-3xl
                      bg-slate-900
                      border
                      border-white/10
                      shadow-2xl
                      z-[999999]
                    "
                  >

                    {/* HEADER */}

                    <div
                      className="
                        p-5
                        border-b
                        border-white/10
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <h3
                          className="
                            text-2xl
                            font-black
                          "
                        >
                          Notifications
                        </h3>

                        <div
                          className="
                            px-3
                            py-1
                            rounded-xl
                            bg-cyan-500/10
                            text-cyan-400
                            text-sm
                            font-bold
                          "
                        >

                          {
                            unreadCount
                          }
                          {" "}
                          Unread

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div
                        className="
                          flex
                          gap-3
                          mt-5
                        "
                      >

                        <button

                          onClick={
                            markAllRead
                          }

                          className="
                            flex-1
                            py-3
                            rounded-2xl
                            bg-blue-500/10
                            text-blue-400
                            font-bold
                            hover:bg-blue-500/20
                            transition
                          "
                        >

                          Mark All Read

                        </button>

                        <button

                          onClick={
                            clearAllNotifications
                          }

                          className="
                            flex-1
                            py-3
                            rounded-2xl
                            bg-red-500/10
                            text-red-400
                            font-bold
                            hover:bg-red-500/20
                            transition
                          "
                        >

                          Clear All

                        </button>

                      </div>

                    </div>

                    {/* EMPTY */}

                    {

                      notifications.length === 0 && (

                        <div
                          className="
                            p-12
                            text-center
                            text-slate-400
                          "
                        >

                          No notifications

                        </div>
                      )
                    }

                    {/* LIST */}

                    <div
                      className="
                        p-4
                        space-y-4
                      "
                    >

                      {

                        notifications.map(

                          (item) => (

                            <div

                              key={
                                item._id
                              }

                              className={`
                                rounded-3xl
                                p-5
                                border
                                transition-all

                                ${
                                  item.isRead

                                    ? `
                                      bg-black/20
                                      border-white/5
                                    `

                                    : `
                                      bg-cyan-500/5
                                      border-cyan-500/20
                                    `
                                }
                              `}
                            >

                              {/* TOP */}

                              <div
                                className="
                                  flex
                                  justify-between
                                  gap-4
                                "
                              >

                                <div
                                  className="
                                    flex-1
                                  "
                                >

                                  <h4
                                    className="
                                      text-lg
                                      font-black
                                    "
                                  >

                                    {
                                      item.title
                                    }

                                  </h4>

                                  <p
                                    className="
                                      text-slate-300
                                      mt-2
                                      leading-relaxed
                                    "
                                  >

                                    {
                                      item.message
                                    }

                                  </p>

                                  <div
                                    className="
                                      mt-3
                                      text-xs
                                      text-slate-500
                                    "
                                  >

                                    {

                                      new Date(

                                        item.createdAt

                                      ).toLocaleString()
                                    }

                                  </div>

                                </div>

                              </div>

                              {/* ACTIONS */}

                              <div
                                className="
                                  flex
                                  gap-3
                                  mt-5
                                "
                              >

                                {

                                  !item.isRead && (

                                    <button

                                      onClick={() =>

                                        markRead(
                                          item._id
                                        )
                                      }

                                      className="
                                        flex-1
                                        py-3
                                        rounded-2xl
                                        bg-blue-500/10
                                        text-blue-400
                                        font-bold
                                        hover:bg-blue-500/20
                                        transition
                                      "
                                    >

                                      Mark Read

                                    </button>
                                  )
                                }

                                <button

                                  onClick={() =>

                                    acknowledgeNotification(
                                      item._id
                                    )
                                  }

                                  className="
                                    flex-1
                                    py-3
                                    rounded-2xl
                                    bg-gradient-to-r
                                    from-green-600
                                    to-emerald-500
                                    hover:scale-[1.02]
                                    transition-all
                                    font-bold
                                  "
                                >

                                  Acknowledge

                                </button>

                              </div>

                            </div>
                          )
                        )
                      }

                    </div>

                  </div>
                )
              }

            </div>

            {/* USER */}

           <div
  className="
    flex
    items-center
    gap-3
    px-4
    py-2
    rounded-2xl
    bg-white/5
    border
    border-white/10
  "
>

  <div
    className="
      w-10
      h-10
      rounded-full
      bg-gradient-to-r
      from-cyan-500
      to-blue-600
      flex
      items-center
      justify-center
      font-bold
    "
  >
    {teacherName?.charAt(0)}
  </div>

  <div className="hidden md:block">
    <p className="font-semibold">
      {teacherName}
    </p>

    <p className="text-xs text-slate-400">
      Teacher
    </p>
  </div>

</div>

          </div>

        </div>

        {/* PAGE CONTENT */}

        <Outlet />

      </main>

    </div>
  );
}