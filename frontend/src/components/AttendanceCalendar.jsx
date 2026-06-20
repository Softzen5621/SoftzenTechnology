import Calendar
from "react-calendar";

import "react-calendar/dist/Calendar.css";


// ======================================================
// ATTENDANCE CALENDAR
// ======================================================

export default function AttendanceCalendar({

  attendanceRecords = [],

  holidays = []

}) {

  // ======================================================
  // GET STATUS
  // ======================================================
const formatLocalDate = (date) => {

  const d = new Date(date);

  const year = d.getFullYear();

  const month =
    String(
      d.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      d.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


  const getStatus =
    (date) => {

      const formatted =
  formatLocalDate(date);

      // HOLIDAY

      const holiday =
        holidays.find(
          (item) =>

           formatLocalDate(
  item.startDate
)

            <= formatted &&

            formatLocalDate(
  item.endDate
)
              
            >= formatted
        );

      if (holiday) {

        return "Holiday";
      }


      // ATTENDANCE

      const attendance =
        attendanceRecords.find(
          (item) =>

           formatLocalDate(
  item.attendanceDate
)

            === formatted
        );

      return attendance?.status;
    };

  // ======================================================
  // TILE CLASS
  // ======================================================

  const tileClassName =
    ({ date }) => {

      const status =
        getStatus(date);

      if (
        status === "Present"
      ) {

        return "attendance-present";
      }

      if (
        status === "Absent"
      ) {

        return "attendance-absent";
      }

      if (
        status === "Late"
      ) {

        return "attendance-late";
      }

      if (
        status === "Half Day"
      ) {

        return "attendance-halfday";
      }

      if (
        status === "Holiday"
      ) {

        return "attendance-holiday";
      }

      return "";
    };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div
      className="
        bg-[#0B1120]
        border
        border-white/10
        rounded-3xl
        p-6
        shadow-2xl
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
          mb-6
        "
      >

        <h2
          className="
            text-2xl
            font-black
            text-white
          "
        >
          Attendance Calendar
        </h2>

        {/* LEGEND */}

        <div
          className="
            flex
            flex-wrap
            gap-4
            text-sm
          "
        >

          <Legend
            color="bg-green-500"
            label="Present"
          />

          <Legend
            color="bg-red-500"
            label="Absent"
          />

          <Legend
            color="bg-yellow-500"
            label="Late"
          />

          <Legend
            color="bg-purple-500"
            label="Half Day"
          />

          <Legend
            color="bg-slate-500"
            label="Holiday"
          />

        </div>

      </div>

      {/* CALENDAR */}

      <Calendar
  className="
    attendance-calendar
  "
  tileClassName={
    tileClassName
  }

  tileContent={({ date }) => {

    const status =
      getStatus(date);

    return (
      <div
        style={{
          fontSize: "10px",
          fontWeight: "700",
          marginTop: "2px"
        }}
      >
        {
          status === "Present"
            ? "P"
            : status === "Absent"
            ? "A"
            : status === "Late"
            ? "L"
            : status === "Half Day"
            ? "Half Day"
            : status === "Holiday"
            ? "Holiday👋"
            : ""
        }
      </div>
    );
  }}
/>
      {/* CUSTOM CSS */}

      <style>

        {`

          .attendance-calendar {

            width: 100%;
            background: transparent;
            border: none;
            color: white;
            font-family: inherit;
          }

          /* NAVIGATION */

          .attendance-calendar .react-calendar__navigation {

            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 24px;
          }

          .attendance-calendar .react-calendar__navigation button {

            background: transparent !important;
            color: white !important;
            border: none !important;
            min-width: 44px;
            height: 44px;
            font-size: 18px;
            border-radius: 14px;
            transition: 0.2s;
          }

          .attendance-calendar .react-calendar__navigation button:hover {

            background: rgba(255,255,255,0.08) !important;
            color: #38bdf8 !important;
          }

          .attendance-calendar .react-calendar__navigation__label {

            background: #111827 !important;
            color: white !important;
            border-radius: 14px !important;
            font-weight: 700 !important;
            font-size: 16px !important;
            padding: 12px 0px !important;
          }

          /* WEEKDAYS */

          .attendance-calendar .react-calendar__month-view__weekdays {

            text-transform: uppercase;
            font-size: 12px;
            font-weight: 700;
            color: #94a3b8;
            margin-bottom: 10px;
          }

          .attendance-calendar .react-calendar__month-view__weekdays__weekday {

            padding: 12px 0;
          }

          /* TILES */

          .attendance-calendar .react-calendar__tile {

            background: transparent;
            color: white;
            border-radius: 14px;
            padding: 14px 6px;
            transition: 0.2s;
            position: relative;
          }

          .attendance-calendar .react-calendar__tile:hover {

            background: rgba(255,255,255,0.08) !important;
            color: white !important;
          }

          .attendance-calendar .react-calendar__tile:enabled:focus {

            background: rgba(255,255,255,0.08) !important;
            color: white !important;
          }

          .attendance-calendar .react-calendar__tile--active {

            background: #1d4ed8 !important;
            color: white !important;
          }

          .attendance-calendar .react-calendar__tile--hasActive {

            background: rgba(59,130,246,0.25) !important;
          }

          .attendance-calendar .react-calendar__tile--now {

            background: rgba(59,130,246,0.25) !important;
            color: #60a5fa !important;
            font-weight: bold;
          }

          /* YEAR / DECADE / CENTURY VIEW */

          .attendance-calendar .react-calendar__year-view__months__month {

            color: white !important;
            border-radius: 14px;
            padding: 20px 10px;
          }

          .attendance-calendar .react-calendar__year-view__months__month:hover {

            background: rgba(255,255,255,0.08) !important;
          }

          .attendance-calendar .react-calendar__decade-view__years__year {

            color: white !important;
            border-radius: 14px;
            padding: 20px 10px;
          }

          .attendance-calendar .react-calendar__decade-view__years__year:hover {

            background: rgba(255,255,255,0.08) !important;
          }

          .attendance-calendar .react-calendar__century-view__decades__decade {

            color: white !important;
            border-radius: 14px;
            padding: 20px 10px;
          }

          .attendance-calendar .react-calendar__century-view__decades__decade:hover {

            background: rgba(255,255,255,0.08) !important;
          }
/* STATUS COLORS */

.attendance-present {

  background: #16a34a !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border: 2px solid #22c55e !important;
}

.attendance-absent {

  background: #dc2626 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border: 2px solid #ef4444 !important;
}

.attendance-late {

  background: #eab308 !important;
  color: #000000 !important;
  font-weight: 700 !important;
  border: 2px solid #facc15 !important;
}

.attendance-halfday {

  background: #9333ea !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border: 2px solid #a855f7 !important;
}

.attendance-holiday {

  background: #475569 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border: 2px solid #64748b !important;
}

        `}

      </style>

    </div>
  );
}

// ======================================================
// LEGEND
// ======================================================

function Legend({

  color,

  label

}) {

  return (

    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      <div
        className={`
          w-3
          h-3
          rounded-full
          ${color}
        `}
      />

      <span
        className="
          text-slate-300
        "
      >
        {label}
      </span>

    </div>
  );
}