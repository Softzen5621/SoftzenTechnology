import {
  useEffect,
  useState
} from "react";

import API
from "../../services/api";

import StudentAttendanceModal
from "../../components/StudentAttendanceModal";

// ======================================================
// TEACHER ATTENDANCE
// ======================================================

export default function TeacherAttendance() {

  // ======================================================
  // STATES
  // ======================================================

  const [students, setStudents] =
    useState([]);

    const [showStudentModal, setShowStudentModal] =
  useState(false);

  const [attendance, setAttendance] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [assignedClasses, setAssignedClasses] =
    useState([]);

  const [selectedClass, setSelectedClass] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [studentMonthlyData, setStudentMonthlyData] =
    useState(null);

const [isHoliday, setIsHoliday] =
  useState(false);

const [holidayData, setHolidayData] =
  useState(null);

  const [
    attendanceAlreadyMarked,
    setAttendanceAlreadyMarked
  ] = useState(false);

  const [
    lastUpdatedAt,
    setLastUpdatedAt
  ] = useState(null);

  const [
    attendanceDate,
    setAttendanceDate
  ] = useState(

    new Date()
      .toISOString()
      .split("T")[0]
  );

  // ======================================================
  // ATTENDANCE COUNTS
  // ======================================================

  const attendanceCounts = {

    total:
      students.length,

    present:

      Object.values(
        attendance
      ).filter(

        (item) =>

          item.status ===
          "Present"
      ).length,

    absent:

      Object.values(
        attendance
      ).filter(

        (item) =>

          item.status ===
          "Absent"
      ).length,

    late:

      Object.values(
        attendance
      ).filter(

        (item) =>

          item.status ===
          "Late"
      ).length,

    halfDay:

      Object.values(
        attendance
      ).filter(

        (item) =>

          item.status ===
          "Half Day"
      ).length
  };

  // ======================================================
  // FILTERED STUDENTS
  // ======================================================

  const filteredStudents =

    students.filter(
      (student) =>

        student.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        student.studentId
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  // ======================================================
  // FETCH INITIAL
  // ======================================================

  useEffect(() => {

    fetchTeacherDashboard();
    checkHoliday(
  attendanceDate
);

  }, []);

  // ======================================================
  // FETCH DASHBOARD
  // ======================================================

  const fetchTeacherDashboard =
    async () => {

      try {

        const res =
          await API.get(
            "/teachers/dashboard"
          );

        const classes =
          res.data.dashboard
            ?.assignedClasses || [];

        setAssignedClasses(
          classes
        );

        if (classes.length > 0) {

          setSelectedClass(
            classes[0]
          );

          await fetchStudents(
            classes[0]
          );

          await loadExistingAttendance(
            classes[0],
            attendanceDate
          );

          await checkExistingAttendance(
            classes[0],
            attendanceDate
          );
        }

      } catch (err) {

        console.log(err);
      }
    };

  // ======================================================
  // FETCH STUDENTS
  // ======================================================

  const fetchStudents =
    async (classItem) => {

      try {

        setLoading(true);

        const res =
          await API.get(

            `/students?classId=${classItem.classId}`
          );

        const fetchedStudents =
          res.data.students || [];

        setStudents(
          fetchedStudents
        );

        const defaultAttendance = {};

        fetchedStudents.forEach(
          (student) => {

            defaultAttendance[
              student._id
            ] = {

              status:
                "Present",

              absentReason:
                ""
            };
          }
        );

        setAttendance(
          defaultAttendance
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // LOAD EXISTING ATTENDANCE
  // ======================================================

  const loadExistingAttendance =
    async (
      classItem,
      selectedDate
    ) => {

      try {

        const res =
          await API.get(

            `/attendance/class?classId=${classItem.classId}&attendanceDate=${selectedDate}`
          );

        if (
          res.data.attendance &&
          res.data.attendance.length > 0
        ) {

          const existing = {};

          res.data.attendance.forEach(
            (item) => {

              existing[
                item.studentId._id
              ] = {

                status:
                  item.status,

                absentReason:
                  item.absentReason || ""
              };
            }
          );

          setAttendance(
            existing
          );

        } else {

          const defaultAttendance = {};

          students.forEach(
            (student) => {

              defaultAttendance[
                student._id
              ] = {

                status:
                  "Present",

                absentReason:
                  ""
              };
            }
          );

          setAttendance(
            defaultAttendance
          );
        }

      } catch (err) {

        console.log(err);
      }
    };

  

  // ======================================================
// CHECK HOLIDAY
// ======================================================

const checkHoliday =
  async (selectedDate) => {

    try {

      const res =
        await API.get(

          `/holidays/check?date=${selectedDate}`
        );

      setIsHoliday(

        res.data.isHoliday
      );

      setHolidayData(

        res.data.holiday
      );

    } catch (err) {

      console.log(err);
    }
  };

  // ======================================================
  // CHECK EXISTING
  // ======================================================

  const checkExistingAttendance =
    async (
      classItem,
      selectedDate
    ) => {

      try {

        const res =
          await API.get(

            `/attendance/check?classId=${classItem.classId}&attendanceDate=${selectedDate}`
          );

        setAttendanceAlreadyMarked(

          res.data.alreadyMarked
        );

        setLastUpdatedAt(

          res.data.lastUpdatedAt
        );

      } catch (err) {

        console.log(err);
      }
    };

  // ======================================================
  // HANDLE STATUS
  // ======================================================

  const handleStatusChange =
    (
      studentId,
      status
    ) => {

      setAttendance({

        ...attendance,

        [studentId]: {

          ...attendance[
            studentId
          ],

          status
        }
      });
    };

  // ======================================================
  // HANDLE REASON
  // ======================================================

  const handleReasonChange =
    (
      studentId,
      reason
    ) => {

      setAttendance({

        ...attendance,

        [studentId]: {

          ...attendance[
            studentId
          ],

          absentReason:
            reason
        }
      });
    };

  // ======================================================
  // SUBMIT ATTENDANCE
  // ======================================================

  const submitAttendance =
    async () => {

      try {

        setSaving(true);

        const attendanceRecords =

          students.map(
            (student) => ({

              studentId:
                student._id,

              status:

                attendance[
                  student._id
                ]?.status ||

                "Present",

              absentReason:

                attendance[
                  student._id
                ]?.absentReason ||

                ""
            })
          );

        await API.post(

          "/attendance/mark",

          {

            attendanceRecords,

            classId:
              selectedClass.classId,

            className:
              selectedClass.className,

            section:
              selectedClass.section,

            attendanceDate
          }
        );

        await loadExistingAttendance(
          selectedClass,
          attendanceDate
        );

        await checkExistingAttendance(
          selectedClass,
          attendanceDate
        );

        alert(
          "Attendance Saved ✅"
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to save attendance ❌"
        );

      } finally {

        setSaving(false);
      }
    };

  // ======================================================
  // STUDENT ANALYTICS
  // ======================================================

  const fetchStudentAnalytics =
  async (student) => {

    try {

      setSelectedStudent(
        student
      );

      setShowStudentModal(
        true
      );

      const today =
        new Date(
          attendanceDate
        );

      const month =
        today.getMonth() + 1;

      const year =
        today.getFullYear();

      const res =
        await API.get(

          `/attendance/monthly?studentId=${student._id}&month=${month}&year=${year}`
        );

      setStudentMonthlyData(
        res.data.summary
      );

    } catch (err) {

      console.log(err);
    }
  };
  // ======================================================
  // UI
  // ======================================================

  return (

    <div
      className="
        space-y-8
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
          xl:items-start
          xl:justify-between
          gap-6
        "
      >

        {/* LEFT */}

        <div>

          <h1
            className="
              text-4xl
              font-black
              text-white
            "
          >
            Attendance Management
          </h1>

          <p
            className="
              text-slate-400
              mt-2
            "
          >
            Mark class attendance
          </p>

        </div>

        {/* RIGHT PANEL */}

        <div
          className="
            flex
            flex-col
            items-end
gap-5
w-full
xl:w-auto
          "
        >

          {/* TOP */}

          <div
            className="
              flex
              items-center
              gap-3
              flex-wrap
              justify-end
            "
          >

            {/* DATE */}

            <input   type="date"
            style={{
  colorScheme: "dark"
}}
            
             

              value={attendanceDate}

              onChange={async (e) => {

                const newDate =
                  e.target.value;

                setAttendanceDate(
                  newDate
                );
                setAttendance({});
                await checkHoliday(
  newDate
);

                if (!selectedClass) return;

                await loadExistingAttendance(
                  selectedClass,
                  newDate
                );

                await checkExistingAttendance(
                  selectedClass,
                  newDate
                );
              }}

              className="
  px-5
  py-3
  rounded-2xl
  bg-[#0F172A]
  border
  border-cyan-500/20
  text-white
  outline-none
  shadow-lg
  hover:border-cyan-400
  focus:border-cyan-400
  transition-all
  cursor-pointer
"
            />

            {/* SAVE BUTTON */}

       {
  !isHoliday && (

<button
              onClick={
                submitAttendance
              }

              disabled={saving}

              className="
                px-10
py-3.5
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                text-white
                font-bold
                shadow-xl
                hover:scale-[1.02]
                transition-all
              "
            >

              {

                saving

                  ? "Saving..."

                  : attendanceAlreadyMarked

                  ? "🔄 Update Attendance"

                  : "✅ Save Attendance"
              }

            </button>)}

          </div>

          {/* STATUS */}

          <div
            className="
              flex
              flex-col
              items-end
              gap-2
            "
          >

            {

              attendanceAlreadyMarked && (

                <div
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-yellow-500/10
                    border
                    border-yellow-500/20
                    text-yellow-300
                    text-sm
                    font-semibold
                  "
                >
                  Attendance Already Marked
                </div>
              )
            }

            {

              lastUpdatedAt && (

                <div
                  className="
                    text-sm
text-slate-400
whitespace-nowrap
                  "
                >

                  Last Saved:

                  {

                    new Date(
                      lastUpdatedAt
                    ).toLocaleString()
                  }

                </div>
              )
            }

          </div>

        </div>

      </div>

{/* HOLIDAY BANNER */}

{
  isHoliday && (

    <div
      className="
        bg-yellow-500/10
        border
        border-yellow-500/20
        rounded-3xl
        p-6
        flex
        items-center
        justify-between
      "
    >

      <div>

        <h2
          className="
            text-2xl
            font-black
            text-yellow-300
          "
        >
          🎉 Holiday
        </h2>

        <p
          className="
            text-yellow-100
            mt-2
          "
        >
          {
            holidayData?.title
          }
        </p>

      </div>

      <div
        className="
          text-right
        "
      >

        <p
          className="
            text-sm
            text-yellow-200
          "
        >
          {
            holidayData?.holidayType
          }
        </p>

      </div>

    </div>
  )
}
      {/* ======================================================
          SEARCH
      ====================================================== */}

      <input
        type="text"

        placeholder="
          Search student...
        "

        value={search}

        onChange={(e) =>

          setSearch(
            e.target.value
          )
        }

        className="
          w-full
          md:w-[350px]
          px-5
          py-4
          rounded-2xl
          bg-white/5
          border
          border-white/10
          text-white
          outline-none
        "
      />

      
      {/* ======================================================
          CLASS BUTTONS
      ====================================================== */}

      <div
        className="
          flex
          flex-wrap
          gap-4
        "
      >

        {

          assignedClasses.map(
            (classItem) => (

              <button
                key={classItem.classId}

               onClick={async () => {

  setSelectedClass(
    classItem
  );

  await fetchStudents(
    classItem
  );

  await loadExistingAttendance(
    classItem,
    attendanceDate
  );

  await checkExistingAttendance(
    classItem,
    attendanceDate
  );
}}

                className={

                  `
                    px-6
                    py-4
                    rounded-2xl
                    border
                    transition-all

                    ${
                      selectedClass?.classId === classItem.classId

                        ? `
                          bg-gradient-to-r
                          from-blue-600
                          to-cyan-500
                          border-transparent
                        `

                        : `
                          bg-white/5
                          border-white/10
                        `
                    }
                  `
                }
              >

                {
                  classItem.displayName
                }

              </button>
            )
          )
        }

      </div>
{/* SUMMARY */}

{
  students.length > 0 && (

    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-5
        gap-4
      "
    >

      <SummaryCard
        title="Total"
        value={
          attendanceCounts?.total || 0
        }
        color="white"
      />

      <SummaryCard
        title="Present"
        value={
          attendanceCounts?.present || 0
        }
        color="green"
      />

      <SummaryCard
        title="Absent"
        value={
          attendanceCounts?.absent || 0
        }
        color="red"
      />

      <SummaryCard
        title="Late"
        value={
          attendanceCounts?.late || 0
        }
        color="yellow"
      />

      <SummaryCard
        title="Half Day"
        value={
          attendanceCounts?.halfDay || 0
        }
        color="purple"
      />

    </div>
  )
}

      {/* ======================================================
          QUICK ACTIONS
      ====================================================== */}
{
  !isHoliday && (
      <div
        className="
          flex
          flex-wrap
          gap-4
        "
      >

        <button

          onClick={() => {

            const updated = {};

            students.forEach(
              (student) => {

                updated[
                  student._id
                ] = {

                  status:
                    "Present",

                  absentReason:
                    ""
                };
              }
            );

            setAttendance(
              updated
            );
          }}

          className="
            px-6
            py-3
            rounded-2xl
            bg-green-600
            hover:bg-green-700
            transition
            font-semibold
          "
        >

          ✅ Mark All Present

        </button>

        <button

          onClick={() => {

            const updated = {};

            students.forEach(
              (student) => {

                updated[
                  student._id
                ] = {

                  status:
                    "Absent",

                  absentReason:
                    ""
                };
              }
            );

            setAttendance(
              updated
            );
          }}

          className="
            px-6
            py-3
            rounded-2xl
            bg-red-600
            hover:bg-red-700
            transition
            font-semibold
          "
        >

          ❌ Mark All Absent

        </button>

      </div>)}

      {/* ======================================================
          TABLE
      ====================================================== */}
{
  !isHoliday && ( 
  <div
        className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          overflow-hidden
        "
      >

        {

          loading && (

            <div
              className="
                p-10
                text-center
                text-white
              "
            >
              Loading Students...
            </div>
          )
        }

        {

          !loading &&
          filteredStudents.length === 0 && (

            <div
              className="
                p-10
                text-center
                text-slate-400
              "
            >
              No students found
            </div>
          )
        }

        {

          !loading &&
          filteredStudents.length > 0 && (

            <table
              className="
                w-full
              "
            >

              <thead
                className="
                  bg-black/20
                "
              >

                <tr>

                  <th
                    className="
                      text-left
                      p-5
                    "
                  >
                    Student
                  </th>

                  <th
                    className="
                      text-left
                      p-5
                    "
                  >
                    Status
                  </th>

                 <th
  className="
    text-left
    p-5
    w-[35%]
  "
>
  Reason
</th>

                </tr>

              </thead>

              <tbody>

                {

                  filteredStudents.map(
                    (student) => (

                      <tr
                        key={student._id}

                        className="
                          border-t
                          border-white/10
                        "
                      >

                        {/* STUDENT */}

                        <td
                          className="
                            p-5
                          "
                        >

                          <div

                            onClick={() =>

                              fetchStudentAnalytics(
                                student
                              )
                            }

                            className="
                              flex
                              flex-col
                              gap-1
                              cursor-pointer
                              hover:bg-white/5
                              rounded-xl
                              p-2
                              transition
                            "
                          >

                            <span
                              className="
                                text-cyan-400
                                text-sm
                                font-semibold
                              "
                            >
                              {
                                student.studentId
                              }
                            </span>

                            <h3
                              className="
                                font-bold
                                text-white
                                text-base
                              "
                            >
                              {
                                student.name
                              }
                            </h3>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td
                          className="
                            p-5
                          "
                        >

                          <div
                            className="
                              flex
                              gap-3
                              flex-wrap
                            "
                          >

                            {

                              [
                                {
                                  label: "Present",
                                  value: "Present"
                                },

                                {
                                  label: "Absent",
                                  value: "Absent"
                                },

                                {
                                  label: "Late",
                                  value: "Late"
                                },

                                {
                                  label: "Half Day",
                                  value: "Half Day"
                                }
                              ].map(
                                (status) => (

                                  <button
                                    key={status.label}

                                    onClick={() =>

                                      handleStatusChange(

                                        student._id,

                                        status.value
                                      )
                                    }

                                    className={

                                      `
                                        px-4
                                        py-2
                                        rounded-xl
                                        text-sm
                                        border
                                        transition

                                        ${
                                          attendance[
                                            student._id
                                          ]?.status ===
                                          status.value

                                            ? status.value === "Present"

                                              ? "bg-green-600 border-green-600"

                                              : status.value === "Absent"

                                              ? "bg-red-600 border-red-600"

                                              : status.value === "Late"

                                              ? "bg-yellow-500 border-yellow-500 text-black"

                                              : "bg-purple-600 border-purple-600"

                                            : `
                                              bg-white/5
                                              border-white/10
                                            `
                                        }
                                      `
                                    }
                                  >

                                    {
                                      status.label
                                    }

                                  </button>
                                )
                              )
                            }

                          </div>

                        </td>
                        {/* REASON */}

                        <td
                          className="
                            p-5
                          "
                        >

                          {

                            (
                              attendance[
                                student._id
                              ]?.status === "Absent" ||

                              attendance[
                                student._id
                              ]?.status === "Half Day"
                            ) && (

                              <input
                                type="text"

                                placeholder="Reason"

                                value={
                                  attendance[
                                    student._id
                                  ]?.absentReason || ""
                                }

                                onChange={(e) =>

                                  handleReasonChange(

                                    student._id,

                                    e.target.value
                                  )
                                }

                                className="
                                  w-full
                                  px-4
                                  py-3
                                  rounded-2xl
                                  bg-white/5
                                  border
                                  border-red-500/20
                                  text-white
                                  outline-none
                                "
                              />
                            )
                          }

                        </td>

                      </tr>
                    )
                  )
                }

              </tbody>

            </table>
          )
        }

      </div>
      )}

      {
        showStudentModal && (

          <StudentAttendanceModal

  student={
    selectedStudent
  }

  summary={
    studentMonthlyData
  }

  onClose={() => {

    setShowStudentModal(
      false
    );

    setSelectedStudent(
      null
    );
  }}
/>
        )
      }

    </div>
  );
}

// ======================================================
// SUMMARY CARD
// ======================================================

function SummaryCard({

  title = "",

  value = 0,

  color = "white"

}) {

  const colorClasses = {

    white:
      "bg-white/5 border-white/10 text-white",

    green:
      "bg-green-500/10 border-green-500/20 text-green-400",

    red:
      "bg-red-500/10 border-red-500/20 text-red-400",

    yellow:
      "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",

    purple:
      "bg-purple-500/10 border-purple-500/20 text-purple-400"
  };

  return (

    <div
      className={`
        border
        rounded-2xl
        p-5
        ${colorClasses[color] || colorClasses.white}
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