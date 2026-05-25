import {
  useEffect,
  useRef,
  useState
} from "react";

import axios
from "axios";

import socket
from "../services/socket";

const NotificationBell =
  () => {

    // ======================================================
    // STATES
    // ======================================================

    const [

      open,

      setOpen

    ] = useState(false);

    const [

      notifications,

      setNotifications

    ] = useState([]);

    const [

      unreadCount,

      setUnreadCount

    ] = useState(0);

    // ======================================================
    // REFS
    // ======================================================

    const dropdownRef =
      useRef();

    // ======================================================
    // TOKEN
    // ======================================================

    const token =
      localStorage.getItem(
        "token"
      );

    // ======================================================
    // FETCH NOTIFICATIONS
    // ======================================================

    const fetchNotifications =
      async () => {

        try {

          const res =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/notifications`,

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          setNotifications(

            res.data.notifications || []
          );

          setUnreadCount(

            res.data.unreadCount || 0
          );

        } catch (error) {

          console.log(
            "NOTIFICATION FETCH ERROR:"
          );

          console.log(error);
        }
      };

    // ======================================================
    // INITIAL LOAD + LIVE SOCKET
    // ======================================================

    useEffect(() => {

      // INITIAL FETCH

      fetchNotifications();

      // ======================================================
      // SOCKET LISTENER
      // ======================================================

      socket.on(

        "new_notification",

        (data) => {

          console.log(
            "LIVE NOTIFICATION:",
            data
          );

          // PLAY SOUND

          try {

            const audio =
              new Audio(
                "/notification.mp3"
              );

            audio.play();

          } catch (audioError) {

            console.log(
              "AUDIO ERROR:"
            );

            console.log(
              audioError
            );
          }

          // REFRESH DATA

          fetchNotifications();
        }
      );

      // ======================================================
      // AUTO REFRESH FALLBACK
      // ======================================================

      const interval =
        setInterval(

          fetchNotifications,

          15000
        );

      // ======================================================
      // CLEANUP
      // ======================================================

      return () => {

        clearInterval(
          interval
        );

        socket.off(
          "new_notification"
        );
      };

    }, []);

    // ======================================================
    // OUTSIDE CLICK
    // ======================================================

    useEffect(() => {

      const handleClickOutside =
        (event) => {

          if (

            dropdownRef.current &&

            !dropdownRef.current.contains(
              event.target
            )

          ) {

            setOpen(false);
          }
        };

      document.addEventListener(

        "mousedown",

        handleClickOutside
      );

      return () => {

        document.removeEventListener(

          "mousedown",

          handleClickOutside
        );
      };

    }, []);

    // ======================================================
    // MARK SINGLE READ
    // ======================================================

    const markRead =
      async (id) => {

        try {

          await axios.put(

            `${import.meta.env.VITE_API_URL}/notifications/read/${id}`,

            {},

            {

              headers: {

                Authorization:
                  `Bearer ${token}`
              }
            }
          );

          fetchNotifications();

        } catch (error) {

          console.log(
            "MARK READ ERROR:"
          );

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

            {

              headers: {

                Authorization:
                  `Bearer ${token}`
              }
            }
          );

          fetchNotifications();

        } catch (error) {

          console.log(
            "MARK ALL READ ERROR:"
          );

          console.log(error);
        }
      };

    // ======================================================
    // OPEN NOTIFICATION
    // ======================================================

    const openNotification =
      async (item) => {

        await markRead(
          item._id
        );

        if (item.link) {

          window.location.href =
            item.link;
        }
      };

    // ======================================================
    // UI
    // ======================================================

    return (

      <div
        className="
          relative
        "
        ref={dropdownRef}
      >

        {/* BELL */}

        <button

          onClick={() =>
            setOpen(
              !open
            )
          }

          className="
            relative
            h-12
            w-12
            rounded-2xl
            bg-white/5
            border
            border-white/10
            flex
            items-center
            justify-center
            text-2xl
            hover:scale-105
            active:scale-95
            transition-all
            duration-200
          "
        >

          🔔

          {

            unreadCount > 0 && (

              <div
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-[24px]
                  h-6
                  px-1
                  rounded-full
                  bg-red-500
                  text-white
                  text-xs
                  font-bold
                  flex
                  items-center
                  justify-center
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

          open && (

            <div
              className="
                absolute
                right-0
                mt-4
                w-[420px]
                max-h-[650px]
                overflow-y-auto
                rounded-3xl
                bg-slate-900
                border
                border-slate-800
                shadow-2xl
                shadow-black/40
                z-50
              "
            >

              {/* HEADER */}

              <div
                className="
                  sticky
                  top-0
                  bg-slate-900/95
                  backdrop-blur-xl
                  border-b
                  border-slate-800
                  p-5
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <h2
                    className="
                      text-xl
                      font-black
                      text-white
                    "
                  >
                    Notifications
                  </h2>

                  <p
                    className="
                      text-slate-400
                      text-sm
                      mt-1
                    "
                  >
                    {
                      unreadCount
                    }
                    {" "}
                    unread notifications
                  </p>

                </div>

                <button

                  onClick={
                    markAllRead
                  }

                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-cyan-600
                    hover:bg-cyan-500
                    text-sm
                    font-semibold
                    transition-all
                  "
                >

                  Mark All Read

                </button>

              </div>

              {/* LIST */}

              <div
                className="
                  p-4
                  space-y-3
                "
              >

                {

                  notifications.length === 0 && (

                    <div
                      className="
                        text-center
                        py-16
                        text-slate-500
                      "
                    >

                      No notifications

                    </div>
                  )
                }

                {

                  notifications.map(
                    (item) => (

                      <div

                        key={
                          item._id
                        }

                        onClick={() =>
                          openNotification(
                            item
                          )
                        }

                        className={`
                          p-5
                          rounded-2xl
                          cursor-pointer
                          transition-all
                          border
                          hover:scale-[1.01]

                          ${
                            item.isRead

                              ? "bg-slate-950 border-slate-800"

                              : "bg-cyan-500/10 border-cyan-500/20"
                          }
                        `}
                      >

                        {/* TOP */}

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-4
                          "
                        >

                          <div>

                            <h3
                              className="
                                text-white
                                font-bold
                                text-lg
                              "
                            >
                              {
                                item.title
                              }
                            </h3>

                            <p
                              className="
                                text-slate-400
                                mt-2
                                leading-relaxed
                              "
                            >
                              {
                                item.message
                              }
                            </p>

                          </div>

                          {

                            !item.isRead && (

                              <div
                                className="
                                  h-3
                                  w-3
                                  rounded-full
                                  bg-cyan-400
                                  mt-2
                                "
                              />
                            )
                          }

                        </div>

                        {/* FOOTER */}

                        <div
                          className="
                            mt-4
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <span
                            className="
                              text-xs
                              text-slate-500
                            "
                          >

                            {

                              new Date(
                                item.createdAt
                              ).toLocaleString()
                            }

                          </span>

                          <span
                            className="
                              px-3
                              py-1
                              rounded-xl
                              bg-slate-800
                              text-xs
                              uppercase
                              tracking-wider
                            "
                          >

                            {
                              item.type
                            }

                          </span>

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
    );
  };

export default NotificationBell;