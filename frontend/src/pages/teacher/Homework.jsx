import {

  useEffect,
  useMemo,
  useState

} from "react";

import axios from "axios";

const Homework =
  () => {

    // ======================================================
    // STATES
    // ======================================================

    const [

      loading,

      setLoading

    ] = useState(false);

    const [

      homeworks,

      setHomeworks

    ] = useState([]);

    const [

      subjects,

      setSubjects

    ] = useState([]);

    const [

      classes,

      setClasses

    ] = useState([]);

    const [

      students,

      setStudents

    ] = useState([]);

    const [

      assignmentMode,

      setAssignmentMode

    ] = useState("class");

    const [

      studentSearch,

      setStudentSearch

    ] = useState("");

    const [

      selectedStudents,

      setSelectedStudents

    ] = useState([]);

    const [

      stats,

      setStats

    ] = useState({

      totalHomework: 0,

      totalStudents: 0,

      totalViewed: 0,

      totalAcknowledged: 0,

      totalSubmitted: 0
    });

    // ======================================================
    // FORM
    // ======================================================

    const [

      form,

      setForm

    ] = useState({

      title: "",

      description: "",

      instructions: "",

      subjectId: "",

      targetType: "section",

      sectionIds: [],

      studentIds: [],

      dueDate: "",

      priority: "medium",

      totalMarks: 100,

      allowLateSubmission: true,

      notifyParents: true,

      notifyStudents: true
    });

    // ======================================================
    // TOKEN
    // ======================================================

    const token =
      localStorage.getItem(
        "token"
      );

    // ======================================================
    // HEADERS
    // ======================================================

    const headers = {

      Authorization:
        `Bearer ${token}`
    };

    // ======================================================
    // FETCH HOMEWORKS
    // ======================================================

    const fetchHomeworks =
      async () => {

        try {

          const res =
            await axios.get(

              "http://localhost:5000/api/homeworks/teacher",

              {

                headers
              }
            );

          const list =
            res.data.homeworks || [];

          setHomeworks(list);

          

          // ======================================================
          // DASHBOARD STATS
          // ======================================================

          let viewed = 0;

          let acknowledged = 0;

          let submitted = 0;

          list.forEach(

            (hw) => {

              viewed +=
                hw.viewedCount || 0;

              acknowledged +=
                hw.acknowledgedCount || 0;

              submitted +=
                hw.submittedCount || 0;
            }
          );

          setStats({

            totalHomework:
              list.length,

            totalStudents:
              list.reduce(

                (acc, hw) =>

                  acc +

                  (

                    hw.assignedStudentsCount ||
                    0
                  ),

                0
              ),

            totalViewed:
              viewed,

            totalAcknowledged:
              acknowledged,

            totalSubmitted:
              submitted
          });

        } catch (error) {

          console.log(error);
        }
      };

    // ======================================================
    // FETCH SUBJECTS
    // ======================================================

    const fetchSubjects =
      async () => {

        try {

          const res =
            await axios.get(

              "http://localhost:5000/api/subjects",

              {

                headers
              }
            );

          setSubjects(
            res.data.subjects || []
          );

        } catch (error) {

          console.log(error);
        }
      };

    // ======================================================
    // FETCH CLASSES
    // ======================================================

    const fetchClasses =
      async () => {

        try {

          const res =
            await axios.get(

              "http://localhost:5000/api/teachers/my-classes",

              {

                headers
              }
            );

          setClasses(
            res.data.classes || []
          );

        } catch (error) {

          console.log(error);
        }
      };

    // ======================================================
    // FETCH STUDENTS
    // ======================================================

    const fetchStudents =
      async () => {

        try {

          const res =
            await axios.get(

              "http://localhost:5000/api/students",

              {

                headers
              }
            );

          setStudents(
            res.data.students || []
          );

        } catch (error) {

          console.log(error);
        }
      };

    // ======================================================
    // LOAD
    // ======================================================

    useEffect(() => {

      fetchHomeworks();

      fetchSubjects();

      fetchClasses();

      fetchStudents();

    }, []);

    // ======================================================
    // HANDLE CHANGE
    // ======================================================

    const handleChange =
      (e) => {

        const {

          name,
          value

        } = e.target;

        setForm({

          ...form,

          [name]:
            value
        });
      };

    // ======================================================
    // HANDLE SECTION
    // ======================================================

    const handleSectionChange =
      (id) => {

        const exists =
          form.sectionIds.includes(
            id
          );

        if (exists) {

          setForm({

            ...form,

            sectionIds:

              form.sectionIds.filter(

                (item) =>
                  item !== id
              )
          });

        } else {

          setForm({

            ...form,

            sectionIds: [

              ...form.sectionIds,

              id
            ]
          });
        }
      };

    // ======================================================
    // HANDLE STUDENT SELECT
    // ======================================================

    const handleStudentSelect =
      (studentId) => {

        const exists =
          selectedStudents.includes(
            studentId
          );

        if (exists) {

          setSelectedStudents(

            selectedStudents.filter(

              (id) =>
                id !== studentId
            )
          );

        } else {

          setSelectedStudents([

            ...selectedStudents,

            studentId
          ]);
        }
      };

    // ======================================================
    // FILTERED STUDENTS
    // ======================================================

    const filteredStudents =
      useMemo(() => {

        return students.filter(

          (student) =>

            student.name
            ?.toLowerCase()

            .includes(

              studentSearch
              .toLowerCase()
            )
        );

      }, [

        students,

        studentSearch
      ]);

    // ======================================================
    // CREATE HOMEWORK
    // ======================================================

    const handleSubmit =
      async (e) => {

        e.preventDefault();

        try {

          setLoading(true);

          const payload = {

            ...form,

            targetType:
              assignmentMode,

            studentIds:
              selectedStudents
          };

          await axios.post(

            "http://localhost:5000/api/homeworks",

            payload,

            {

              headers
            }
          );

          alert(
            "Homework created successfully"
          );

          setForm({

            title: "",

            description: "",

            instructions: "",

            subjectId: "",

            targetType: "section",

            sectionIds: [],

            studentIds: [],

            dueDate: "",

            priority: "medium",

            totalMarks: 100,

            allowLateSubmission: true,

            notifyParents: true,

            notifyStudents: true
          });

          setSelectedStudents([]);

          fetchHomeworks();

        } catch (error) {

          console.log(error);

          alert(

            error.response?.data?.msg ||

            "Failed to create homework"
          );

        } finally {

          setLoading(false);
        }
      };

    // ======================================================
    // DELETE HOMEWORK
    // ======================================================

    const deleteHomework =
      async (id) => {

        try {

          const confirmDelete =
            window.confirm(

              "Delete homework?"
            );

          if (!confirmDelete)
            return;

          await axios.delete(

            `http://localhost:5000/api/homeworks/${id}`,

            {

              headers
            }
          );

          fetchHomeworks();

        } catch (error) {

          console.log(error);
        }
      };

    // ======================================================
    // PRIORITY COLOR
    // ======================================================

    const getPriorityColor =
      (priority) => {

        switch (priority) {

          case "urgent":

            return `
              bg-red-500/20
              text-red-400
              border-red-500/30
            `;

          case "high":

            return `
              bg-orange-500/20
              text-orange-400
              border-orange-500/30
            `;

          case "medium":

            return `
              bg-blue-500/20
              text-blue-400
              border-blue-500/30
            `;

          default:

            return `
              bg-green-500/20
              text-green-400
              border-green-500/30
            `;
        }
      };

    // ======================================================
    // UI
    // ======================================================

    return (

      <div
        className="
          min-h-screen
          bg-slate-950
          text-white
          p-6
        "
      >

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-6
            mb-10
          "
        >

          <div>

            <h1
              className="
                text-5xl
                font-black
              "
            >
              📚 Homework Management
            </h1>

            <p
              className="
                text-slate-400
                mt-3
                text-lg
              "
            >
              Enterprise homework tracking
              system for teachers
            </p>

          </div>

          {/* STATS */}

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-5
              gap-4
            "
          >

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-3xl
                p-5
              "
            >

              <p
                className="
                  text-slate-400
                  text-sm
                "
              >
                Homework
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                  mt-2
                "
              >
                {
                  stats.totalHomework
                }
              </h2>

            </div>

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-3xl
                p-5
              "
            >

              <p
                className="
                  text-slate-400
                  text-sm
                "
              >
                Assigned
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                  mt-2
                "
              >
                {
                  stats.totalStudents
                }
              </h2>

            </div>

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-3xl
                p-5
              "
            >

              <p
                className="
                  text-slate-400
                  text-sm
                "
              >
                Viewed
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                  mt-2
                  text-cyan-400
                "
              >
                {
                  stats.totalViewed
                }
              </h2>

            </div>

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-3xl
                p-5
              "
            >

              <p
                className="
                  text-slate-400
                  text-sm
                "
              >
                Acknowledged
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                  mt-2
                  text-yellow-400
                "
              >
                {
                  stats.totalAcknowledged
                }
              </h2>

            </div>

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-3xl
                p-5
              "
            >

              <p
                className="
                  text-slate-400
                  text-sm
                "
              >
                Submitted
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                  mt-2
                  text-green-400
                "
              >
                {
                  stats.totalSubmitted
                }
              </h2>

            </div>

          </div>

        </div>

        {/* ======================================================
            FORM
        ====================================================== */}

        <form

          onSubmit={
            handleSubmit
          }

          className="
            bg-slate-900
            border
            border-slate-800
            rounded-[35px]
            p-8
            mb-12
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          "
        >

          {/* TITLE */}

          <input

            type="text"

            name="title"

            value={form.title}

            onChange={
              handleChange
            }

            placeholder="Homework title"

            required

            className="
              bg-slate-950
              border
              border-slate-700
              rounded-2xl
              p-5
              outline-none
              text-lg
            "
          />

          {/* SUBJECT */}

          <select

            name="subjectId"

            value={form.subjectId}

            onChange={
              handleChange
            }

            required

            className="
              bg-slate-950
              border
              border-slate-700
              rounded-2xl
              p-5
              outline-none
            "
          >

            <option value="">
              Select Subject
            </option>

            {

              subjects.map(
                (subject) => (

                  <option

                    key={
                      subject._id
                    }

                    value={
                      subject._id
                    }
                  >

                    {
                      subject.name
                    }

                  </option>
                )
              )
            }

          </select>

          {/* DESCRIPTION */}

          <textarea

            name="description"

            value={form.description}

            onChange={
              handleChange
            }

            placeholder="Homework description"

            required

            rows={6}

            className="
              md:col-span-2
              bg-slate-950
              border
              border-slate-700
              rounded-2xl
              p-5
              outline-none
            "
          />

          {/* INSTRUCTIONS */}

          <textarea

            name="instructions"

            value={form.instructions}

            onChange={
              handleChange
            }

            placeholder="Special instructions..."

            rows={4}

            className="
              md:col-span-2
              bg-slate-950
              border
              border-slate-700
              rounded-2xl
              p-5
              outline-none
            "
          />

          {/* DATE */}

          <input

            type="date"

            name="dueDate"

            value={form.dueDate}

            onChange={
              handleChange
            }

            required

            className="
              bg-slate-950
              border
              border-slate-700
              rounded-2xl
              p-5
              outline-none
            "
          />

          {/* PRIORITY */}

          <select

            name="priority"

            value={form.priority}

            onChange={
              handleChange
            }

            className="
              bg-slate-950
              border
              border-slate-700
              rounded-2xl
              p-5
              outline-none
            "
          >

            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>

            <option value="urgent">
              Urgent
            </option>

          </select>

          {/* ======================================================
              ASSIGNMENT TYPE
          ====================================================== */}

          <div
            className="
              md:col-span-2
            "
          >

            <h2
              className="
                text-2xl
                font-black
                mb-5
              "
            >
              Assignment Type
            </h2>

            <div
              className="
                flex
                flex-wrap
                gap-4
              "
            >

              <button

                type="button"

                onClick={() =>

                  setAssignmentMode(
                    "class"
                  )
                }

                className={`
                  px-6
                  py-4
                  rounded-2xl
                  border
                  transition-all
                  font-bold

                  ${
                    assignmentMode ===
                    "class"

                      ? `
                        bg-gradient-to-r
                        from-blue-600
                        to-cyan-500
                        border-transparent
                      `

                      : `
                        bg-slate-950
                        border-slate-700
                      `
                  }
                `}
              >

                🏫 Assign By Class

              </button>

              <button

                type="button"

                onClick={() =>

                  setAssignmentMode(
                    "student"
                  )
                }

                className={`
                  px-6
                  py-4
                  rounded-2xl
                  border
                  transition-all
                  font-bold

                  ${
                    assignmentMode ===
                    "student"

                      ? `
                        bg-gradient-to-r
                        from-cyan-600
                        to-blue-600
                        border-transparent
                      `

                      : `
                        bg-slate-950
                        border-slate-700
                      `
                  }
                `}
              >

                👨‍🎓 Assign Specific Students

              </button>

            </div>

          </div>

          {/* ======================================================
              CLASS MODE
          ====================================================== */}

          {

            assignmentMode ===
            "class" && (

              <div
                className="
                  md:col-span-2
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-5
                  "
                >

                  <h2
                    className="
                      text-2xl
                      font-black
                    "
                  >
                    Select Classes
                  </h2>

                  <div
                    className="
                      px-4
                      py-2
                      rounded-2xl
                      bg-blue-500/10
                      text-blue-400
                      font-bold
                    "
                  >

                    {
                      form.sectionIds.length
                    }
                    {" "}
                    Selected

                  </div>

                </div>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-4
                  "
                >

                  {

                    classes.map(
                      (item) => (

                        <button

                          key={
                            item.classId
                          }

                          type="button"

                          onClick={() =>
                            handleSectionChange(
                              item.classId
                            )
                          }

                          className={`
                            px-5
                            py-3
                            rounded-2xl
                            border
                            transition-all
                            font-bold

                            ${
                              form.sectionIds.includes(
                                item.classId
                              )

                                ? `
                                  bg-gradient-to-r
                                  from-blue-600
                                  to-cyan-500
                                  border-transparent
                                `

                                : `
                                  bg-slate-950
                                  border-slate-700
                                `
                            }
                          `}
                        >

                          {
                            item.displayName
                          }

                        </button>
                      )
                    )
                  }

                </div>

              </div>
            )
          }

          {/* ======================================================
              STUDENT MODE
          ====================================================== */}

          {

            assignmentMode ===
            "student" && (

              <div
                className="
                  md:col-span-2
                "
              >

                <input

                  type="text"

                  value={
                    studentSearch
                  }

                  onChange={(e) =>

                    setStudentSearch(
                      e.target.value
                    )
                  }

                  placeholder="
                    Search student...
                  "

                  className="
                    w-full
                    bg-slate-950
                    border
                    border-slate-700
                    rounded-2xl
                    p-5
                    outline-none
                    mb-5
                  "
                />

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-4
                    max-h-[400px]
                    overflow-auto
                    pr-2
                  "
                >

                  {

                    filteredStudents.map(
                      (student) => (

                        <button

                          key={
                            student._id
                          }

                          type="button"

                          onClick={() =>

                            handleStudentSelect(
                              student._id
                            )
                          }

                          className={`
                            p-5
                            rounded-3xl
                            border
                            text-left
                            transition-all

                            ${
                              selectedStudents.includes(
                                student._id
                              )

                                ? `
                                  bg-gradient-to-r
                                  from-cyan-600
                                  to-blue-600
                                  border-transparent
                                `

                                : `
                                  bg-slate-950
                                  border-slate-700
                                `
                            }
                          `}
                        >

                          <h2
                            className="
                              text-xl
                              font-black
                            "
                          >

                            {
                              student.name
                            }

                          </h2>

                          <p
                            className="
                              text-slate-400
                              mt-2
                            "
                          >

                            {
                              student.className ||
                              "Student"
                            }

                          </p>

                        </button>
                      )
                    )
                  }

                </div>

              </div>
            )
          }

          {/* SUBMIT */}

          <button

            type="submit"

            disabled={loading}

            className="
              md:col-span-2
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              rounded-3xl
              p-5
              font-black
              text-xl
              hover:scale-[1.01]
              transition-all
            "
          >

            {

              loading

                ? "Creating Homework..."

                : "🚀 Create Homework"
            }

          </button>

        </form>

        {/* ======================================================
            HOMEWORK LIST
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-7
          "
        >

          {

            homeworks.map(
              (item) => (

                <div

                  key={
                    item._id
                  }

                  className="
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-[35px]
                    p-7
                  "
                >

                  {/* TOP */}

                  <div
                    className="
                      flex
                      justify-between
                      gap-4
                    "
                  >

                    <div>

                      <h2
                        className="
                          text-3xl
                          font-black
                        "
                      >
                        {
                          item.title
                        }
                      </h2>

                      <p
                        className="
                          text-slate-400
                          mt-3
                        "
                      >
                        {
                          item.description
                        }
                      </p>

                    </div>

                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                        items-end
                      "
                    >

                      <span
                        className={`
                          px-4
                          py-2
                          rounded-2xl
                          border
                          text-sm
                          font-bold
                          ${getPriorityColor(
                            item.priority
                          )}
                        `}
                      >

                        {
                          item.priority
                        }

                      </span>

                    </div>

                  </div>

                  {/* CLASSES */}

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-3
                      mt-6
                    "
                  >

                    {

                      item.sectionIds?.map(
                        (sec) => (

                          <span

                            key={
                              sec._id
                            }

                            className="
                              px-4
                              py-2
                              bg-slate-800
                              rounded-2xl
                              text-sm
                            "
                          >

                            {
                              sec.displayName
                            }

                          </span>
                        )
                      )
                    }

                  </div>

                  {/* ======================================================
                      PROGRESS TRACKER
                  ====================================================== */}
{/* ======================================================
    LIVE PROGRESS TRACKER
====================================================== */}

<div
  className="
    mt-8
    bg-slate-950
    rounded-3xl
    p-5
    border
    border-slate-800
  "
>

  {/* HEADER */}

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
        text-xl
        font-black
      "
    >
      Homework Progress
    </h2>

    <span
      className="
        text-cyan-400
        font-bold
      "
    >

      {
        item.assignedStudentsCount ||
item.assignedCount ||
item.assignedStudents?.length ||
0
      }

      {" "}
      Assigned

    </span>

  </div>

  {/* TIMELINE */}

  <div
    className="
      relative
      flex
      items-center
      justify-between
      gap-3
      overflow-x-auto
      pb-2
    "
  >

    {/* LINE */}

    <div
      className="
        absolute
        top-5
        left-0
        right-0
        h-[3px]
        bg-slate-800
      "
    />

    {/* ASSIGNED */}

    <div
      className="
        relative
        z-10
        flex
        flex-col
        items-center
        min-w-[90px]
      "
    >

      <div
        className="
          w-12
          h-12
          rounded-full
          bg-blue-600
          flex
          items-center
          justify-center
          font-black
        "
      >
        A
      </div>

      <p
        className="
          mt-3
          text-sm
          text-slate-400
        "
      >
        Assigned
      </p>

      <span
        className="
          mt-1
          font-black
          text-lg
        "
      >

     {
  item.assignedStudentsCount ||
  item.assignedCount ||
  item.assignedStudents?.length ||
  0
}

      </span>

    </div>

    {/* VIEWED */}

    <div
      className="
        relative
        z-10
        flex
        flex-col
        items-center
        min-w-[90px]
      "
    >

      <div
        className="
          w-12
          h-12
          rounded-full
          bg-cyan-600
          flex
          items-center
          justify-center
          font-black
        "
      >
        B
      </div>

      <p
        className="
          mt-3
          text-sm
          text-slate-400
        "
      >
        Viewed
      </p>

      <span
        className="
          mt-1
          font-black
          text-lg
          text-cyan-400
        "
      >

        {
         (item.viewedCount || item.totalViewed || 0)
        }

      </span>

    </div>

    {/* ACKNOWLEDGED */}

    <div
      className="
        relative
        z-10
        flex
        flex-col
        items-center
        min-w-[90px]
      "
    >

      <div
        className="
          w-12
          h-12
          rounded-full
          bg-yellow-500
          flex
          items-center
          justify-center
          font-black
        "
      >
        C
      </div>

      <p
        className="
          mt-3
          text-sm
          text-slate-400
        "
      >
        Acknowledged
      </p>

      <span
        className="
          mt-1
          font-black
          text-lg
          text-yellow-400
        "
      >

        {
          (item.acknowledgedCount || item.totalAcknowledged || 0)
        }

      </span>

    </div>

    {/* SUBMITTED */}

    <div
      className="
        relative
        z-10
        flex
        flex-col
        items-center
        min-w-[90px]
      "
    >

      <div
        className="
          w-12
          h-12
          rounded-full
          bg-green-600
          flex
          items-center
          justify-center
          font-black
        "
      >
        D
      </div>

      <p
        className="
          mt-3
          text-sm
          text-slate-400
        "
      >
        Submitted
      </p>

      <span
        className="
          mt-1
          font-black
          text-lg
          text-green-400
        "
      >

        {
          (item.submittedCount || item.totalSubmitted || 0)
        }

      </span>

    </div>

  </div>

</div>
                 
                  {/* ACTIONS */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mt-7
                    "
                  >

                    <div
                      className="
                        text-slate-400
                      "
                    >

                      Due:
                      {" "}

                      {

                        new Date(
                          item.dueDate
                        ).toLocaleDateString()
                      }

                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-4
                      "
                    >

                      <button

                        onClick={() =>

                          window.location.href =

                          `/teacher/homeworks/${item._id}`
                        }

                        className="
                          px-5
                          py-3
                          rounded-2xl
                          bg-gradient-to-r
                          from-blue-600
                          to-cyan-500
                          font-bold
                        "
                      >

                        Open

                      </button>

                      <button

                        onClick={() =>
                          deleteHomework(
                            item._id
                          )
                        }

                        className="
                          px-5
                          py-3
                          rounded-2xl
                          bg-red-500/10
                          border
                          border-red-500/20
                          text-red-400
                        "
                      >

                        Delete

                      </button>

                    </div>

                  </div>

                </div>
              )
            )
          }

        </div>

      </div>
    );
  };

export default Homework;