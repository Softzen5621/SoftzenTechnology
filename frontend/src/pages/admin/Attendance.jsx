import {
  CalendarDays,
  Users,
  UserCheck,
  UserX,
  Clock3,
  Percent,
  AlertTriangle,
  Download,
  Search
} from "lucide-react";
import {
  useEffect,
  useState
} from "react";

import API
from "../../services/api";

// ======================================================
// ADMIN ATTENDANCE
// ======================================================

export default function Attendance() {
const [search, setSearch] =
  useState("");

const [selectedClass, setSelectedClass] =
  useState("All Classes");

  const [selectedDate, setSelectedDate] =
  useState("");
const [selectedStatus, setSelectedStatus] =
  useState("All Status");

const [selectedStudent, setSelectedStudent] =
  useState(null);

const [showModal, setShowModal] =
  useState(false);
  useEffect(() => {

  if (showModal) {

    document.body.style.overflow =
      "hidden";

  } else {

    document.body.style.overflow =
      "auto";
  }

  return () => {

    document.body.style.overflow =
      "auto";
  };

}, [showModal]);
  const [students, setStudents] =
  useState([]);

const [classes, setClasses] =
  useState([]);
  // ======================================================
  // DUMMY DATA
  // ======================================================

  const stats = [

    {
      title: "Total Students",
      value: "2,540",
      icon: Users,
      color:
        "from-blue-600 to-cyan-500"
    },

    {
      title: "Present Today",
      value: "2,301",
      icon: UserCheck,
      color:
        "from-green-600 to-emerald-500"
    },

    {
      title: "Absent Today",
      value: "239",
      icon: UserX,
      color:
        "from-red-600 to-pink-500"
    },

    {
      title: "Late Entries",
      value: "41",
      icon: Clock3,
      color:
        "from-yellow-500 to-orange-500"
    },

    {
      title: "Attendance %",
      value: "91%",
      icon: Percent,
      color:
        "from-purple-600 to-violet-500"
    },

    {
      title: "Low Attendance",
      value: "18",
      icon: AlertTriangle,
      color:
        "from-rose-600 to-red-500"
    }
  ];

  // ======================================================
  // UI
  // ======================================================
useEffect(() => {

  fetchStudents();
  fetchClasses();

}, []);

const fetchStudents =
  async () => {

    try {

      const res =
        await API.get(
          "/students"
        );

      const studentsData =
        res.data.students || [];

      const updatedStudents =
        studentsData.map(
          (student) => ({

            ...student,

            attendanceStatus:
              "Present",

            attendancePercentage:
              0
          })
        );

      setStudents(
        updatedStudents
      );

    } catch (err) {

      console.log(err);
    }
  };
const fetchClasses =
  async () => {

    try {

      const res =
        await API.get(
          "/sections"
        );

      setClasses(
       res.data.sections || []
      );

    } catch (err) {

      console.log(err);
    }
  };

const filteredStudents =
  students.filter(    (student) => {

      const matchesSearch =

        student.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        student.studentId
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesClass =

        selectedClass ===
        "All Classes"

          ? true

          : (
  student.sectionId?.sectionName ||
  student.sectionId?.name ||
  student.section ||
  student.className
) === selectedClass;

      const matchesStatus =

  selectedStatus ===
  "All Status"

    ? true

    : (
        student.attendanceStatus ||
        "Present"
      ) === selectedStatus;
      return (

        matchesSearch &&
        matchesClass &&
        matchesStatus
      );
    }
  );
  return (

    

    <div
      className="
        min-h-screen
        bg-[#F4F7FB]
        p-6
        space-y-6
      "
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-5
        "
      >

        <div>

          <h1
            className="
              text-4xl
              font-black
              text-slate-900
            "
          >
            Attendance Analytics
          </h1>

          <p
            className="
              text-slate-500
              mt-2
            "
          >
            Complete attendance overview & student insights
          </p>

        </div>

        {/* ACTIONS */}

        <div
          className="
            flex
            items-center
            gap-4
            flex-wrap
          "
        >

          <button
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-white
              border
              border-slate-200
              shadow-sm
              hover:bg-slate-50
              transition
              text-slate-900
              font-medium
            "
          >

            <Download size={18} />

            Export Report

          </button>

          <button
            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              font-semibold
              text-white
              shadow-lg
              hover:scale-[1.02]
              transition
            "
          >

            <CalendarDays size={18} />

            Monthly Report

          </button>

        </div>

      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          2xl:grid-cols-6
          gap-5
        "
      >

        {

          stats?.map(
            (item, index) => {

              const Icon =
                item.icon;

              return (

                <div
                  key={index}

                  className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    p-6
                  "
                >

                  <div
                    className={`
                      absolute
                      inset-0
                      opacity-5
                      bg-gradient-to-r
                      ${item.color}
                    `}
                  />

                  <div
                    className="
                      relative
                      z-10
                    "
                  >

                    <div
                      className={`
                        w-14
                        h-14
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        bg-gradient-to-r
                        ${item.color}
                        shadow-xl
                        text-white
                      `}
                    >

                      <Icon
                        size={28}
                      />

                    </div>

                    <h2
                      className="
                        text-4xl
                        font-black
                        mt-5
                        text-slate-900
                      "
                    >
                      {item.value}
                    </h2>

                    <p
                      className="
                        text-slate-500
                        mt-2
                      "
                    >
                      {item.title}
                    </p>

                  </div>

                </div>
              );
            }
          )
        }

      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div
        className="
          bg-white
          border
          border-slate-200
          shadow-sm
          rounded-3xl
          p-5
          flex
          flex-col
          xl:flex-row
          xl:items-center
          gap-4
        "
      >

        {/* SEARCH */}

        <div
          className="
            flex
            items-center
            gap-3
            flex-1
            px-5
            py-4
            rounded-2xl
            bg-slate-100
            border
            border-slate-200
          "
        >

          <Search
            size={20}
            className="
              text-slate-400
            "
          />

          <input
            type="text"
            value={search}

onChange={(e) =>
  setSearch(
    e.target.value
  )
}

            placeholder="Search student..."

            className="
              bg-transparent
              outline-none
              w-full
              text-slate-900
            "
          />

        </div>

        {/* DATE */}

        <input
          type="date"
          value={selectedDate}

onChange={(e) =>
  setSelectedDate(
    e.target.value
  )
}

          className="
            px-5
            py-4
            rounded-2xl
            bg-white
            border
            border-slate-200
            text-slate-900
            outline-none
          "
        />

        {/* CLASS */}

        <select
        value={selectedClass}

onChange={(e) =>
  setSelectedClass(
    e.target.value
  )
}
          className="
            px-5
            py-4
            rounded-2xl
            bg-white
            border
            border-slate-200
            text-slate-900
            outline-none
          "
        >

          <option>
  All Classes
</option>

{
  classes?.map(
    (item) => (

      <option
        key={item._id}
        value={
          item.sectionName ||
          `${item.className} - ${item.section}`
        }
      >
        {
          item.sectionName ||
          `${item.className} - ${item.section}`
        }
      </option>
    )
  )
}
        </select>

        {/* STATUS */}

        <select
        value={selectedStatus}

onChange={(e) =>
  setSelectedStatus(
    e.target.value
  )
}
          className="
            px-5
            py-4
            rounded-2xl
            bg-white
            border
            border-slate-200
            text-slate-900
            outline-none
          "
        >

          <option>
            All Status
          </option>

          <option>
            Present
          </option>

          <option>
            Absent
          </option>

          <option>
            Late
          </option>

          <option>
            Half Day
          </option>

        </select>

      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div
        className="
          bg-white
          shadow-sm
          border
          border-slate-200
          rounded-3xl
          overflow-hidden
        "
      >

        {/* TABLE HEADER */}

        <div
          className="
            grid
            grid-cols-6
            gap-4
            p-5
            bg-slate-100
            text-slate-700
            font-semibold
          "
        >

          <div>
            Student
          </div>

          <div>
            Class
          </div>

          <div>
          Student ID
          </div>

          <div>
            Status
          </div>

          <div>
            Attendance %
          </div>

          <div>
            Actions
          </div>

        </div>

        {/* STUDENTS */}

        {

         filteredStudents?.map(
          
            (student) => (

              <div
                key={student._id}

                className="
                  grid
                  grid-cols-6
                  gap-4
                  p-5
                  border-t
                  border-slate-200
                  items-center
                  hover:bg-slate-50
                  transition
                "
              >

                {/* NAME */}

                <div>

                  <h2
                    className="
                      font-semibold
                      text-slate-900
                    "
                  >
                    {student.name}
                  </h2>

                </div>

                {/* CLASS */}

                <div
                  className="
                    text-slate-600
                  "
                >
                  {
  (() => {
  // FULL SECTION OBJECT
  if (student.sectionId?.sectionName) {
    return student.sectionId.sectionName;
  }

  // SIMPLE NAME
  if (student.sectionId?.name) {
    return student.sectionId.name;
  }

  // STRING VALUE
  if (student.section) {
    return student.section;
  }

  // LKG / UKG / NURSERY
  if (student.className) {
    return student.className;
  }

  return "N/A";
})()
}
                </div>

                {/* ROLL */}

                <div
                  className="
                    text-slate-600
                  "
                >
                  #{student.studentId || "N/A"}
                </div>

                {/* STATUS */}

                <div>

                  <span
                    className={`
                      px-4
                      py-2
                      rounded-xl
                      text-sm
                      font-semibold

                      ${
                        
 
  (
    student.attendanceStatus ||
    "Present"
  ) === "Present"

                          ? `
                            bg-green-100
                            text-green-700
                          `

                          : (
    student.attendanceStatus ||
    "Present"
  ) === "Absent"

                          ? `
                            bg-red-100
                            text-red-700
                          `

                          : (
    student.attendanceStatus ||
    "Present"
  ) === "Late"

                          ? `
                            bg-yellow-100
                            text-yellow-700
                          `

                          : `
                            bg-purple-100
                            text-purple-700
                          `
                      }
                    `}
                  >

                    {
  student.attendanceStatus || "Present" ||
  "Present"
}

                  </span>

                </div>

                {/* PERCENTAGE */}

                <div
                  className="
                    text-slate-900
                    font-semibold
                  "
                >
                 {
  student.attendancePercentage || 0
}%
                </div>

                {/* ACTIONS */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <button onClick={() => {

  setSelectedStudent(
    student
  );

  setShowModal(
    true
  );
}}
                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-blue-600
                      text-white
                      hover:bg-blue-700
                      transition
                    "
                  >

                    View

                  </button>

                  <button
                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-white
                      border
                      border-slate-200
                      hover:bg-slate-50
                      transition
                      text-slate-900
                    "
                  >

                    Report

                  </button>

                </div>

              </div>
            )
          )
        }

      </div>

      {/* ======================================================
          LOWER GRID
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >

        {/* LEFT */}

        <div
          className="
            xl:col-span-2
            bg-white
            border
            border-slate-200
            rounded-3xl
            p-6
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-6
            "
          >

            <h2
              className="
                text-2xl
                font-black
                text-slate-900
              "
            >
              Attendance Trends
            </h2>

            <button
              className="
                px-4
                py-2
                rounded-xl
                bg-slate-100
                border
                border-slate-200
                text-slate-900
              "
            >
              This Month
            </button>

          </div>

          <div
            className="
              h-[350px]
              rounded-3xl
              bg-slate-100
              border
              border-slate-200
              flex
              items-center
              justify-center
              text-slate-500
              text-lg
              font-medium
            "
          >

            Charts Coming Soon 📈

          </div>

        </div>

        {/* RIGHT */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-3xl
            p-6
            shadow-sm
          "
        >

          <h2
            className="
              text-2xl
              font-black
              text-slate-900
              mb-6
            "
          >
            Quick Actions
          </h2>

          <div
            className="
              flex
              flex-col
              gap-4
            "
          >

            <button
              className="
                w-full
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-green-600
                to-emerald-500
                text-white
                font-semibold
              "
            >
              Mark All Present
            </button>

            <button
              className="
                w-full
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-red-600
                to-pink-500
                text-white
                font-semibold
              "
            >
              Send Absent Alerts
            </button>

            <button
              className="
                w-full
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                text-white
                font-semibold
              "
            >
              Download Reports
            </button>

            <button
              className="
                w-full
                py-4
                rounded-2xl
                bg-white
                border
                border-slate-200
                text-slate-900
                font-semibold
              "
            >
              Lock Attendance
            </button>

          </div>

        </div>

      </div>
      {
  showModal && (

    <div
      className="
        fixed
        inset-0
        bg-black/50
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-2xl
          bg-white
          rounded-3xl
          p-8
          shadow-2xl
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-black
                text-slate-900
              "
            >
              {
                selectedStudent?.name
              }
            </h2>

            <p
              className="
                text-slate-500
                mt-1
              "
            >
            {
  selectedStudent?.sectionId?.sectionName ||
  selectedStudent?.sectionId?.name ||
  selectedStudent?.section ||
  selectedStudent?.className ||
  "N/A"
}
            </p>

          </div>

          <button

            onClick={() =>

              setShowModal(
                false
              )
            }

            className="
              px-5
              py-2
              rounded-xl
              bg-red-500
              text-white
            "
          >

            Close

          </button>

        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-5
          "
        >

          <div
            className="
              bg-green-50
              border
              border-green-200
              rounded-2xl
              p-5
            "
          >

            <p
              className="
                text-green-700
              "
            >
              Attendance %
            </p>

            <h2
              className="
                text-4xl
                font-black
                text-green-900
                mt-2
              "
            >
              {
                selectedStudent?.attendancePercentage || "0%"
              }
            </h2>

          </div>

          <div
            className="
              bg-blue-50
              border
              border-blue-200
              rounded-2xl
              p-5
            "
          >

            <p
              className="
                text-blue-700
              "
            >
              Current Status
            </p>

            <h2
              className="
                text-3xl
                font-black
                text-blue-900
                mt-2
              "
            >
              {
                selectedStudent?.attendanceStatus || "Present"
              }
            </h2>

          </div>

        </div>

      </div>

    </div>
  )
}

    </div>
  );
}