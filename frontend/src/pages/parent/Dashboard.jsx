import {
  useAuth
} from "../../context/AuthContext";

import NoticeBoard from "../../components/NoticeBoard";

import NoticePopup from "../../components/NoticePopup";

export default function Dashboard() {

  const {
    user
  } = useAuth();

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

      {/* HEADER */}

      <div>

        <h1
          className="
            text-4xl
            font-black
            text-white
          "
        >
          Welcome,
          {
            user?.name
          }
        </h1>

        <p
          className="
            text-slate-400
            mt-3
          "
        >
          Parent Dashboard
        </p>

      </div>

      {/* DASHBOARD CARDS */}

      <div
        className="
          grid
          md:grid-cols-3
          gap-6
        "
      >

        {/* ATTENDANCE */}

        <div
          className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-6
            hover:border-blue-500/40
            transition-all
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            📅 Attendance
          </h2>

          <p
            className="
              text-slate-400
              mt-3
            "
          >
            Check your child's attendance
          </p>

        </div>

        {/* FEES */}

        <div
          className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-6
            hover:border-green-500/40
            transition-all
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            💳 Fees
          </h2>

          <p
            className="
              text-slate-400
              mt-3
            "
          >
            View pending and paid fees
          </p>

        </div>

        {/* RESULTS */}

        <div
          className="
            bg-white/5
            border
            border-white/10
            rounded-3xl
            p-6
            hover:border-purple-500/40
            transition-all
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            🏆 Results
          </h2>

          <p
            className="
              text-slate-400
              mt-3
            "
          >
            Check exam performance
          </p>

        </div>

      </div>

    </div>
  );
}