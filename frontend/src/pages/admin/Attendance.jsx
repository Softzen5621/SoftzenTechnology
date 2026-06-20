import StudentAttendanceModal
from "../../components/StudentAttendanceModal";
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
const iconMap = {

  "Total Students": Users,

  "Present Today": UserCheck,

  "Absent Today": UserX,

  "Late Entries": Clock3,

  "Attendance %": Percent,

  "Low Attendance": AlertTriangle,

  "Classes Marked": CalendarDays
};
// ======================================================
// ADMIN ATTENDANCE
// ======================================================

export default function Attendance() {
const [search, setSearch] =
  useState("");

const [selectedClass, setSelectedClass] =
  useState("All Classes");

  const [selectedDate, setSelectedDate] =
  useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );
const [selectedStatus, setSelectedStatus] =
  useState("All Status");

const [selectedStudent, setSelectedStudent] =
  useState(null);

  const [markedClasses,
  setMarkedClasses] =
  useState([]);

const [pendingClasses,
  setPendingClasses] =
  useState([]);

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

  const [stats, setStats] =
  useState([]);

  const [holidays, setHolidays] =
  useState([]);

  const [page, setPage] = useState(1);

const [totalPages, setTotalPages] =
  useState(1);
  // ======================================================
  // DUMMY DATA
  // ======================================================

  // const stats = [

  //   {
  //     title: "Total Students",
  //     value: "299",
  //     icon: Users,
  //     color:
  //       "from-blue-600 to-cyan-500"
  //   },

  //   {
  //     title: "Present Today",
  //     value: "215",
  //     icon: UserCheck,
  //     color:
  //       "from-green-600 to-emerald-500"
  //   },

  //   {
  //     title: "Absent Today",
  //     value: "75",
  //     icon: UserX,
  //     color:
  //       "from-red-600 to-pink-500"
  //   },

  //   {
  //     title: "Late Entries",
  //     value: "9",
  //     icon: Clock3,
  //     color:
  //       "from-yellow-500 to-orange-500"
  //   },

  //   {
  //     title: "Attendance %",
  //     value: "95%",
  //     icon: Percent,
  //     color:
  //       "from-purple-600 to-violet-500"
  //   },

  //   {
  //     title: "Low Attendance",
  //     value: "18",
  //     icon: AlertTriangle,
  //     color:
  //       "from-rose-600 to-red-500"
  //   }
  // ];

  // ======================================================
  // UI
  // ======================================================
useEffect(() => {

  
  fetchDashboard();
  fetchHolidays();

}, [

  selectedDate,
  selectedClass
]);

useEffect(() => {

  fetchClasses();

}, []);
useEffect(() => {

  if (holidays.length > 0) {

    fetchStudents();

  }

}, [
  holidays,
  page,
  selectedDate,
  selectedClass
]);

const fetchDashboard =
  async () => {

    const res =
      await API.get(
  `/attendance/dashboard?date=${selectedDate}`
);

    setStats(
  res.data.stats.map(item => ({
    ...item,
    color:
      item.title === "Total Students"
        ? "from-blue-600 to-cyan-500"
      : item.title === "Present Today"
        ? "from-green-600 to-emerald-500"
      : item.title === "Absent Today"
        ? "from-red-600 to-pink-500"
      : item.title === "Late Entries"
        ? "from-yellow-500 to-orange-500"
      : item.title === "Attendance %"
        ? "from-purple-600 to-violet-500"
      : "from-slate-600 to-slate-500"
  }))
);

    setMarkedClasses(
      res.data.markedClassList
    );

    setPendingClasses(
      res.data.pendingClassList
    );
  };
const fetchHolidays =
  async () => {

    try {

      const res =
        await API.get(
          "/holidays/all"
        );

      setHolidays(
        res.data.holidays || []
      );

    } catch (err) {

      console.log(err);
    }
  };


const fetchStudents =
  async () => {

    try {

      const query =

selectedClass ===
"All Classes"

? `/students?page=${page}&limit=50`

: `/students?page=${page}&limit=50&className=${selectedClass}`;

const res =
  await API.get(query);

setTotalPages(
  res.data.totalPages || 1
);
        

      const studentsData =
        res.data.students || [];
const bulkAttendance =
  await API.post(

    "/attendance/bulk-status",

    {

      attendanceDate:
        selectedDate,

      studentIds:

        studentsData.map(
          s => s._id
        )
    }
  );
        
const attendanceMap =
  {};

bulkAttendance.data.attendance.forEach(

  item => {

    attendanceMap[
  item.studentId.toString()
] = item;
  }
);

   const updatedStudents =
  await Promise.all(

    studentsData.map(
      async (student) => {

        try {

const attendanceRecord =

  attendanceMap[
    student._id.toString()
  ];


          const todayDate =
  selectedDate ||
  new Date()
    .toISOString()
    .split("T")[0];

const isHoliday =
  holidays.some(
    (holiday) => {

      const start =
        new Date(
          holiday.startDate
        )
          .toISOString()
          .split("T")[0];

      const end =
        new Date(
          holiday.endDate
        )
          .toISOString()
          .split("T")[0];

      return (
        todayDate >= start &&
        todayDate <= end
      );
    }
  );

let attendanceStatus =
  isHoliday
    ? "Holiday"
    : "Not Marked";

if (attendanceRecord) {

  attendanceStatus =
    attendanceRecord.status;
}
            

          return {

            ...student,

           attendancePercentage:
  null,

            attendanceStatus
          };

        }

        catch {

  const todayDate =
    selectedDate ||
    new Date()
      .toISOString()
      .split("T")[0];

  const isHoliday =
    holidays.some(
      holiday => {

        const start =
          new Date(
            holiday.startDate
          )
          .toISOString()
          .split("T")[0];

        const end =
          new Date(
            holiday.endDate
          )
          .toISOString()
          .split("T")[0];

        return (
          todayDate >= start &&
          todayDate <= end
        );
      }
    );

  return {

    ...student,

    attendancePercentage:
      null,

    attendanceStatus:
      isHoliday
        ? "Holiday"
        : "Not Marked"
  };
}
      }
    )
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

      const sections =
        res.data.sections || [];

      const uniqueClasses = [

        ...new Set(

          sections.map(
            item =>
              item.className
          )
        )
      ];

      setClasses(
        uniqueClasses
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
  student.sectionId?.className ||
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
  item.icon ||
  iconMap[item.title] ||
  Users;

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
            flex-[0.6]
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
        <select
  className="
    px-4
    py-4
    rounded-2xl
    border
    border-slate-200
    bg-white
  "
>
  <option>
    Marked Classes ({markedClasses.length})
  </option>

  {markedClasses.map(cls => (
    <option key={cls}>
      {cls}
    </option>
  ))}
</select>

<select
  className="
    px-4
    py-4
    rounded-2xl
    border
    border-slate-200
    bg-white
  "
>
  <option>
    Pending Classes ({pendingClasses.length})
  </option>

  {pendingClasses.map(cls => (
    <option key={cls}>
      {cls}
    </option>
  ))}
</select>

        {/* DATE */}

        <input
          type="date"
          value={selectedDate}
onChange={(e) => {

  setSelectedDate(
    e.target.value
  );

  setPage(1);

}}          
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

onChange={(e) => {

  setSelectedClass(
    e.target.value
  );

  setPage(1);

}}


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
  (cls) => (

     <option
  key={cls}
  value={cls}
>
  {cls}
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

          <option value="All Status">
            All Status
          </option>

          
          <option value="Holiday">
  Holiday
</option>

<option value="Not Marked">
  Not Marked
</option>

<option value="Present">
  Present
</option>

<option value="Absent">
  Absent
</option>

<option value="Late">
  Late
</option>

<option value="Half Day">
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
  if (student.sectionId?.className) {
  return student.sectionId.className;
}

if (student.sectionId?.sectionName) {
  return student.sectionId.sectionName;
}

if (student.sectionId?.name) {
  return student.sectionId.name;
}

if (student.section) {
  return student.section;
}

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
                  {student.studentId || "N/A"}
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
  student.attendanceStatus === "Present"
    ? "bg-green-100 text-green-700"
    : student.attendanceStatus === "Absent"
    ? "bg-red-100 text-red-700"
    : student.attendanceStatus === "Late"
    ? "bg-yellow-100 text-yellow-700"
    : student.attendanceStatus === "Half Day"
    ? "bg-purple-100 text-purple-700"
    : student.attendanceStatus === "Holiday"
? "bg-blue-100 text-blue-700"
   : student.attendanceStatus === "Not Marked"
? "bg-amber-100 text-amber-700"
: "bg-slate-100 text-slate-700"
}                    
                    `}
                  >

                    {
  student.attendanceStatus || "Not Marked"
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
  student.attendancePercentage === null
    ? "--"
    : `${student.attendancePercentage}%`
}
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

<div className="flex items-center justify-center gap-4 p-6">

  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
  >
    Previous
  </button>

  <span>
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage(page + 1)}
  >
    Next
  </button>

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
    <StudentAttendanceModal
      student={selectedStudent}
      onClose={() => {
        setShowModal(false);
        setSelectedStudent(null);
      }}
    />
  )
}
    </div>
  );
}