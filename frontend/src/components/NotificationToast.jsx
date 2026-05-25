console.log(
  "NOTIFICATION TOAST LOADED"
);

import {
  useEffect,
  useState
} from "react";

import {
  io
} from "socket.io-client";

// ======================================================
// COMPONENT
// ======================================================

export default function NotificationToast() {

  // ======================================================
  // STATE
  // ======================================================

  const [

    notifications,

    setNotifications

  ] = useState([]);

  // ======================================================
  // SOCKET
  // ======================================================

  useEffect(() => {

    // ======================================================
    // CREATE SOCKET
    // ======================================================

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
    // GET USER
    // ======================================================

    const userData =
      localStorage.getItem(
        "user"
      );

    let user = null;

    try {

      user =
        JSON.parse(
          userData
        );

    } catch (error) {

      console.log(
        "USER PARSE ERROR:"
      );

      console.log(error);
    }

    console.log(
      "CURRENT USER:",
      user
    );

    // ======================================================
    // SOCKET CONNECT
    // ======================================================

    socket.on(

      "connect",

      () => {

        console.log(
          "SOCKET CONNECTED:",
          socket.id
        );

        // JOIN ROOM

        if (user?._id) {

          console.log(
            "JOINING SOCKET ROOM:",
            user._id
          );

          socket.emit(

            "join",

            user._id
          );
        }
      }
    );

    // ======================================================
    // SOCKET ERROR
    // ======================================================

    socket.on(

      "connect_error",

      (error) => {

        console.log(
          "SOCKET ERROR:"
        );

        console.log(
          error
        );
      }
    );

    // ======================================================
    // NEW NOTIFICATION
    // ======================================================

    socket.on(

      "new_notification",

      (data) => {

        console.log(
          "NEW NOTIFICATION RECEIVED:",
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

          audio.volume =
            1;

          audio.play()

            .catch(
              (err) => {

                console.log(
                  "AUDIO ERROR:"
                );

                console.log(
                  err
                );
              }
            );

        } catch (audioError) {

          console.log(
            "SOUND ERROR:"
          );

          console.log(
            audioError
          );
        }

        // ======================================================
        // ADD TOAST
        // ======================================================

        const id =
          Date.now();

        const newToast = {

          id,

          title:

            data?.title ||

            "Notification",

          message:

            data?.message ||

            "New update received",

          type:

            data?.type ||

            "general"
        };

        setNotifications(

          (prev) => [

            newToast,

            ...prev
          ]
        );

        // ======================================================
        // AUTO REMOVE
        // ======================================================

        setTimeout(() => {

          setNotifications(

            (prev) =>

              prev.filter(

                (item) =>

                  item.id !== id
              )
          );

        }, 5000);
      }
    );

    // ======================================================
    // CLEANUP
    // ======================================================

    return () => {

      console.log(
        "SOCKET DISCONNECTED"
      );

      socket.disconnect();
    };

  }, []);

  // ======================================================
  // REMOVE NOTIFICATION
  // ======================================================

  const removeNotification =
    (id) => {

      setNotifications(

        (prev) =>

          prev.filter(

            (item) =>

              item.id !== id
          )
      );
    };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div

      className="
        fixed
        top-6
        right-6
        z-[999999]
        flex
        flex-col
        gap-4
        pointer-events-none
      "

      style={{

        position: "fixed",

        top: "24px",

        right: "24px",

        zIndex: 999999,

        width: "380px",

        maxWidth: "calc(100vw - 40px)"
      }}
    >

      {

        notifications.map(

          (item) => (

            <div

              key={item.id}

              className="
                w-full
                rounded-3xl
                border
                border-cyan-400/20
                bg-slate-900/95
                backdrop-blur-xl
                shadow-2xl
                shadow-cyan-500/20
                p-5
                animate-[slideIn_.4s_ease]
                pointer-events-auto
                overflow-hidden
                relative
              "
            >

              {/* GLOW */}

              <div
                className="
                  absolute
                  inset-0
                  bg-cyan-500/5
                  blur-3xl
                "
              />

              {/* CONTENT */}

              <div
                className="
                  relative
                  z-10
                  flex
                  items-start
                  gap-4
                "
              >

                {/* ICON */}

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-cyan-500/20
                    flex
                    items-center
                    justify-center
                    text-3xl
                    shrink-0
                    border
                    border-cyan-400/20
                  "
                >
                  🔔
                </div>

                {/* TEXT */}

                <div
                  className="
                    flex-1
                  "
                >

                  <h3
                    className="
                      text-lg
                      font-black
                      text-white
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      text-slate-300
                      mt-2
                      text-sm
                      leading-relaxed
                    "
                  >
                    {item.message}
                  </p>

                </div>

                {/* CLOSE */}

                <button

                  onClick={() =>
                    removeNotification(
                      item.id
                    )
                  }

                  className="
                    text-slate-400
                    hover:text-white
                    transition-all
                    text-xl
                  "
                >
                  ×
                </button>

              </div>

              {/* TIMER BAR */}

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-1
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  animate-[shrink_5s_linear]
                "

                style={{

                  width: "100%"
                }}
              />

            </div>
          )
        )
      }

    </div>
  );
}