import {
  useEffect,
  useState
} from "react";

import axios from "axios";

import NoticeBoard from "../../components/NoticeBoard";

import NoticePopup from "../../components/NoticePopup";


export default function Dashboard() {

  // ====================================
  // STATES
  // ====================================

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ====================================
  // FETCH DASHBOARD
  // ====================================

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(

            "http://localhost:5000/api/teachers/dashboard",

            {

              headers: {

                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setDashboard(
          res.data.dashboard
        );

      } catch (err) {

        console.error(err);

        setError(
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);
      }
    };

  // ====================================
  // LOADING
  // ====================================

  if (loading) {

    return (

      <div
        className="
          text-white
          text-2xl
        "
      >
        Loading Dashboard...
      </div>
    );
  }

  // ====================================
  // ERROR
  // ====================================

  if (error) {

    return (

      <div
        className="
          text-red-400
          text-xl
        "
      >
        {error}
      </div>
    );
  }

  // ====================================
  // UI
  // ====================================

  return (

    <div
      className="
        space-y-8
      "
    >

      {/* NOTICE POPUP */}

      <NoticePopup />

      {/* NOTICE BOARD */}

      <NoticeBoard />

      {/* TEACHER INFO */}

      <div
        className="
          p-8
          rounded-3xl
          bg-white/5
          border
          border-white/10
        "
      >

        <h2
          className="
            text-4xl
            font-black
            text-white
          "
        >
          {
            dashboard.teacher
              ?.fullName
          }
        </h2>

        <p
          className="
            text-slate-400
            mt-3
          "
        >
          {
            dashboard.teacher
              ?.designation
          }
        </p>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          md:grid-cols-2
          gap-6
        "
      >

        {/* TOTAL CLASSES */}

        <div
          className="
            p-8
            rounded-3xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
          "
        >

          <h2
            className="
              text-5xl
              font-black
            "
          >
            {
              dashboard.stats
                ?.totalClasses
            }
          </h2>

          <p
            className="
              mt-3
              text-lg
            "
          >
            Assigned Classes
          </p>

        </div>

        {/* TOTAL SUBJECTS */}

        <div
          className="
            p-8
            rounded-3xl
            bg-gradient-to-r
            from-purple-600
            to-pink-500
          "
        >

          <h2
            className="
              text-5xl
              font-black
            "
          >
            {
              dashboard.stats
                ?.totalSubjects
            }
          </h2>

          <p
            className="
              mt-3
              text-lg
            "
          >
            Assigned Subjects
          </p>

        </div>

      </div>

      {/* ASSIGNED CLASSES */}

      <div
        className="
          p-8
          rounded-3xl
          bg-white/5
          border
          border-white/10
        "
      >

        <h2
          className="
            text-3xl
            font-bold
            text-white
            mb-6
          "
        >
          Assigned Classes
        </h2>

        <div
          className="
            flex
            flex-wrap
            gap-4
          "
        >

          {
            dashboard.assignedClasses
              ?.map((item, index) => (

                <div
                  key={index}
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    bg-blue-500/20
                    border
                    border-blue-500/20
                    text-white
                  "
                >
                  {
                    item.displayName
                  }
                </div>
              ))
          }

        </div>

      </div>

      {/* ASSIGNED SUBJECTS */}

      <div
        className="
          p-8
          rounded-3xl
          bg-white/5
          border
          border-white/10
        "
      >

        <h2
          className="
            text-3xl
            font-bold
            text-white
            mb-6
          "
        >
          Assigned Subjects
        </h2>

        <div
          className="
            flex
            flex-wrap
            gap-4
          "
        >

          {
            dashboard.assignedSubjects
              ?.map((subject) => (

                <div
                  key={subject._id}
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    bg-purple-500/20
                    border
                    border-purple-500/20
                    text-white
                  "
                >
                  {
                    subject.name
                  }
                </div>
              ))
          }

        </div>

      </div>

    </div>
  );
}