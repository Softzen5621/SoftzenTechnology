import {
  useEffect,
  useState
} from "react";

import API
from "../services/api";

import AttendanceCalendar
from "./AttendanceCalendar";

// ======================================================
// STUDENT ATTENDANCE MODAL
// ======================================================

export default function StudentAttendanceModal({

  student,

  summary,

  onClose

}) {
  // ======================================================
  // STATES
  // ======================================================

  const [loading, setLoading] =
    useState(false);

  const [attendance, setAttendance] =
    useState([]);

  const [holidays, setHolidays] =
    useState([]);

  const [studentSummary, setStudentSummary] =
  useState(null);
  // ======================================================
  // FETCH DATA
  // ======================================================

  useEffect(() => {

    if (student) {

      fetchAttendance();
    }

  }, [student]);

  // ======================================================
  // FETCH
  // ======================================================

  const fetchAttendance =
    async () => {

      try {

        setLoading(true);

        const today =
          new Date();

        const month =
          today.getMonth() + 1;

        const year =
          today.getFullYear();

        // MONTHLY

        const res =
          await API.get(

            `api/attendance/monthly?studentId=${student._id}&month=${month}&year=${year}`
          );

        // HOLIDAYS

        const holidayRes =
          await API.get(
            "/holidays/all"
          );

        setAttendance(

          res.data.attendance || []
        );

        setStudentSummary(

  res.data.summary
);
        setHolidays(

          holidayRes.data.holidays || []
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // UI
  // ======================================================

  if (!student) return null;

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-6
      "
    >

      <div
        className="
          w-full
          max-w-7xl
          max-h-[95vh]
          overflow-y-auto
          bg-[#081028]
          border
          border-white/10
          rounded-3xl
          p-8
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-6
            mb-8
          "
        >

          <div>

            <h1
              className="
                text-4xl
                font-black
                text-white
              "
            >
              {
                student.name
              }
            </h1>

            <p
              className="
                text-cyan-400
                mt-2
              "
            >
              {
                student.studentId
              }
            </p>

          </div>

          <button

            onClick={onClose}

            className="
              px-5
              py-3
              rounded-2xl
              bg-red-600
              hover:bg-red-700
              text-white
              font-semibold
            "
          >

            Close

          </button>

        </div>

        {/* LOADING */}

        {
          loading && (

            <div
              className="
                text-center
                py-20
                text-white
              "
            >
              Loading...
            </div>
          )
        }

        {/* CONTENT */}

        {
          !loading &&
          studentSummary && (

            <div
              className="
                space-y-8
              "
            >

              {/* studentSummary */}

              <div
                className="
                  grid
                  grid-cols-2
                  md:grid-cols-6
                  gap-5
                "
              >

                <Card
                  title="Present"
                  value={studentSummary.totalPresent}
                  color="green"
                />

                <Card
                  title="Absent"
                  value={studentSummary.totalAbsent}
                  color="red"
                />

                <Card
                  title="Late"
                  value={studentSummary.totalLate}
                  color="yellow"
                />

                <Card
                  title="Half Day"
                  value={studentSummary.totalHalfDay}
                  color="purple"
                />

                <Card
                  title="Total Days"
                  value={studentSummary.totalDays}
                  color="blue"
                />

                <Card
                  title="Attendance %"
                  value={`${studentSummary.attendancePercentage}%`}
                  color="cyan"
                />

              </div>

              {/* CALENDAR */}

              <AttendanceCalendar

                attendanceRecords={
                  attendance
                }

                holidays={
                  holidays
                }
              />

              {/* ABSENT REASONS */}

              <div
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-3xl
                  p-6
                "
              >

                <h2
                  className="
                    text-2xl
                    font-black
                    text-white
                    mb-6
                  "
                >
                  Recent Absences
                </h2>

                {

                  attendance.filter(

                    (item) =>

                      item.status ===
                      "Absent"
                  ).length === 0 && (

                    <p
                      className="
                        text-slate-400
                      "
                    >
                      No absences found
                    </p>
                  )
                }

                <div
                  className="
                    space-y-4
                  "
                >

                  {

                    attendance

                      .filter(

                        (item) =>

                          item.status ===
                          "Absent"
                      )

                      .map((item) => (

                        <div
                          key={item._id}

                          className="
                            p-4
                            rounded-2xl
                            bg-red-500/10
                            border
                            border-red-500/20
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                            "
                          >

                            <p
                              className="
                                text-white
                                font-semibold
                              "
                            >
                              {

                                new Date(

                                  item.attendanceDate
                                ).toLocaleDateString()
                              }
                            </p>

                            <p
                              className="
                                text-red-300
                              "
                            >
                              {
                                item.absentReason ||
                                "No reason"
                              }
                            </p>

                          </div>

                        </div>
                      ))
                  }

                </div>

              </div>

            </div>
          )
        }

      </div>

    </div>
  );
}

// ======================================================
// CARD
// ======================================================

function Card({

  title,

  value,

  color

}) {

  const colors = {

    green:
      "bg-green-500/10 border-green-500/20 text-green-400",

    red:
      "bg-red-500/10 border-red-500/20 text-red-400",

    yellow:
      "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",

    purple:
      "bg-purple-500/10 border-purple-500/20 text-purple-400",

    blue:
      "bg-blue-500/10 border-blue-500/20 text-blue-400",

    cyan:
      "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
  };

  return (

    <div
      className={`
        border
        rounded-3xl
        p-5
        ${colors[color]}
      `}
    >

      <p
        className="
          text-sm
          opacity-80
        "
      >
        {title}
      </p>

      <h2
        className="
          text-3xl
          font-black
          mt-2
        "
      >
        {value}
      </h2>

    </div>
  );
}