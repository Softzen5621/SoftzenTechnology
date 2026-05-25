import {
  useEffect,
  useState
} from "react";

import API
from "../../services/api";

export default function MyClasses() {

  // ======================================================
  // STATES
  // ======================================================

  const [classes, setClasses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // FETCH CLASSES
  // ======================================================

  useEffect(() => {

    fetchClasses();

  }, []);

  const fetchClasses =
    async () => {

      try {

        const res =
          await API.get(
            "/teachers/my-classes"
          );

        console.log(
          "MY CLASSES:",
          res.data
        );

        setClasses(
          res.data.classes || []
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to load classes ❌"
        );

      } finally {

        setLoading(false);
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
          text-3xl
          font-black
        "
      >
        Loading Classes...
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (

    <div
      className="
        space-y-8
      "
    >

      {/* HEADER */}

      <div>

        <h1
          className="
            text-4xl
            font-black
            text-white
          "
        >
          My Classes
        </h1>

        <p
          className="
            text-slate-400
            mt-2
          "
        >
          Assigned class management
        </p>

      </div>

      {/* EMPTY */}

      {
        classes.length === 0 && (

          <div
            className="
              p-10
              rounded-3xl
              bg-white/5
              border
              border-white/10
              text-center
              text-slate-400
            "
          >

            No assigned classes

          </div>
        )
      }

      {/* GRID */}

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >

        {
          classes.map(
            (item, index) => (

              <div

                key={
                  item.classId ||

                  item._id ||

                  index
                }

                className="
                  group
                  relative
                  overflow-hidden
                  p-8
                  rounded-3xl
                  bg-gradient-to-br
                  from-white/5
                  to-white/[0.03]
                  border
                  border-white/10
                  hover:border-cyan-500/40
                  hover:shadow-2xl
                  hover:shadow-cyan-500/10
                  transition-all
                  duration-300
                "
              >

                {/* GLOW */}

                <div
                  className="
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    duration-500
                    bg-gradient-to-br
                    from-cyan-500/5
                    to-blue-500/5
                  "
                />

                {/* TOP */}

                <div
                  className="
                    relative
                    flex
                    items-start
                    justify-between
                    gap-5
                  "
                >

                  <div>

                    <h2
                      className="
                        text-3xl
                        font-black
                        text-white
                      "
                    >
                      {
                        item.displayName
                      }
                    </h2>

                    <p
                      className="
                        text-slate-400
                        mt-2
                      "
                    >
                      Class:
                      {" "}
                      {
                        item.className
                      }
                    </p>

                  </div>

                  {
                    item.isClassTeacher && (

                      <span
                        className="
                          px-4
                          py-2
                          rounded-2xl
                          bg-emerald-500/20
                          border
                          border-emerald-500/20
                          text-emerald-400
                          text-sm
                          font-semibold
                          whitespace-nowrap
                        "
                      >
                        👑 Class Teacher
                      </span>
                    )
                  }

                </div>

                {/* STUDENTS */}

                <div
                  className="
                    relative
                    mt-8
                    p-6
                    rounded-3xl
                    bg-black/20
                    border
                    border-white/5
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

                      <h3
                        className="
                          text-5xl
                          font-black
                          text-white
                        "
                      >
                        {
                          item.totalStudents || 0
                        }
                      </h3>

                      <p
                        className="
                          text-slate-400
                          mt-2
                        "
                      >
                        Total Students
                      </p>

                    </div>

                    <div
                      className="
                        h-16
                        w-16
                        rounded-2xl
                        bg-cyan-500/10
                        flex
                        items-center
                        justify-center
                        text-3xl
                      "
                    >
                      👨‍🎓
                    </div>

                  </div>

                </div>

                {/* ACTIONS */}

                <div
                  className="
                    relative
                    mt-8
                    grid
                    grid-cols-1
                    sm:grid-cols-3
                    gap-3
                  "
                >

                  {/* ATTENDANCE */}

                  <button
                    className="
                      group/button
                      relative
                      overflow-hidden
                      px-4
                      py-4
                      rounded-2xl
                      bg-gradient-to-r
                      from-blue-600
                      to-blue-500
                      hover:scale-[1.03]
                      active:scale-[0.98]
                      transition-all
                      duration-200
                      font-semibold
                      shadow-lg
                      shadow-blue-500/20
                    "
                  >

                    <div
                      className="
                        absolute
                        inset-0
                        opacity-0
                        group-hover/button:opacity-100
                        transition-all
                        bg-white/10
                      "
                    />

                    <span
                      className="
                        relative
                      "
                    >
                      📋 Attendance
                    </span>

                  </button>

                  {/* HOMEWORK */}

                  <button

                    onClick={() =>

                      window.location.href =
                        "/teacher/homework"
                    }

                    className="
                      group/button
                      relative
                      overflow-hidden
                      px-4
                      py-4
                      rounded-2xl
                      bg-gradient-to-r
                      from-purple-600
                      to-fuchsia-500
                      hover:scale-[1.03]
                      active:scale-[0.98]
                      transition-all
                      duration-200
                      font-semibold
                      shadow-lg
                      shadow-purple-500/20
                    "
                  >

                    <div
                      className="
                        absolute
                        inset-0
                        opacity-0
                        group-hover/button:opacity-100
                        transition-all
                        bg-white/10
                      "
                    />

                    <span
                      className="
                        relative
                      "
                    >
                      📚 Homework
                    </span>

                  </button>

                  {/* MARKS */}

                  <button
                    className="
                      group/button
                      relative
                      overflow-hidden
                      px-4
                      py-4
                      rounded-2xl
                      bg-gradient-to-r
                      from-cyan-600
                      to-teal-500
                      hover:scale-[1.03]
                      active:scale-[0.98]
                      transition-all
                      duration-200
                      font-semibold
                      shadow-lg
                      shadow-cyan-500/20
                    "
                  >

                    <div
                      className="
                        absolute
                        inset-0
                        opacity-0
                        group-hover/button:opacity-100
                        transition-all
                        bg-white/10
                      "
                    />

                    <span
                      className="
                        relative
                      "
                    >
                      📝 Marks
                    </span>

                  </button>

                </div>

              </div>
            )
          )
        }

      </div>

    </div>
  );
}