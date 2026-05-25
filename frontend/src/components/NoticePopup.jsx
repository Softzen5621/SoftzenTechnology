import { useEffect, useState } from "react";

import {
  getNotices,
  acknowledgeNotice,
  markNoticeViewed,
} from "../services/noticeService";

import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Pin,
  Clock3,
} from "lucide-react";

const NoticePopup = () => {

  const [notice, setNotice] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  const [acknowledged, setAcknowledged] =
    useState(false);

  // =========================================
  // FETCH NOTICE
  // =========================================

  useEffect(() => {

    fetchPopupNotice();

  }, []);

  const fetchPopupNotice =
    async () => {

      try {

        const data =
          await getNotices();

        let notices =
          data.notices || [];

        // =====================================
        // ONLY POPUP
        // =====================================

        notices =
          notices.filter(
            (n) => n.popup === true
          );

        // =====================================
        // SORT PRIORITY
        // =====================================

        notices.sort((a, b) => {

          const order = {

            locked: 1,

            mandatory: 2,
          };

          return (
            (order[a.type] || 99) -
            (order[b.type] || 99)
          );
        });

        const popupNotice =
          notices[0];

        if (!popupNotice) {

          setOpen(false);

          return;
        }

        // =====================================
        // ACKNOWLEDGED CHECK
        // =====================================

        const isAcknowledged =
          popupNotice.acknowledgedBy?.some(
            (a) =>
              a.userId ===
              localStorage.getItem(
                "userId"
              )
          );

        setAcknowledged(
          isAcknowledged
        );

        setNotice(
          popupNotice
        );

        setOpen(true);

        // =====================================
        // VIEW TRACK
        // =====================================

        await markNoticeViewed(
          popupNotice._id
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================================
  // ACKNOWLEDGE
  // =========================================

  const handleAcknowledge =
    async () => {

      try {

        const response =
          await acknowledgeNotice(
            notice._id
          );

        setAcknowledged(true);

        // =====================================
        // UPDATE LOCAL NOTICE
        // =====================================

        setNotice(
          response.notice
        );

        // =====================================
        // MANDATORY CLOSE
        // =====================================

        if (
          notice.type ===
          "mandatory"
        ) {

          setTimeout(() => {

            setOpen(false);

          }, 1200);
        }

      } catch (error) {

        console.log(error);
      }
    };

  // =========================================
  // TIMER
  // =========================================

  const getCountdown =
    (expiryDate) => {

      if (!expiryDate)
        return null;

      const expiry =
        new Date(expiryDate);

      const now =
        new Date();

      const diff =
        expiry - now;

      if (diff <= 0)
        return "Expired";

      const days =
        Math.floor(
          diff /
            (1000 *
              60 *
              60 *
              24)
        );

      const hours =
        Math.floor(
          (
            diff %
            (1000 *
              60 *
              60 *
              24)
          ) /
            (1000 *
              60 *
              60)
        );

      const minutes =
        Math.floor(
          (
            diff %
            (1000 *
              60 *
              60)
          ) /
            (1000 * 60)
        );

      return `${days}d ${hours}h ${minutes}m`;
    };

  // =========================================
  // COLORS
  // =========================================

  const getHeaderColor =
    () => {

      if (
        notice?.type ===
        "locked"
      ) {

        return "bg-red-600";
      }

      return "bg-orange-500";
    };

  const getBadge =
    () => {

      if (
        notice?.type ===
        "locked"
      ) {

        return `
          bg-red-100
          text-red-700
        `;
      }

      return `
        bg-orange-100
        text-orange-700
      `;
    };

  // =========================================
  // EMPTY
  // =========================================

  if (!open || !notice)
    return null;

  // =========================================
  // UI
  // =========================================

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* HEADER */}

        <div
          className={`p-5 flex items-center justify-between ${getHeaderColor()}`}
        >

          <div className="flex items-center gap-3 text-white">

            {

              notice.type ===
              "locked" ? (

                <Pin className="w-6 h-6" />

              ) : (

                <AlertTriangle className="w-6 h-6" />
              )
            }

            <div>

              <h2 className="text-xl font-bold">

                {

                  notice.type ===
                  "locked"

                    ? "Force Notice"

                    : "Mandatory Notice"
                }

              </h2>

              <p className="text-sm opacity-90">
                Please read carefully
              </p>

            </div>

          </div>

        </div>

        {/* BODY */}

        <div className="p-6">

          {/* TITLE */}

          <div className="flex items-center gap-2 flex-wrap mb-4">

            <h3 className="text-2xl font-bold text-gray-800">

              {notice.title}

            </h3>

            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${getBadge()}`}
            >

              {

                notice.type ===
                "locked"

                  ? "Force Notice"

                  : "Mandatory"
              }

            </span>

          </div>

          {/* DESCRIPTION */}

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">

            {notice.description}

          </p>

          {/* ATTACHMENT */}

          {

            notice.attachment && (

              <a
                href={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${notice.attachment}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-5 text-blue-600 font-semibold"
              >

                📎 View Attachment

              </a>
            )
          }

          {/* COUNTDOWN */}

          {

            notice.type ===
              "locked" &&

              notice.expiryDate && (

                <div className="flex items-center gap-2 mt-6 text-red-600 font-semibold">

                  <Clock3 className="w-5 h-5" />

                  Expires in:
                  {" "}
                  {
                    getCountdown(
                      notice.expiryDate
                    )
                  }

                </div>
              )
          }

          {/* ACTION */}

          <div className="flex items-center gap-3 mt-8">

            {

              acknowledged ? (

                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-xl font-bold">

                  <CheckCircle className="w-5 h-5" />

                  Acknowledged

                </div>

              ) : (

                <button
                  onClick={
                    handleAcknowledge
                  }
                  className={`flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    notice.type ===
                    "locked"

                      ? "bg-red-600 hover:bg-red-700"

                      : "bg-orange-600 hover:bg-orange-700"
                  }`}
                >

                  <CheckCircle className="w-5 h-5" />

                  Acknowledge

                </button>
              )
            }

          </div>

        </div>

      </div>

    </div>
  );
};

export default NoticePopup;