import {
  useEffect,
  useMemo,
  useState
} from "react";

import axios
from "axios";

// ======================================================
// COMPONENT
// ======================================================

const ParentHomework = () => {

  // ======================================================
  // STATES
  // ======================================================

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    homeworks,
    setHomeworks
  ] = useState([]);

  const [
    children,
    setChildren
  ] = useState([]);

  const [
    selectedChild,
    setSelectedChild
  ] = useState("");

  const [
    faqMap,
    setFaqMap
  ] = useState({});

  const [
    questionMap,
    setQuestionMap
  ] = useState({});

  const [
    faqLoading,
    setFaqLoading
  ] = useState({});

  const [
    acknowledgeLoading,
    setAcknowledgeLoading
  ] = useState({});

  const [
    viewedMap,
    setViewedMap
  ] = useState({});

  const [
    acknowledgedMap,
    setAcknowledgedMap
  ] = useState({});

  const [
  submittedMap,
  setSubmittedMap
] = useState({});

  // ======================================================
  // TOKEN
  // ======================================================

  const token =
    localStorage.getItem(
      "token"
    );

  // ======================================================
  // USER
  // ======================================================

  const user =
    JSON.parse(

      localStorage.getItem(
        "user"
      )
    ) || {};

  // ======================================================
  // AXIOS CONFIG
  // ======================================================

  const axiosConfig = {

    headers: {

      Authorization:
        `Bearer ${token}`
    }
  };

  // ======================================================
  // FETCH HOMEWORKS
  // ======================================================

  const fetchHomeworks =
    async () => {

      try {

        setLoading(true);

        const res =
          await axios.get(

            "http://localhost:5000/api/parent-homework/homeworks",

            axiosConfig
          );

        console.log(
          "HOMEWORK RESPONSE:",
          res.data
        );

        const homeworkData =
          res.data.homeworks || [];

        const childData =
          res.data.children || [];

        setHomeworks(
          homeworkData
        );

        setChildren(
          childData
        );

        // ======================================================
        // DEFAULT CHILD
        // ======================================================

        if (
          childData.length > 0
        ) {

          setSelectedChild(

            childData[0]._id
          );
        }

        // ======================================================
        // VIEWED + ACK MAP
        // ======================================================

        const viewedState = {};

        const acknowledgedState = {};
        const submittedState = {};

        homeworkData.forEach(
          (hw) => {

            // VIEWED

            const alreadyViewed =

              hw.viewedBy?.some(

                (v) =>

                  String(
                    v.parentId
                  ) ===

                  String(
                    user._id
                  )
              );

            if (
              alreadyViewed
            ) {

              viewedState[
                hw._id
              ] = true;
            }

            // ACKNOWLEDGED

            const alreadyAcknowledged =

              hw.acknowledgedBy?.some(

                (a) =>

                  String(
                    a.parentId
                  ) ===

                  String(
                    user._id
                  )
              );

            if (
              alreadyAcknowledged
            ) {

              acknowledgedState[
                hw._id
              ] = true;
            }
          // SUBMITTED

const alreadySubmitted =

  hw.submittedBy?.some(

    (s) =>

      String(
        s.parentId
      ) ===

      String(
        user._id
      )
  );

if (
  alreadySubmitted
) {

  submittedState[
    hw._id
  ] = true;
}

            


          }
        );

        

        setViewedMap(
          viewedState
        );

        setAcknowledgedMap(
          acknowledgedState
        );
        setSubmittedMap(
  submittedState
);

      } catch (error) {

        console.log(
          "FETCH HOMEWORK ERROR:"
        );

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

    

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {

    fetchHomeworks();

  }, []);

  // ======================================================
  // FILTER HOMEWORKS
  // ======================================================

  const filteredHomeworks =
    useMemo(() => {

      if (
        !selectedChild
      ) {

        return homeworks;
      }

      return homeworks.filter(

        (hw) => {

          if (
            !hw.studentIds ||
            hw.studentIds.length === 0
          ) {

            return true;
          }

          return hw.studentIds.some(

            (id) =>

              String(id) ===
              String(
                selectedChild
              )
          );
        }
      );

    }, [

      homeworks,

      selectedChild
    ]);

  // ======================================================
  // MARK VIEWED
  // ======================================================

  const markViewed =
    async (homeworkId) => {

      try {

        // ALREADY VIEWED

        if (
          viewedMap[
            homeworkId
          ]
        ) {

          return;
        }

        if (
          !selectedChild
        ) {

          return;
        }

        await axios.post(

          `http://localhost:5000/api/parent-homework/view/${homeworkId}`,

          {

            studentId:
              selectedChild
          },

          axiosConfig
        );

        setViewedMap(

          (prev) => ({

            ...prev,

            [homeworkId]:
              true
          })
        );

      } catch (error) {

        console.log(
          "VIEW TRACK ERROR:"
        );

        console.log(error);
      }
    };

  // ======================================================
  // AUTO TRACK VIEW
  // ======================================================

  useEffect(() => {

    if (
      filteredHomeworks.length > 0
    ) {

      filteredHomeworks.forEach(
        (hw) => {

          if (
            !viewedMap[
              hw._id
            ]
          ) {

            markViewed(
              hw._id
            );
          }
        }
      );
    }

  }, [

    filteredHomeworks,

    selectedChild
  ]);

  // ======================================================
  // ACKNOWLEDGE
  // ======================================================

  const acknowledgeHomework =
    async (homeworkId) => {

      try {

        if (
          !selectedChild
        ) {

          return alert(
            "Please select child"
          );
        }

        setAcknowledgeLoading(

          (prev) => ({

            ...prev,

            [homeworkId]:
              true
          })
        );

        await axios.post(

          `http://localhost:5000/api/parent-homework/acknowledge/${homeworkId}`,

          {

            studentId:
              selectedChild
          },

          axiosConfig
        );

        setAcknowledgedMap(

          (prev) => ({

            ...prev,

            [homeworkId]:
              true
          })
        );

        alert(
          "Homework acknowledged successfully"
        );

      } catch (error) {

        console.log(
          "ACKNOWLEDGE ERROR:"
        );

        console.log(error);

        alert(

          error.response?.data?.msg ||

          "Failed to acknowledge homework"
        );

      } finally {

        setAcknowledgeLoading(

          (prev) => ({

            ...prev,

            [homeworkId]:
              false
          })
        );
      }
    };

    // ======================================================
// SUBMIT HOMEWORK
// ======================================================

const submitHomework =
  async (homeworkId) => {

    try {

      if (
        !selectedChild
      ) {

        return alert(
          "Please select child"
        );
      }

      await axios.post(

        `http://localhost:5000/api/parent-homework/submit/${homeworkId}`,

        {

          studentId:
            selectedChild
        },

        axiosConfig
      );

      setSubmittedMap(

        (prev) => ({

          ...prev,

          [homeworkId]:
            true
        })
      );

      alert(
        "Homework submitted successfully"
      );

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.msg ||

        "Failed to submit homework"
      );
    }
  };

  // ======================================================
  // FETCH FAQ
  // ======================================================

  const fetchFAQ =
    async (homeworkId) => {

      try {

        setFaqLoading(

          (prev) => ({

            ...prev,

            [homeworkId]:
              true
          })
        );

        const res =
          await axios.get(

            `http://localhost:5000/api/parent-homework/faq/${homeworkId}`,

            axiosConfig
          );

        setFaqMap(

          (prev) => ({

            ...prev,

            [homeworkId]:

              res.data.questions || []
          })
        );

      } catch (error) {

        console.log(
          "FAQ ERROR:"
        );

        console.log(error);

      } finally {

        setFaqLoading(

          (prev) => ({

            ...prev,

            [homeworkId]:
              false
          })
        );
      }
    };

  // ======================================================
  // ASK QUESTION
  // ======================================================

  const askQuestion =
    async (homeworkId) => {

      try {

        const question =
          questionMap[
            homeworkId
          ];

        if (

          !question ||

          !question.trim()

        ) {

          return alert(
            "Please enter question"
          );
        }

        await axios.post(

          "http://localhost:5000/api/parent-homework/questions",

          {

            homeworkId,

            studentId:
              selectedChild,

            question
          },

          axiosConfig
        );

        alert(
          "Question sent successfully"
        );

        setQuestionMap(

          (prev) => ({

            ...prev,

            [homeworkId]:
              ""
          })
        );

      } catch (error) {

        console.log(error);

        alert(

          error.response?.data?.msg ||

          "Failed to send question"
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
          flex
          items-center
          justify-center
          text-white
        "
      >

        <div
          className="
            text-4xl
            font-black
            animate-pulse
          "
        >
          Loading Homework...
        </div>

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
        text-white
        overflow-x-hidden
      "
    >

      {/* HEADER */}

      <div className="mb-10">

        <h1
          className="
            text-5xl
            font-black
            flex
            items-center
            gap-4
          "
        >
          📚 Child Homework
        </h1>

        <p
          className="
            text-slate-400
            mt-3
            text-lg
          "
        >
          Track homework,
          teacher replies,
          acknowledgements
          and discussions
        </p>

      </div>

      {/* CHILD SELECT */}

      {

        children.length > 0 && (

          <div
            className="
              flex
              flex-wrap
              gap-4
              mb-10
            "
          >

            {

              children.map(
                (child) => (

                  <button

                    key={
                      child._id
                    }

                    onClick={() =>
                      setSelectedChild(
                        child._id
                      )
                    }

                    className={`
                      px-6
                      py-3
                      rounded-2xl
                      transition-all
                      duration-300
                      font-bold
                      shadow-lg

                      ${
                        selectedChild ===
                        child._id

                          ? `
                              bg-gradient-to-r
                              from-blue-600
                              to-cyan-500
                              shadow-cyan-500/20
                              scale-105
                            `

                          : `
                              bg-slate-900
                              border
                              border-slate-700
                              hover:border-cyan-500
                            `
                      }
                    `}
                  >

                    👦 {child.name}

                  </button>
                )
              )
            }

          </div>
        )
      }

      {/* EMPTY */}

      {

        filteredHomeworks.length === 0 && (

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-3xl
              p-16
              text-center
            "
          >

            <h2
              className="
                text-4xl
                font-black
              "
            >
              No Homework Found
            </h2>

            <p
              className="
                text-slate-400
                mt-4
                text-lg
              "
            >
              Teacher has not assigned
              homework yet
            </p>

          </div>
        )
      }

      {/* GRID */}

      <div
        className="
          grid
          grid-cols-1
          2xl:grid-cols-2
          gap-8
        "
      >

        {

          filteredHomeworks.map(
            (item) => (

              <div

                key={
                  item._id
                }

                className="
                  rounded-3xl
                  bg-gradient-to-b
                  from-slate-900
                  to-slate-950
                  border
                  border-slate-800
                  p-7
                "
              >

                {/* TITLE */}

                <div
                  className="
                    flex
                    justify-between
                    items-start
                    gap-5
                  "
                >

                  <div>

                    <h2
                      className="
                        text-4xl
                        font-black
                      "
                    >
                      {item.title}
                    </h2>

                    <p
                      className="
                        text-slate-400
                        mt-3
                      "
                    >
                      {item.description}
                    </p>

                  </div>

                  <div
                    className="
                      px-4
                      py-2
                      rounded-2xl
                      bg-cyan-500/10
                      text-cyan-400
                      font-bold
                    "
                  >
                    {item.priority}
                  </div>

                </div>

                {/* INFO */}

                <div
                  className="
                    flex
                    flex-wrap
                    gap-3
                    mt-6
                  "
                >

                  <div
                    className="
                      px-4
                      py-2
                      rounded-2xl
                      bg-slate-800
                      text-sm
                    "
                  >
                    📘 {item.subjectId?.name}
                  </div>

                  <div
                    className="
                      px-4
                      py-2
                      rounded-2xl
                      bg-slate-800
                      text-sm
                    "
                  >
                    👨‍🏫 {item.teacherId?.fullName}
                  </div>

                  <div
                    className="
                      px-4
                      py-2
                      rounded-2xl
                      bg-slate-800
                      text-sm
                    "
                  >
                    📅 {

                      new Date(
                        item.dueDate
                      ).toLocaleDateString()
                    }
                  </div>

                </div>


{/* STATUS */}

<div
  className="
    grid
    grid-cols-1
    md:grid-cols-3
    gap-4
    mt-6
  "
>

  {/* ASSIGNED */}

  <div
    className="
      rounded-3xl
      bg-cyan-500/10
      border
      border-cyan-500/20
      p-4
    "
  >

    <p
      className="
        text-xs
        text-slate-400
      "
    >
      Assigned By
    </p>

    <h3
      className="
        text-lg
        font-black
        mt-2
      "
    >
      👨‍🏫 {

        item.teacherId?.fullName ||

        "Teacher"
      }
    </h3>

  </div>

  {/* STATUS */}

  <div
    className="
      rounded-3xl
      bg-emerald-500/10
      border
      border-emerald-500/20
      p-4
    "
  >

    <p
      className="
        text-xs
        text-slate-400
      "
    >
      Homework Status
    </p>

    <h3
      className="
        text-lg
        font-black
        mt-2
      "
    >

      {

        submittedMap[
          item._id
        ]

          ? "✅ Submitted"

          : acknowledgedMap[
              item._id
            ]

          ? "📘 Acknowledged"

          : "⏳ Pending"
      }

    </h3>

  </div>

  {/* TEACHER REVIEW */}

{

  item.mySubmission?.grade && (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
        mt-5
      "
    >

      {/* GRADE */}

      <div
        className="
          rounded-3xl
          border
          border-green-500/20
          bg-green-500/10
          p-5
        "
      >

        <div
          className="
            text-sm
            text-slate-400
            mb-2
          "
        >

          Teacher Grade

        </div>

        <div
          className="
            text-2xl
            font-black
            text-green-400
          "
        >

          {

            item.mySubmission.grade
          }

        </div>

      </div>

      {/* REMARK */}

      <div
        className="
          rounded-3xl
          border
          border-cyan-500/20
          bg-cyan-500/10
          p-5
        "
      >

        <div
          className="
            text-sm
            text-slate-400
            mb-2
          "
        >

          Teacher Remark

        </div>

        <div
          className="
            font-semibold
            text-cyan-300
          "
        >

          {

            item.mySubmission.remark
          }

        </div>

      </div>

    </div>
  )
}

  {/* NOTES */}

  <div
    className="
      rounded-3xl
      bg-purple-500/10
      border
      border-purple-500/20
      p-4
    "
  >

    <p
      className="
        text-xs
        text-slate-400
      "
    >
      Teacher Notes
    </p>

    <h3
      className="
        text-sm
        mt-2
        text-slate-200
        leading-relaxed
      "
    >

      {

        item.instructions ||

        "No special notes"
      }

    </h3>

  </div>

</div>


                {/* ACTIONS */}

                <div
                  className="
                    flex
                    flex-wrap
                    gap-4
                    mt-8
                  "
                >

                  {/* FAQ */}

                  <button

                    onClick={() =>
                      fetchFAQ(
                        item._id
                      )
                    }

                    className="
                      px-6
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-purple-600
                      to-fuchsia-600
                      font-bold
                    "
                  >

                    {

                      faqLoading[
                        item._id
                      ]

                        ? "Loading..."

                        : "View FAQ"
                    }

                  </button>

{/* ACTION BUTTONS */}

<div
  className="
    flex
    flex-wrap
    gap-4
  "
>

  {/* ACKNOWLEDGE */}

  <button

    disabled={
      acknowledgeLoading[
        item._id
      ]
    }

    onClick={() =>
      acknowledgeHomework(
        item._id
      )
    }

    className="
      px-6
      py-3
      rounded-2xl
      bg-gradient-to-r
      from-green-600
      to-emerald-500
      font-bold
    "
  >

    {

      acknowledgeLoading[
        item._id
      ]

        ? "Please wait..."

        : acknowledgedMap[
            item._id
          ]

        ? "Acknowledged"

        : "Acknowledge"
    }

  </button>
</div>

  {/* SUBMIT */}

  <button

    onClick={() =>
      submitHomework(
        item._id
      )
    }

    disabled={
      submittedMap[
        item._id
      ]
    }

    className="
      px-6
      py-3
      rounded-2xl
      bg-gradient-to-r
      from-orange-500
      to-yellow-500
      font-bold
    "
  >

    {

      submittedMap[
        item._id
      ]

        ? "Submitted"

        : "Submit Homework"
    }

  </button>
 </div>

                {/* FAQ */}

                {

                  faqMap[
                    item._id
                  ]?.length > 0 && (

                    <div
                      className="
                        mt-7
                        space-y-4
                      "
                    >

                      {

                        faqMap[
                          item._id
                        ]?.map(
                          (q) => (

                            <div

                              key={
                                q._id
                              }

                              className="
                                p-5
                                rounded-3xl
                                bg-black/30
                                border
                                border-slate-800
                              "
                            >

                              <h3
                                className="
                                  text-lg
                                  font-bold
                                "
                              >
                                Q: {q.question}
                              </h3>

                              <p
                                className="
                                  mt-4
                                  text-slate-300
                                "
                              >
                                A: {q.answer}
                              </p>

                            </div>
                          )
                        )
                      }

                    </div>
                  )
                }

                {/* QUESTION */}

                <div className="mt-8">

                  <textarea

                    value={
                      questionMap[
                        item._id
                      ] || ""
                    }

                    onChange={(e) =>

                      setQuestionMap(

                        (prev) => ({

                          ...prev,

                          [item._id]:
                            e.target.value
                        })
                      )
                    }

                    rows={5}

                    placeholder="
Ask question to teacher...
                    "

                    className="
                      w-full
                      bg-black/30
                      border
                      border-slate-700
                      rounded-3xl
                      p-5
                      resize-none
                    "
                  />

                  <button

                    onClick={() =>
                      askQuestion(
                        item._id
                      )
                    }

                    className="
                      mt-5
                      px-6
                      py-4
                      rounded-3xl
                      bg-gradient-to-r
                      from-blue-600
                      to-cyan-500
                      w-full
                      text-lg
                      font-black
                    "
                  >

                    Send Question

                  </button>

                </div>

              </div>
            )
          )
        }

      </div>

    </div>
  );
};

export default ParentHomework;