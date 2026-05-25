import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import API from "../../services/api";

import {
  Users,
  GraduationCap,
  BookOpen,
  School,
  Phone,
  Mail,
  Search,
  ArrowLeft,
  Sparkles,
  BadgeCheck,
  UserCircle2,
  X,
  Trash2,
  Settings2,
  PlusCircle,
} from "lucide-react";


export default function SectionDetails() {

  const { id } = useParams();

  const navigate =
    useNavigate();


  // ======================================================
  // STATES
  // ======================================================

  const [section, setSection] =
    useState(null);

  const [students, setStudents] =
    useState([]);

  const [teachers, setTeachers] =
    useState([]);

  const [subjects, setSubjects] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [showTeacherModal, setShowTeacherModal] =
    useState(false);

  const [showSubjectModal, setShowSubjectModal] =
    useState(false);

  const [selectedTeacher, setSelectedTeacher] =
    useState("");

  const [selectedSubject, setSelectedSubject] =
    useState("");

  const [subjectTeacher, setSubjectTeacher] =
    useState("");

  const [weeklyLectures, setWeeklyLectures] =
    useState(0);


  // ======================================================
  // FETCH SECTION
  // ======================================================

  const fetchSection =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            `/sections/${id}`
          );


        setSection(
          res.data?.section || null
        );

        setStudents(

          Array.isArray(
            res.data?.students
          )

            ? res.data.students

            : []
        );

      } catch (err) {

        console.error(
          "FETCH SECTION ERROR:",
          err
        );

      } finally {

        setLoading(false);
      }
    };


  // ======================================================
  // FETCH DROPDOWN DATA
  // ======================================================

  const fetchDropdownData =
    async () => {

      try {

        const [
          teacherRes,
          subjectRes,
        ] = await Promise.all([

          API.get("/teachers"),

          API.get("/subjects"),
        ]);


        setTeachers(

  Array.isArray(
    teacherRes.data
  )

    ? teacherRes.data

    : Array.isArray(
        teacherRes.data?.teachers
      )

    ? teacherRes.data.teachers

    : []
);

       setSubjects(

  Array.isArray(
    subjectRes.data
  )

    ? subjectRes.data

    : Array.isArray(
        subjectRes.data?.subjects
      )

    ? subjectRes.data.subjects

    : []
);
      } catch (err) {

        console.error(
          "FETCH DROPDOWN ERROR:",
          err
        );
      }
    };


  // ======================================================
  // EFFECT
  // ======================================================

  useEffect(() => {

    if (id) {

      fetchSection();

      fetchDropdownData();
    }

  }, [id]);


  // ======================================================
  // FILTER STUDENTS
  // ======================================================

  const filteredStudents =

    Array.isArray(students)

      ? students.filter(
          (student) =>

            student?.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            student?.studentId
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
        )

      : [];


  // ======================================================
  // ASSIGN CLASS TEACHER
  // ======================================================

  const handleAssignTeacher =
    async () => {

      try {

        if (!selectedTeacher) {

          return alert(
            "Select teacher"
          );
        }


        await API.put(

          `/sections/${id}/assign-class-teacher`,

          {
            teacherId:
              selectedTeacher,
          }
        );


        alert(
          "Teacher assigned successfully"
        );

        setShowTeacherModal(false);

        setSelectedTeacher("");

        fetchSection();

      } catch (err) {

        console.error(err);

        alert(

          err.response?.data?.msg ||

          "Assignment failed"
        );
      }
    };


  // ======================================================
  // ASSIGN SUBJECT
  // ======================================================

  const handleAssignSubject =
    async () => {

      try {

        if (
          !selectedSubject ||
          !subjectTeacher
        ) {

          return alert(
            "Select subject & teacher"
          );
        }


        await API.put(

          `/sections/${id}/assign-subject`,

          {

            subjectId:
              selectedSubject,

            teacherId:
              subjectTeacher,

            weeklyLectures:
              Number(
                weeklyLectures
              ) || 0,
          }
        );


        alert(
          "Subject assigned successfully"
        );

        setShowSubjectModal(false);

        setSelectedSubject("");

        setSubjectTeacher("");

        setWeeklyLectures(0);

        fetchSection();

      } catch (err) {

        console.error(err);

        alert(

          err.response?.data?.msg ||

          "Assignment failed"
        );
      }
    };


  // ======================================================
  // REMOVE SUBJECT
  // ======================================================

  const handleRemoveSubject =
    async (subjectId) => {

      try {

        await API.put(

          `/sections/${id}/remove-subject`,

          {
            subjectId
          }
        );


        fetchSection();

      } catch (err) {

        console.error(
          "REMOVE SUBJECT ERROR:",
          err
        );
      }
    };


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-black">

        Loading...

      </div>
    );
  }


  // ======================================================
  // NOT FOUND
  // ======================================================

  if (!section) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-black text-red-500">

        Class Not Found

      </div>
    );
  }


  // ======================================================
  // COUNTS
  // ======================================================

  const totalStudents =
    students.length;

  const totalSubjects =

    Array.isArray(
      section.subjects
    )

      ? section.subjects.length

      : 0;

  const boys =
    students.filter(
      (s) =>
        s.gender === "Male"
    ).length;

  const girls =
    students.filter(
      (s) =>
        s.gender === "Female"
    ).length;


  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 p-6">


      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">


        <div>

          <button

            onClick={() =>
              navigate(-1)
            }

            className="flex items-center gap-2 text-slate-600 hover:text-black transition mb-5"
          >

            <ArrowLeft size={18} />

            Back

          </button>


          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold mb-5">

            <Sparkles size={16} />

            Academic Workspace

          </div>


          <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent tracking-tight">

            {
              section.displayName ||
              "Class"
            }

          </h1>


          <p className="text-slate-500 mt-3 text-lg">

            Enterprise SaaS ERP Dashboard

          </p>

        </div>


        {/* ACTIONS */}

        <div className="flex flex-wrap gap-4">

          <button

            onClick={() =>
              navigate(
                "/admin/students"
              )
            }

            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg"
          >

            Add Student

          </button>


          <button

            onClick={() =>
              setShowTeacherModal(true)
            }

            className="bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold shadow-sm"
          >

            Assign Teacher

          </button>


          <button

            onClick={() =>
              setShowSubjectModal(true)
            }

            className="bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold shadow-sm"
          >

            Assign Subject

          </button>

        </div>

      </div>


      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">


        <div className="bg-white rounded-3xl p-7 shadow-xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-semibold">

                Students

              </p>

              <h2 className="text-5xl font-black mt-3">

                {totalStudents}

              </h2>

            </div>

            <Users
              size={40}
              className="text-blue-600"
            />

          </div>

        </div>


        <div className="bg-white rounded-3xl p-7 shadow-xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-semibold">

                Subjects

              </p>

              <h2 className="text-5xl font-black mt-3">

                {totalSubjects}

              </h2>

            </div>

            <BookOpen
              size={40}
              className="text-indigo-600"
            />

          </div>

        </div>


        <div className="bg-white rounded-3xl p-7 shadow-xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-semibold">

                Boys

              </p>

              <h2 className="text-5xl font-black mt-3">

                {boys}

              </h2>

            </div>

            <GraduationCap
              size={40}
              className="text-emerald-600"
            />

          </div>

        </div>


        <div className="bg-white rounded-3xl p-7 shadow-xl">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-semibold">

                Girls

              </p>

              <h2 className="text-5xl font-black mt-3">

                {girls}

              </h2>

            </div>

            <UserCircle2
              size={40}
              className="text-pink-600"
            />

          </div>

        </div>

      </div>


      {/* MAIN */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">


        {/* LEFT */}

        <div className="xl:col-span-2 space-y-8">


          {/* SUBJECTS */}

          <div className="bg-white rounded-[32px] shadow-xl overflow-hidden">


            <div className="p-7 border-b flex items-center justify-between">

              <div className="flex items-center gap-3">

                <BookOpen size={26} />

                <h2 className="text-3xl font-black">

                  Subject Assignments

                </h2>

              </div>


              <button

                onClick={() =>
                  setShowSubjectModal(true)
                }

                className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2"
              >

                <PlusCircle size={18} />

                Assign Subject

              </button>

            </div>


            <div className="p-7 space-y-5">


              {
                totalSubjects === 0 ? (

                  <div className="text-center py-10 text-slate-500 font-semibold">

                    No subjects assigned

                  </div>

                ) : (

                  section.subjects.map(
                    (sub, index) => (

                      <div
                        key={index}
                        className="bg-slate-50 rounded-3xl p-6 flex items-center justify-between"
                      >

                        <div>

                          <h3 className="text-2xl font-black">

                            {
                              sub.subjectId
                                ?.name ||

                              "Unknown Subject"
                            }

                          </h3>

                          <p className="text-slate-500 mt-2">

                            Weekly Lectures:
                            {" "}
                            {
                              sub.weeklyLectures
                            }

                          </p>

                        </div>


                        <div className="text-right">

                          <p className="font-black">

                            {
                              sub.teacherId
                                ?.fullName ||

                              "No Teacher"
                            }

                          </p>


                          <button

                            onClick={() =>

                              handleRemoveSubject(

                                sub.subjectId?._id
                              )
                            }

                            className="mt-3 bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ml-auto"
                          >

                            <Trash2 size={14} />

                            Remove

                          </button>

                        </div>

                      </div>
                    )
                  )
                )
              }

            </div>

          </div>


          {/* STUDENTS */}

          <div className="bg-white rounded-[32px] shadow-xl overflow-hidden">


            <div className="p-7 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div className="flex items-center gap-3">

                <Users size={28} />

                <h2 className="text-3xl font-black">

                  Students

                </h2>

              </div>


              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-4 top-4 text-slate-400"
                />

                <input

                  type="text"

                  placeholder="Search student..."

                  value={search}

                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }

                  className="bg-slate-50 border rounded-2xl pl-11 pr-5 py-3 outline-none w-[280px]"
                />

              </div>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-5">
                      Student
                    </th>

                    <th className="text-left px-6 py-5">
                      Roll No
                    </th>

                    <th className="text-left px-6 py-5">
                      Gender
                    </th>

                    <th className="text-left px-6 py-5">
                      Mobile
                    </th>

                    <th className="text-left px-6 py-5">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {
                    filteredStudents.map(
                      (student) => (

                        <tr
                          key={student._id}
                          className="border-t hover:bg-slate-50"
                        >

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-4">

                              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black">

                                {
                                  student.name?.charAt(0)
                                }

                              </div>

                              <div>

                                <h4 className="font-black">

                                  {
                                    student.name
                                  }

                                </h4>

                                <p className="text-sm text-slate-500">

                                  {
                                    student.studentId
                                  }

                                </p>

                              </div>

                            </div>

                          </td>


                          <td className="px-6 py-5">

                            {
                              student.rollNumber ||
                              "-"
                            }

                          </td>


                          <td className="px-6 py-5">

                            {
                              student.gender
                            }

                          </td>


                          <td className="px-6 py-5">

                            {
                              student.mobile ||
                              "-"
                            }

                          </td>


                          <td className="px-6 py-5">

                            <button

                              onClick={() =>
                                navigate(
                                  `/admin/student/${student._id}`
                                )
                              }

                              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold"
                            >

                              Open

                            </button>

                          </td>

                        </tr>
                      )
                    )
                  }

                </tbody>

              </table>

            </div>

          </div>

        </div>


        {/* RIGHT */}

        <div className="space-y-8">


          {/* CLASS TEACHER */}

          <div className="bg-white rounded-[32px] shadow-xl overflow-hidden">


            <div className="p-7 border-b flex items-center justify-between">

              <div className="flex items-center gap-3">

                <School size={26} />

                <h2 className="text-3xl font-black">

                  Class Teacher

                </h2>

              </div>


              <button

                onClick={() =>
                  setShowTeacherModal(true)
                }

                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
              >

                <Settings2 size={16} />

                Assign

              </button>

            </div>


            <div className="p-7">


              {
                section.classTeacher ? (

                  <div className="text-center">

                    <div className="w-28 h-28 rounded-[32px] bg-blue-600 text-white flex items-center justify-center text-4xl font-black mx-auto">

                      {
                        section.classTeacher
                          ?.fullName
                          ?.charAt(0)
                      }

                    </div>


                    <h3 className="text-3xl font-black mt-6">

                      {
                        section.classTeacher
                          ?.fullName
                      }

                    </h3>


                    <div className="mt-8 space-y-4 text-left">

                      <div className="flex items-center gap-3">

                        <Phone size={18} />

                        <span>

                          {
                            section.classTeacher
                              ?.phone ||

                            "N/A"
                          }

                        </span>

                      </div>


                      <div className="flex items-center gap-3">

                        <Mail size={18} />

                        <span>

                          {
                            section.classTeacher
                              ?.email ||

                            "N/A"
                          }

                        </span>

                      </div>


                      <div className="flex items-center gap-3">

                        <BadgeCheck size={18} />

                        <span>

                          {
                            section.classTeacher
                              ?.qualification ||

                            "N/A"
                          }

                        </span>

                      </div>

                    </div>

                  </div>

                ) : (

                  <div className="text-center py-10">

                    <School
                      size={55}
                      className="mx-auto text-slate-300 mb-5"
                    />

                    <h3 className="text-2xl font-black text-slate-700">

                      No Teacher Assigned

                    </h3>

                  </div>
                )
              }

            </div>

          </div>

        </div>

      </div>


      {/* ASSIGN TEACHER MODAL */}

      {
        showTeacherModal && (

          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5">

            <div className="bg-white rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl">

              <div className="flex items-center justify-between p-7 border-b">

                <div>

                  <h2 className="text-3xl font-black">

                    Assign Class Teacher

                  </h2>

                </div>


                <button

                  onClick={() =>
                    setShowTeacherModal(false)
                  }

                  className="w-11 h-11 rounded-full hover:bg-slate-100 flex items-center justify-center"
                >

                  <X size={20} />

                </button>

              </div>


              <div className="p-7 space-y-6">

                <select

                  value={selectedTeacher}

                  onChange={(e) =>
                    setSelectedTeacher(
                      e.target.value
                    )
                  }

                  className="w-full border rounded-2xl px-5 py-4"
                >

                  <option value="">
  Select Teacher
</option>

{
  Array.isArray(teachers) &&
  teachers.length > 0 ? (

    teachers.map(
      (teacher) => (

        <option
          key={teacher._id}
          value={teacher._id}
        >

          {
            teacher.fullName
          }

          {
            teacher.employeeId
              ? ` (${teacher.employeeId})`
              : ""
          }

        </option>
      )
    )

  ) : (

    <option disabled>
      No Teachers Found
    </option>
  )
}

</select>


<button

  onClick={
    handleAssignTeacher
  }

  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg hover:scale-[1.01] transition-all duration-300"
>

  Assign Teacher

</button>

</div>

</div>

</div>
)
}


{/* ASSIGN SUBJECT MODAL */}

{
showSubjectModal && (

<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5">

<div className="bg-white rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200">

<div className="flex items-center justify-between p-7 border-b bg-gradient-to-r from-slate-50 to-blue-50">

<div>

<h2 className="text-3xl font-black text-slate-900">

Assign Subject

</h2>

<p className="text-slate-500 mt-1">

Assign teacher & lectures professionally

</p>

</div>


<button

onClick={() =>
setShowSubjectModal(false)
}

className="w-11 h-11 rounded-full hover:bg-slate-200 flex items-center justify-center transition"
>

<X size={20} />

</button>

</div>


<div className="p-7 space-y-6">


{/* SUBJECT */}

<div>

<label className="text-sm font-bold text-slate-700 block mb-2">

Select Subject

</label>

<select

value={selectedSubject}

onChange={(e) =>
setSelectedSubject(
e.target.value
)
}

className="w-full border-2 border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 bg-slate-50"
>

<option value="">
Choose Subject
</option>

{
Array.isArray(subjects) &&
subjects.length > 0 ? (

subjects.map(
(subject) => (

<option
key={subject._id}
value={subject._id}
>

{
subject.name
}

</option>
)
)

) : (

<option disabled>
No Subjects Found
</option>
)
}

</select>

</div>


{/* TEACHER */}

<div>

<label className="text-sm font-bold text-slate-700 block mb-2">

Select Teacher

</label>

<select

value={subjectTeacher}

onChange={(e) =>
setSubjectTeacher(
e.target.value
)
}

className="w-full border-2 border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 bg-slate-50"
>

<option value="">
Choose Teacher
</option>

{
Array.isArray(teachers) &&
teachers.length > 0 ? (

teachers.map(
(teacher) => (

<option
key={teacher._id}
value={teacher._id}
>

{
teacher.fullName
}

{
teacher.employeeId
? ` (${teacher.employeeId})`
: ""
}

</option>
)
)

) : (

<option disabled>
No Teachers Found
</option>
)
}

</select>

</div>


{/* WEEKLY LECTURES */}

<div>

<label className="text-sm font-bold text-slate-700 block mb-2">

Weekly Lectures

</label>

<input

type="number"

value={weeklyLectures}

onChange={(e) =>
setWeeklyLectures(
e.target.value
)
}

placeholder="Example: 5"

className="w-full border-2 border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 bg-slate-50"
/>

</div>


<button

onClick={
handleAssignSubject
}

className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl hover:scale-[1.01] transition-all duration-300"
>

Assign Subject

</button>

</div>

</div>

</div>
)
}

</div>
);
}