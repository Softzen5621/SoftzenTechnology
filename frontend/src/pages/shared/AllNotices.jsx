import { useEffect, useState } from "react";

import {
  getNotices,
  acknowledgeNotice,
  markNoticeViewed,
} from "../../services/noticeService";

import {
  Bell,
  Eye,
  CheckCircle,
  AlertTriangle,
  Pin,
  CalendarDays,
  Paperclip,
  Clock3,
} from "lucide-react";

const AllNotices = () => {

  const [notices, setNotices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================================
  // USER ROLE
  // =========================================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const role =
    user?.role;

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

        // =====================================
        // SORTING
        // LOCKED -> MANDATORY
        // =====================================

        noticeData.sort((a, b) => {

          const order = {

            locked: 1,

            mandatory: 2,
          };

          return (
            order[a.type] -
            order[b.type]
          );
        });

        setNotices(
          noticeData
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchNotices();

  }, []);

  // =========================================
  // VIEW
  // =========================================

  const handleView =
    async (id) => {

      try {

        await markNoticeViewed(
          id
        );

      } catch (error) {

        console.log(error);
      }
    };

  // =========================================
  // ACKNOWLEDGE
  // =========================================

  const handleAcknowledge =
    async (
      id,
      type
    ) => {

      try {

        await acknowledgeNotice(
          id
        );

        // =====================================
        // REMOVE ONLY MANDATORY
        // =====================================

        if (
          type ===
          "mandatory"
        ) {

          setNotices((prev) =>
            prev.filter(
              (notice) =>
                notice._id !== id
            )
          );
        }

        // =====================================
        // REFRESH LOCKED
        // =====================================

        if (
          type ===
          "locked"
        ) {

          fetchNotices();
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
        new Date(
          expiryDate
        );

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

      return `
        ${days}d
        ${hours}h left
      `;
    };

  // =========================================
  // CARD STYLE
  // =========================================

  const getCardStyle =
    (notice) => {

      // LOCKED

      if (
        notice.type ===
        "locked"
      ) {

        return `
          border-red-500
          bg-gradient-to-r
          from-red-50
          to-white
        `;
      }

      // MANDATORY

      return `
        border-orange-500
        bg-gradient-to-r
        from-orange-50
        to-white
      `;
    };

  // =========================================
  // BADGE
  // =========================================

  const getBadge =
    (notice) => {

      if (
        notice.type ===
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
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="p-6">

        <div className="bg-white rounded-3xl shadow-md p-10 text-center">

          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600 font-medium">
            Loading notices...
          </p>

        </div>

      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-8">

        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

          <Bell className="w-7 h-7 text-blue-700" />

        </div>

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            All Notices
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Latest updates and important announcements
          </p>

        </div>

      </div>

      {/* EMPTY */}

      {

        notices.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-md p-10 text-center">

            <Bell className="w-14 h-14 text-gray-300 mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-gray-700">
              No Notices Available
            </h2>

            <p className="text-gray-500 mt-2">
              There are currently no active notices
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {

              notices.map(
                (notice) => (

                  <div
                    key={
                      notice._id
                    }
                    className={`border-l-4 rounded-3xl p-7 shadow-md hover:shadow-xl transition-all ${getCardStyle(
                      notice
                    )}`}
                  >

                    <div className="flex items-start justify-between gap-5">

                      {/* LEFT */}

                      <div className="flex-1">

                        {/* TITLE */}

                        <div className="flex items-center gap-2 flex-wrap mb-4">

                          {

                            notice.type ===
                              "locked" && (

                              <Pin className="w-5 h-5 text-red-600" />
                            )
                          }

                          {

                            notice.priority ===
                              "urgent" && (

                              <AlertTriangle className="w-5 h-5 text-orange-600" />
                            )
                          }

                          <h2 className="text-2xl font-bold text-gray-800">

                            {notice.title}

                          </h2>

                          <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold ${getBadge(
                              notice
                            )}`}
                          >

                            {

                              notice.type ===
                              "locked"

                                ? "Force Notice"

                                : "Acknowledgement Required"
                            }

                          </span>

                        </div>

                        {/* DESCRIPTION */}

                        <p className="text-gray-700 leading-relaxed text-[15px]">

                          {notice.description}

                        </p>

                        {/* INFO */}

                        <div className="flex items-center gap-5 flex-wrap mt-5 text-sm text-gray-500">

                          <div className="flex items-center gap-2">

                            <CalendarDays className="w-4 h-4" />

                            <span>

                              {
                                new Date(
                                  notice.createdAt
                                ).toLocaleDateString()
                              }

                            </span>

                          </div>

                          {/* TIMER */}

                          {

                            notice.type ===
                              "locked" &&

                              notice.expiryDate && (

                                <div className="flex items-center gap-2 text-red-600 font-semibold">

                                  <Clock3 className="w-4 h-4" />

                                  {
                                    getCountdown(
                                      notice.expiryDate
                                    )
                                  }

                                </div>
                              )
                          }

                          {/* ADMIN ONLY ANALYTICS */}

                          {

                            role ===
                              "admin" && (

                              <>

                                <div>
                                  👁{" "}
                                  {
                                    notice
                                      .viewedBy
                                      ?.length ||
                                    0
                                  }{" "}
                                  Views
                                </div>

                                <div>
                                  ✔{" "}
                                  {
                                    notice
                                      .acknowledgedBy
                                      ?.length ||
                                    0
                                  }{" "}
                                  Acknowledged
                                </div>

                              </>
                            )
                          }

                        </div>

                        {/* ATTACHMENT */}

                        {

                          notice.attachment && (

                            <a
                              href={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${notice.attachment}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 mt-5 text-blue-600 font-semibold hover:text-blue-700"
                            >

                              <Paperclip className="w-4 h-4" />

                              View Attachment

                            </a>
                          )
                        }

                        {/* BUTTONS */}

                        <div className="flex items-center gap-3 flex-wrap mt-7">

                          {/* VIEW */}

                          <button
                            onClick={() =>
                              handleView(
                                notice._id
                              )
                            }
                            className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium"
                          >

                            <Eye className="w-4 h-4" />

                            View Details

                          </button>

                          {/* ACKNOWLEDGE */}

                          <button
                            onClick={() =>
                              handleAcknowledge(
                                notice._id,
                                notice.type
                              )
                            }
                            className={`flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-medium ${
                              notice.type ===
                              "locked"

                                ? "bg-red-600 hover:bg-red-700"

                                : "bg-orange-600 hover:bg-orange-700"
                            }`}
                          >

                            <CheckCircle className="w-4 h-4" />

                            Acknowledge

                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                )
              )
            }

          </div>
        )
      }

    </div>
  );
};

export default AllNotices;