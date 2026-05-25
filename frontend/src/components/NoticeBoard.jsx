import { useEffect, useState } from "react";

import {
  getNotices,
  markNoticeViewed,
  acknowledgeNotice,
} from "../services/noticeService";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  BellRing,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Bell,
} from "lucide-react";

const NoticeBoard = () => {

  const [notices, setNotices] =
    useState([]);

  const location =
    useLocation();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // =========================================
  // FETCH NOTICES
  // =========================================

  const fetchNotices =
    async () => {

      try {

        const data =
          await getNotices();

        let noticeData =
          data.notices || [];

        noticeData.sort((a, b) => {

          const order = {

            locked: 1,
            mandatory: 2,
          };

          return (
            (order[a.type] || 3) -
            (order[b.type] || 3)
          );
        });

        setNotices(
          noticeData
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchNotices();

  }, []);

  // =========================================
  // ROUTES
  // =========================================

  const getNoticeRoute =
    () => {

      if (
        location.pathname.includes(
          "/teacher"
        )
      ) {

        return "/teacher/notices";
      }

      if (
        location.pathname.includes(
          "/parent"
        )
      ) {

        return "/parent/notices";
      }

      if (
        location.pathname.includes(
          "/student"
        )
      ) {

        return "/student/notices";
      }

      return "/notices";
    };

  // =========================================
  // ACKNOWLEDGED
  // =========================================

  const isAcknowledged =
    (notice) => {

      return (
        notice?.acknowledgedBy?.some(
          (ack) =>
            ack.userId ===
              user?._id ||

            ack.userId?._id ===
              user?._id
        ) || false
      );
    };

  // =========================================
  // VIEW
  // =========================================

  const handleView =
    async (notice) => {

      try {

        await markNoticeViewed(
          notice._id
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================================
  // ACKNOWLEDGE
  // =========================================

  const handleAcknowledge =
    async (notice) => {

      try {

        await acknowledgeNotice(
          notice._id
        );

        setNotices((prev) =>
          prev.map((item) => {

            if (
              item._id ===
              notice._id
            ) {

              return {

                ...item,

                acknowledgedBy: [

                  ...(item.acknowledgedBy ||
                    []),

                  {
                    userId:
                      user?._id,
                  },
                ],
              };
            }

            return item;
          })
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================================
  // STYLES
  // =========================================

  const getStyle =
    (notice) => {

      // FORCE NOTICE

      if (
        notice.type ===
        "locked"
      ) {

        return {

          border:
            "border-red-200",

          top:
            "bg-gradient-to-r from-red-500 to-rose-500",

          iconBg:
            "bg-gradient-to-br from-red-500 to-rose-500",

          badge:
            "bg-red-50 text-red-600 border border-red-100",

          button:
            "bg-red-500 hover:bg-red-600",

          light:
            "bg-red-50/60",

          label:
            "FORCE NOTICE",

          icon:
            <ShieldAlert className="w-8 h-8 text-white" />,
        };
      }

      // MANDATORY

      return {

        border:
          "border-orange-200",

        top:
          "bg-gradient-to-r from-orange-400 to-amber-400",

        iconBg:
          "bg-gradient-to-br from-orange-400 to-amber-500",

        badge:
          "bg-orange-50 text-orange-600 border border-orange-100",

        button:
          "bg-orange-500 hover:bg-orange-600",

        light:
          "bg-orange-50/60",

        label:
          "ACKNOWLEDGEMENT REQUIRED",

        icon:
          <Bell className="w-8 h-8 text-white" />,
      };
    };

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div
            className="
              w-14
              h-14
              rounded-3xl
              bg-white
              flex
              items-center
              justify-center
              shadow-xl
            "
          >

            <BellRing className="w-7 h-7 text-slate-800" />

          </div>

          <div>

            <h2
              className="
                text-4xl
                font-black
                text-white
              "
            >
              Important Notices
            </h2>

            <p
              className="
                text-slate-400
                text-sm
                mt-1
              "
            >
              Stay updated with latest announcements
            </p>

          </div>

        </div>

        

      </div>

      {/* EMPTY */}

      {

        notices.length === 0 ? (

          <div
            className="
              bg-white
              rounded-[32px]
              p-12
              text-center
              shadow-xl
            "
          >

            <h2
              className="
                text-3xl
                font-black
                text-slate-800
              "
            >
              No Active Notices
            </h2>

          </div>

        ) : (

          notices
            .slice(0, 2)

            .map((notice) => {

              const acknowledged =
                isAcknowledged(
                  notice
                );

              const style =
                getStyle(
                  notice
                );

              return (

                <div
                  key={
                    notice._id
                  }
                  className={`
                    relative
                    overflow-hidden
                    bg-white
                    rounded-[34px]
                    border
                    ${style.border}
                    shadow-2xl
                  `}
                >

                  {/* TOP BAR */}

                  <div
                    className={`
                      h-2
                      w-full
                      ${style.top}
                    `}
                  />

                  {/* BODY */}

                  <div
                    className={`
                      relative
                      p-10
                      ${style.light}
                    `}
                  >

                    {/* WATERMARK */}

                    <div
                      className="
                        absolute
                        right-10
                        top-1/2
                        -translate-y-1/2
                        opacity-[0.04]
                        scale-[3.5]
                      "
                    >

                      {

                        notice.type ===
                        "locked"

                          ? (
                            <ShieldAlert className="w-40 h-40 text-red-500" />
                          )

                          : (
                            <Bell className="w-40 h-40 text-orange-500" />
                          )
                      }

                    </div>

                    {/* CONTENT */}

                    <div className="relative z-10 flex items-start justify-between gap-8 flex-wrap">

                      {/* LEFT */}

                      <div className="flex gap-6 flex-1">

                        {/* ICON */}

                        <div
                          className={`
                            min-w-[82px]
                            h-[82px]
                            rounded-[28px]
                            flex
                            items-center
                            justify-center
                            shadow-lg
                            ${style.iconBg}
                          `}
                        >

                          {style.icon}

                        </div>

                        {/* TEXT */}

                        <div className="flex-1">

                          {/* BADGE */}

                          <div
                            className={`
                              inline-flex
                              items-center
                              px-4
                              py-2
                              rounded-full
                              text-xs
                              font-black
                              tracking-wide
                              ${style.badge}
                            `}
                          >

                            {style.label}

                          </div>

                          {/* TITLE */}

                          <h3
                            className="
                              mt-5
                              text-[42px]
                              leading-tight
                              font-black
                              text-slate-900
                            "
                          >
                            {notice.title}
                          </h3>

                          {/* DESCRIPTION */}

                          <p
                            className="
                              mt-4
                              text-slate-600
                              text-[18px]
                              leading-9
                              max-w-4xl
                            "
                          >
                            {notice.description}
                          </p>

                        </div>

                      </div>

                      {/* BUTTONS */}

                      <div className="flex items-center gap-4">

                      
                      

                        {/* ACKNOWLEDGE */}

                        {

                          acknowledged ? (

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                px-8
                                py-4
                                rounded-2xl
                                bg-emerald-500
                                text-white
                                font-bold
                                shadow-lg
                              "
                            >

                              <CheckCircle2 className="w-5 h-5" />

                              Acknowledged

                            </div>

                          ) : (

                            <button
                              onClick={() =>
                                handleAcknowledge(
                                  notice
                                )
                              }
                              className={`
                                px-8
                                py-4
                                rounded-2xl
                                text-white
                                font-bold
                                shadow-lg
                                transition-all
                                duration-300
                                hover:scale-105
                                ${style.button}
                              `}
                            >

                              Acknowledge

                            </button>
                          )
                        }

                      </div>

                    </div>

                  </div>

                </div>
              );
            })
        )
      }

    </div>
  );
};

export default NoticeBoard;