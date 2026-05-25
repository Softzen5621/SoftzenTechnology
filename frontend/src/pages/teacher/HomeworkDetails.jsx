import {

  useEffect,
  useMemo,
  useState

} from "react";

import {

  useParams

} from "react-router-dom";

import axios from "axios";

const HomeworkDetails =
  () => {

    // ======================================================
    // PARAMS
    // ======================================================

    const {

      id

    } = useParams();

    // ======================================================
    // STATES
    // ======================================================

    const [

      loading,

      setLoading

    ] = useState(true);

    const [

      homework,

      setHomework

    ] = useState(null);

    const [

      submissions,

      setSubmissions

    ] = useState([]);

    const [

  submittedUsers,

  setSubmittedUsers

] = useState([]);

    const [

      questions,

      setQuestions

    ] = useState([]);

    const [

      faqOnly,

      setFaqOnly

    ] = useState(false);

    const [

      viewedUsers,

      setViewedUsers

    ] = useState([]);

    const [

      acknowledgedUsers,

      setAcknowledgedUsers

    ] = useState([]);

    const [

      assignedUsers,

      setAssignedUsers

    ] = useState([]);

    // ======================================================
// SEARCH
// ======================================================

const [

  search,

  setSearch

] = useState("");

    // ======================================================
    // TOKEN
    // ======================================================

    const token =
      localStorage.getItem(
        "token"
      );

    const headers = {

      Authorization:
        `Bearer ${token}`
    };

    // ======================================================
    // FETCH HOMEWORK
    // ======================================================

    const fetchHomework =
      async () => {

        try {

          setLoading(true);

          const res =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/homeworks/${id}`,

              {

                headers
              }
            );

          const data =
            res.data.homework;

          setHomework(data);

         setAssignedUsers(
  data.assignedStudents || []
);
         setViewedUsers(
  data.viewedBy || []
);

setAcknowledgedUsers(
  data.acknowledgedBy || []
);

setSubmittedUsers(
  data.submittedBy || []
);
        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      };

    // ======================================================
    // FETCH SUBMISSIONS
    // ======================================================

    const fetchSubmissions =
      async () => {

        try {

          const res =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/homeworks/${id}/submissions`,

              {

                headers
              }
            );

          setSubmissions(

            res.data.submissions || []
          );

        } catch (error) {

          console.log(error);
        }
      };

    // ======================================================
    // FETCH QUESTIONS
    // ======================================================

    const fetchQuestions =
      async () => {

        try {

          const res =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/homeworks/${id}/questions`,

              {

                headers
              }
            );

          setQuestions(

            res.data.questions || []
          );

        } catch (error) {

          console.log(error);
        }
      };

    // ======================================================
    // LOAD
    // ======================================================

    useEffect(() => {

      fetchHomework();

      fetchSubmissions();

      fetchQuestions();

    }, [id]);

    // ======================================================
    // ANSWER QUESTION
    // ======================================================

    const answerQuestion =
      async (

        questionId,

        answer,

        isPublic

      ) => {

        try {

          await axios.put(

            `${import.meta.env.VITE_API_URL}/homeworks/questions/${questionId}`,

            {

              answer,

              isPublic
            },

            {

              headers
            }
          );

          fetchQuestions();

        } catch (error) {

          console.log(error);
        }
      };

    // ======================================================
    // COUNTS
    // ======================================================

    const assignedCount =
      assignedUsers.length;

    const viewedCount =
      viewedUsers.length;

    const acknowledgedCount =
      acknowledgedUsers.length;
const submittedCount =
  submittedUsers.length;

      // ======================================================
// NOT VIEWED USERS
// ======================================================

const notViewedUsers =

  assignedUsers.filter(

    (student) => {

      return !viewedUsers.some(

        (viewed) =>

          String(

  viewed.studentId?._id ||

  viewed.studentId ||

  viewed._id
) ===

          String(
            student._id
          )
      );
    }
  );

// ======================================================
// FILTER USERS
// ======================================================

const filterUsers =
  (users = []) => {

    return users.filter(

      (user) => {

        const name = (

          user.name ||

          user.fullName ||

          ""
        ).toLowerCase();

        const studentId = (

          user.studentId ||

          user.admissionNumber ||

          user.rollNumber ||

          ""
        ).toString().toLowerCase();

        return (

          name.includes(
            search.toLowerCase()
          )

          ||

          studentId.includes(
            search.toLowerCase()
          )
        );
      }
    );
  };
    // ======================================================
    // PERCENTAGES
    // ======================================================

    const viewedPercentage =
      assignedCount > 0

        ? Math.round(

            (

              viewedCount /

              assignedCount

            ) * 100
          )

        : 0;

    const acknowledgePercentage =
      assignedCount > 0

        ? Math.round(

            (

              acknowledgedCount /

              assignedCount

            ) * 100
          )

        : 0;

    const submittedPercentage =
      assignedCount > 0

        ? Math.round(

            (

              submittedCount /

              assignedCount

            ) * 100
          )

        : 0;

  // ======================================================
// SAVE REVIEW
// ======================================================

const saveReview =
  async (

    homeworkId,

    studentId,

    grade,

    remark

  ) => {

    try {

await axios.put(

  `${import.meta.env.VITE_API_URL}/homeworks/review-submission`,

  {

    homeworkId,

    studentId,

    grade,

    remark
  },

  {

    headers: {

      Authorization:

        `Bearer ${localStorage.getItem("token")}`
    }
  }
);
      alert(
        "Review saved successfully"
      );

      fetchHomework();

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.msg ||

        "Failed to save review"
      );
    }
  };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

      return (

        <div
          className="
            min-h-screen
            bg-slate-950
            flex
            items-center
            justify-center
            text-white
            text-3xl
            font-black
          "
        >
          Loading Homework...
        </div>
      );
    }

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
            bg-slate-900
            border
            border-slate-800
            rounded-[35px]
            p-7
            mb-8
          "
        >

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
                  text-5xl
                  font-black
                "
              >
                {
                  homework?.title
                }
              </h1>

              <p
                className="
                  text-slate-400
                  mt-4
                  text-lg
                "
              >
                {
                  homework?.description
                }
              </p>

            </div>

            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >

              <div
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-blue-600/20
                  border
                  border-blue-500/30
                "
              >

                {
                  homework?.priority
                }

              </div>

              <div
                className="
                  px-5
                  py-3
                  rounded-2xl
                  bg-emerald-600/20
                  border
                  border-emerald-500/30
                "
              >

                Due:
                {" "}

                {

                  new Date(

                    homework?.dueDate
                  ).toLocaleDateString()
                }

              </div>

            </div>

          </div>

        </div>

        {/* ======================================================
    SEARCH
====================================================== */}

<div
  className="
    mb-8
  "
>

  <input

    type="text"

    value={search}

    onChange={(e) =>

      setSearch(
        e.target.value
      )
    }

    placeholder="
Search student by name or ID...
    "

    className="
      w-full
      bg-slate-900
      border
      border-slate-700
      rounded-3xl
      px-6
      py-5
      text-lg
      outline-none
      focus:border-cyan-500
    "
  />

</div>

        {/* ======================================================
            ENTERPRISE STATS
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-5
            mb-8
          "
        >

          <StatsCard
            title="Assigned"
            value={assignedCount}
            icon="📚"
            color="blue"
          />

          <StatsCard
            title="Viewed"
            value={viewedCount}
            icon="👀"
            color="cyan"
          />

          <StatsCard
            title="Acknowledged"
            value={acknowledgedCount}
            icon="✅"
            color="yellow"
          />

          <StatsCard
            title="Submitted"
            value={submittedCount}
            icon="📤"
            color="green"
          />

        </div>

        {/* ======================================================
            TIMELINE
        ====================================================== */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-[35px]
            p-7
            mb-8
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-8
            "
          >

            <h2
              className="
                text-3xl
                font-black
              "
            >
              Homework Progress Timeline
            </h2>

          </div>

          {/* LINE */}

          <div
            className="
              relative
              flex
              flex-col
              xl:flex-row
              xl:items-center
              xl:justify-between
              gap-10
            "
          >

            <ProgressStep

              step="A"

              title="Assigned"

              count={assignedCount}

              percentage={100}

              color="blue"
            />

            <ProgressStep

              step="B"

              title="Viewed"

              count={viewedCount}

              percentage={viewedPercentage}

              color="cyan"
            />

            <ProgressStep

              step="C"

              title="Acknowledged"

              count={acknowledgedCount}

              percentage={acknowledgePercentage}

              color="yellow"
            />

            <ProgressStep

              step="D"

              title="Submitted"

              count={submittedCount}

              percentage={submittedPercentage}

              color="green"
            />

          </div>

        </div>
{/* ======================================================
    TRACKING TABLES
====================================================== */}

<div
  className="
    grid
    grid-cols-1
    md:grid-cols-2
    2xl:grid-cols-4
    gap-6
    mb-8
  "
>

  {/* ASSIGNED */}

  <TrackingCard

    title="Assigned Students"

    icon="📚"

    users={assignedUsers}

    emptyText="No assigned students"
  />

  {/* VIEWED */}

  <TrackingCard

    title="Viewed Homework"

    icon="👀"

    users={viewedUsers}

    emptyText="Nobody viewed yet"
  />

  {/* ACKNOWLEDGED */}

  <TrackingCard

    title="Acknowledged"

    icon="✅"

    users={acknowledgedUsers}

    emptyText="No acknowledgement"
  />

  {/* NOT VIEWED */}

  <TrackingCard

    title="Not Viewed"

    icon="❌"

    users={notViewedUsers || []}

    emptyText="Everyone viewed"
  />

</div>

        {/* ======================================================
            SUBMISSIONS
        ====================================================== */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-[35px]
            p-7
            mb-8
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
                text-3xl
                font-black
              "
            >
              Student Submission Status
            </h2>

            <div
              className="
                px-4
                py-2
                rounded-2xl
                bg-green-500/10
                text-green-400
                font-bold
              "
            >

              {
                submittedCount
              }
              {" "}
              Submitted

            </div>

          </div>

          <div
            className="
              overflow-x-auto
            "
          >

            <table
              className="
                w-full
              "
            >

              <thead>

                <tr
                  className="
                    border-b
                    border-slate-800
                    text-left
                  "
                >

                  <th className="py-5">
                    Student
                  </th>

                  <th className="py-5">
                    Status
                  </th>

                  <th className="py-5">
                    Submitted At
                  </th>

                  <th className="py-5">
                    Marks
                  </th>

                </tr>

              </thead>

              <tbody>
{

  submittedUsers.length > 0

    ? submittedUsers.map(

        (item, index) => (

          <tr

            key={index}

            className="
              border-b
              border-slate-800
            "
          >

            {/* STUDENT */}

            <td
              className="
                py-5
              "
            >

              <div
                className="
                  font-bold
                "
              >

                {

                  item.studentId?.name ||

                  item.studentId?.fullName ||

                  "Student"
                }

              </div>

              <div
                className="
                  text-cyan-400
                  text-sm
                  mt-1
                "
              >

                ID:
                {" "}

                {

                  item.studentId?.rollNumber ||

                  item.studentId?.studentId ||

                  item.studentId?.admissionNumber ||

                  "N/A"
                }

              </div>

            </td>

            {/* STATUS */}

            <td
              className="
                py-5
              "
            >

              <span
                className="
                  px-4
                  py-2
                  rounded-2xl
                  bg-green-500/10
                  text-green-400
                  font-bold
                "
              >

                Submitted

              </span>

            </td>

            {/* DATE */}

            <td
              className="
                py-5
                text-slate-400
              "
            >

              {

                new Date(
                  item.submittedAt
                ).toLocaleString()
              }

            </td>

            {/* REVIEW */}

<td
  className="
    py-5
  "
>

  <div
    className="
      flex
      flex-col
      gap-3
      min-w-[220px]
    "
  >

    {/* MARKS */}

    <select

  value={
    item.gradeValue || ""
  }

  onChange={(e) => {

    const updated =
      [...submittedUsers];

    updated[index]
      .gradeValue =

        e.target.value;

    setSubmittedUsers(
      updated
    );
  }}

  className="
    bg-slate-900
    border
    border-slate-700
    rounded-2xl
    px-4
    py-3
    outline-none
  "
>

  <option value="">
    Select Grade
  </option>

  <option>
    Excellent
  </option>

  <option>
    Very Good
  </option>

  <option>
    Good
  </option>

  <option>
    Average
  </option>

  <option>
    Needs Improvement
  </option>

</select>
    {/* REMARK */}
<textarea

  rows={3}

  value={
    item.remarkValue || ""
  }

  onChange={(e) => {

    const updated =
      [...submittedUsers];

    updated[index]
      .remarkValue =

        e.target.value;

    setSubmittedUsers(
      updated
    );
  }}

  placeholder="
Teacher Remark...
  "

  className="
    bg-slate-900
    border
    border-slate-700
    rounded-2xl
    px-4
    py-3
    outline-none
    resize-none
  "
/>
    

    {/* SAVE */}
   

   <button

  onClick={() =>

   saveReview(

  homework._id,

  item.studentId?._id,

  item.gradeValue,

  item.remarkValue
)
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

  Save Review

</button>
  </div>

</td>

          </tr>
        )
      )

    : (

      <tr>

        <td
          colSpan="4"
          className="
            py-10
            text-center
            text-slate-500
          "
        >

          No submissions yet

        </td>

      </tr>
    )
}

              </tbody>

            </table>

          </div>

        </div>

        {/* ======================================================
            QUESTIONS
        ====================================================== */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-[35px]
            p-7
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-5
              mb-7
            "
          >

            <h2
              className="
                text-3xl
                font-black
              "
            >
              Parent Questions & FAQ
            </h2>

            <button

              onClick={() =>

                setFaqOnly(
                  !faqOnly
                )
              }

              className="
                px-5
                py-3
                rounded-2xl
                bg-slate-800
                border
                border-slate-700
                font-semibold
              "
            >

              {

                faqOnly

                  ? "Show All"

                  : "Show FAQ Only"
              }

            </button>

          </div>

          <div
            className="
              space-y-6
            "
          >

            {

              questions

                .filter(

                  (item) =>

                    faqOnly

                      ? item.isPublic

                      : true
                )

                .map(
                  (item) => (

                    <QuestionCard

                      key={
                        item._id
                      }

                      item={
                        item
                      }

                      onAnswer={
                        answerQuestion
                      }
                    />
                  )
                )
            }

          </div>

        </div>

      </div>
    );
  };

// ======================================================
// STATS CARD
// ======================================================

const StatsCard =
  ({

    title,

    value,

    icon,

    color

  }) => {

    return (

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-[30px]
          p-6
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div>

            <p
              className="
                text-slate-400
              "
            >
              {title}
            </p>

            <h1
              className="
                text-5xl
                font-black
                mt-3
              "
            >
              {value}
            </h1>

          </div>

          <div
            className="
              text-5xl
            "
          >
            {icon}
          </div>

        </div>

      </div>
    );
  };

// ======================================================
// PROGRESS STEP
// ======================================================

const ProgressStep =
  ({

    step,

    title,

    count,

    percentage,

    color

  }) => {

    return (

      <div
        className="
          flex
          flex-col
          items-center
          text-center
        "
      >

        <div
          className={`
            w-20
            h-20
            rounded-full
            flex
            items-center
            justify-center
            text-3xl
            font-black

            ${
              color === "blue"

                ? "bg-blue-600"

                : color === "cyan"

                ? "bg-cyan-600"

                : color === "yellow"

                ? "bg-yellow-500"

                : "bg-green-600"
            }
          `}
        >

          {step}

        </div>

        <h2
          className="
            text-2xl
            font-black
            mt-5
          "
        >
          {title}
        </h2>

        <p
          className="
            text-slate-400
            mt-2
          "
        >
          {count} users
        </p>

        <div
          className="
            w-[180px]
            h-3
            bg-slate-800
            rounded-full
            mt-5
            overflow-hidden
          "
        >

          <div
            className={`
              h-full

              ${
                color === "blue"

                  ? "bg-blue-600"

                  : color === "cyan"

                  ? "bg-cyan-600"

                  : color === "yellow"

                  ? "bg-yellow-500"

                  : "bg-green-600"
              }
            `}

            style={{

              width:
                `${percentage}%`
            }}
          />

        </div>

        <p
          className="
            mt-3
            font-black
          "
        >
          {percentage}%
        </p>

      </div>
    );
  };

// ======================================================
// TRACKING CARD
// ======================================================

const TrackingCard =
  ({

    title,

    users,

    icon,

    emptyText

  }) => {

    return (

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-[35px]
          p-6
          min-h-[500px]
          flex
          flex-col
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
              text-2xl
              font-black
            "
          >

            {icon}
            {" "}
            {title}

          </h2>

          <div
            className="
              px-4
              py-2
              rounded-2xl
              bg-slate-800
            "
          >

            {users.length}

          </div>

        </div>

        {/* USERS */}

        <div
          className="
  flex-1
  overflow-y-auto
  pr-2
  space-y-4

  scrollbar-thin
  scrollbar-thumb-cyan-500
  scrollbar-track-slate-900
"

          style={{
            maxHeight: "420px",
            scrollBehavior: "smooth"
          }}
        >

          {

            users.length > 0

              ? users.map(
                  (user, index) => (

                    <div

                      key={index}

                      className="
                        bg-slate-950
                        border
                        border-slate-800
                        rounded-3xl
                        p-5
                      "
                    >

                      {/* NAME */}

                      <h2
                        className="
                          text-lg
                          font-black
                        "
                      >

 {
  typeof user.studentId === "object"

    ? (

        user.studentId?.name ||

        user.studentId?.fullName ||

        "Student"
      )

    : (

        user.name ||

        user.fullName ||

        "Student"
      )
}


 
                      </h2>

                      {/* STUDENT ID */}

                      <p
                        className="
                          text-cyan-400
                          mt-2
                          font-semibold
                        "
                      >

                        Student ID:
                        {" "}

                      {
  typeof user.studentId === "object"

    ? (

        user.studentId?.rollNumber ||

        user.studentId?.studentCode ||

        user.studentId?.admissionNumber ||

        user.studentId?.studentId ||

        "N/A"
      )

    : (

        user.rollNumber ||

        user.studentCode ||

        user.admissionNumber ||

        user.studentId ||

        "N/A"
      )
}

                      </p>

                      {/* VIEWED */}

                      {

                        user.viewedAt && (

                          <p
                            className="
                              text-slate-400
                              mt-2
                              text-sm
                            "
                          >

                            Viewed:
                            {" "}

                            {

                              new Date(
                                user.viewedAt
                              ).toLocaleString()
                            }

                          </p>
                        )
                      }

                      {/* ACK */}

                      {

                        user.acknowledgedAt && (

                          <p
                            className="
                              text-slate-400
                              mt-2
                              text-sm
                            "
                          >

                            Acknowledged:
                            {" "}

                            {

                              new Date(
                                user.acknowledgedAt
                              ).toLocaleString()
                            }

                          </p>
                        )
                      }

                    </div>
                  )
                )

              : (

                <div
                  className="
                    text-slate-500
                    pt-10
                  "
                >

                  {emptyText}

                </div>
              )
          }

        </div>

      </div>
    );
  };

// ======================================================
// QUESTION CARD
// ======================================================

const QuestionCard =
  ({

    item,

    onAnswer

  }) => {

    const [

      answer,

      setAnswer

    ] = useState(

      item.answer || ""
    );

    const [

      isPublic,

      setIsPublic

    ] = useState(

      item.isPublic || false
    );

    return (

      <div
        className="
          bg-slate-950
          border
          border-slate-800
          rounded-[35px]
          p-6
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            mb-5
          "
        >

          <span
            className="
              px-4
              py-2
              rounded-2xl
              bg-cyan-500/10
              text-cyan-400
            "
          >

            {
              item.publicQuestionId
            }

          </span>

          {

            item.isPublic && (

              <span
                className="
                  px-4
                  py-2
                  rounded-2xl
                  bg-green-500/10
                  text-green-400
                "
              >
                FAQ
              </span>
            )
          }

        </div>

        <h2
          className="
            text-2xl
            font-black
          "
        >
          {
            item.question
          }
        </h2>

        <textarea

          value={answer}

          onChange={(e) =>
            setAnswer(
              e.target.value
            )
          }

          rows={5}

          placeholder="
            Write answer...
          "

          className="
            w-full
            bg-slate-900
            border
            border-slate-700
            rounded-3xl
            p-5
            outline-none
            mt-5
            mb-5
          "
        />

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-5
          "
        >

          <label
            className="
              flex
              items-center
              gap-3
            "
          >

            <input

              type="checkbox"

              checked={
                isPublic
              }

              onChange={() =>

                setIsPublic(
                  !isPublic
                )
              }
            />

            Make FAQ visible to all parents

          </label>

          <button

            onClick={() =>

              onAnswer(

                item._id,

                answer,

                isPublic
              )
            }

            className="
              px-6
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              font-black
            "
          >

            Save Answer

          </button>

        </div>

      </div>
    );
  };

export default HomeworkDetails;