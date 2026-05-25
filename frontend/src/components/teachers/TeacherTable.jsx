import { useNavigate } from "react-router-dom";

import {
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  School,
  Briefcase,
  Sparkles,
} from "lucide-react";


const TeacherTable = ({
  teachers = [],
  loading = false,
  onEdit,
  onDelete,
}) => {

  const navigate =
    useNavigate();


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div className="bg-white/90 backdrop-blur-xl rounded-[32px] border border-white shadow-xl p-16 text-center">

        <div className="animate-pulse">

          <div className="w-20 h-20 rounded-full bg-blue-100 mx-auto mb-6" />

          <h2 className="text-2xl font-black text-slate-700">

            Loading Teachers...

          </h2>

        </div>

      </div>
    );
  }


  // ======================================================
  // EMPTY STATE
  // ======================================================

  if (teachers.length === 0) {

    return (

      <div className="bg-white/90 backdrop-blur-xl rounded-[32px] border border-white shadow-xl p-20 text-center">

        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">

          <School
            size={40}
            className="text-slate-400"
          />

        </div>


        <h2 className="text-3xl font-black text-slate-800 mb-3">

          No Teachers Found

        </h2>


        <p className="text-slate-500 text-lg">

          Start by creating your first faculty member

        </p>

      </div>
    );
  }


  return (

    <div className="space-y-6">


      {
        teachers.map((teacher) => {


          const totalSubjects =

            teacher.assignedSubjects
              ?.length || 0;


          const totalClasses =

            teacher.assignedClasses
              ?.length || 0;


          return (

            <div
              key={teacher._id}
              className="bg-white/90 backdrop-blur-xl border border-white shadow-xl rounded-[32px] overflow-hidden hover:shadow-2xl transition duration-300"
            >


              {/* ====================================================== */}
              {/* TOP */}
              {/* ====================================================== */}

              <div className="p-7 border-b border-slate-100">


                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">


                  {/* LEFT */}

                  <div className="flex items-start gap-5">


                    {/* AVATAR */}

                    <div className="relative">

                      <div className="w-24 h-24 rounded-[28px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl font-black shadow-xl">

                        {
                          teacher.fullName
                            ?.charAt(0)
                            ?.toUpperCase()
                        }

                      </div>


                      {
                        teacher.classTeacherOf
                          ?.displayName && (

                          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg">

                            <Sparkles size={18} />

                          </div>
                        )
                      }

                    </div>


                    {/* DETAILS */}

                    <div>


                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-3xl font-black text-slate-900">

                          {
                            teacher.fullName
                          }

                        </h2>


                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-sm font-bold">

                          {
                            teacher.employeeId
                          }

                        </span>


                        <span
                          className={`px-4 py-2 rounded-2xl text-sm font-bold

                          ${
                            teacher.status === "Active"

                              ? "bg-emerald-100 text-emerald-700"

                              : teacher.status === "On Leave"

                              ? "bg-yellow-100 text-yellow-700"

                              : teacher.status === "Suspended"

                              ? "bg-red-100 text-red-700"

                              : "bg-slate-100 text-slate-700"
                          }`}
                        >

                          {
                            teacher.status ||
                            "Active"
                          }

                        </span>

                      </div>


                      <div className="flex flex-wrap items-center gap-5 mt-5 text-slate-600">


                        <div className="flex items-center gap-2">

                          <Phone size={16} />

                          <span className="font-medium">

                            {
                              teacher.phone ||
                              "No Phone"
                            }

                          </span>

                        </div>


                        {
                          teacher.email && (

                            <div className="flex items-center gap-2">

                              <Mail size={16} />

                              <span className="font-medium">

                                {
                                  teacher.email
                                }

                              </span>

                            </div>
                          )
                        }


                        <div className="flex items-center gap-2">

                          <Briefcase size={16} />

                          <span className="font-medium">

                            {
                              teacher.department ||
                              "Academic"
                            }

                          </span>

                        </div>

                      </div>


                      {/* CLASS TEACHER */}

                      {
                        teacher.classTeacherOf
                          ?.displayName && (

                          <div className="mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-3 rounded-2xl font-bold shadow-lg">

                            <School size={18} />

                            Class Teacher :
                            {" "}

                            {
                              teacher.classTeacherOf
                                ?.displayName
                            }

                          </div>
                        )
                      }

                    </div>

                  </div>


                  {/* RIGHT ACTIONS */}

                  <div className="flex items-center gap-3">


                    {/* VIEW */}

                    <button

                      onClick={() =>
                        navigate(
                          `/admin/teachers/${teacher._id}`
                        )
                      }

                      className="w-14 h-14 rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition"
                    >

                      <Eye size={22} />

                    </button>


                    {/* EDIT */}

                    <button

                      onClick={() =>
                        onEdit &&
                        onEdit(teacher)
                      }

                      className="w-14 h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                    >

                      <Pencil size={22} />

                    </button>


                    {/* DELETE */}

                    <button

                      onClick={() =>
                        onDelete &&
                        onDelete(teacher)
                      }

                      className="w-14 h-14 rounded-2xl bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center transition"
                    >

                      <Trash2 size={22} />

                    </button>

                  </div>

                </div>

              </div>


              {/* ====================================================== */}
              {/* ANALYTICS */}
              {/* ====================================================== */}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 p-7 border-b border-slate-100">


                {/* SUBJECTS */}

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-slate-500 font-semibold">

                        Subjects

                      </p>

                      <h3 className="text-4xl font-black mt-2">

                        {
                          totalSubjects
                        }

                      </h3>

                    </div>


                    <div className="w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-700 flex items-center justify-center">

                      <BookOpen size={28} />

                    </div>

                  </div>

                </div>


                {/* CLASSES */}

                <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-3xl p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-slate-500 font-semibold">

                        Classes

                      </p>

                      <h3 className="text-4xl font-black mt-2">

                        {
                          totalClasses
                        }

                      </h3>

                    </div>


                    <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center">

                      <GraduationCap size={28} />

                    </div>

                  </div>

                </div>


                {/* EXPERIENCE */}

                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-slate-500 font-semibold">

                        Experience

                      </p>

                      <h3 className="text-2xl font-black mt-2">

                        {
                          teacher.experience ||

                          "0 Years"
                        }

                      </h3>

                    </div>


                    <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center">

                      <Briefcase size={28} />

                    </div>

                  </div>

                </div>


                {/* WORKLOAD */}

                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-slate-500 font-semibold">

                        Weekly Load

                      </p>

                      <h3 className="text-4xl font-black mt-2">

                        {
                          teacher.weeklyLectureLoad ||
                          0
                        }

                      </h3>

                    </div>


                    <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-700 flex items-center justify-center">

                      <School size={28} />

                    </div>

                  </div>

                </div>

              </div>


              {/* ====================================================== */}
              {/* BOTTOM */}
              {/* ====================================================== */}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 p-7">


                {/* SUBJECTS */}

                <div>

                  <h3 className="text-xl font-black text-slate-900 mb-5">

                    Assigned Subjects

                  </h3>


                  <div className="flex flex-wrap gap-3">


                    {
                      totalSubjects > 0 ? (

                        teacher.assignedSubjects.map(
  (subject, index) => (

    <div
      key={`${subject._id}-${index}`}
                              className="bg-indigo-100 text-indigo-700 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
                            >

                              <BookOpen size={16} />

                              {
                                subject.name
                              }

                            </div>
                          )
                        )

                      ) : (

                        <div className="text-slate-400">

                          No subjects assigned

                        </div>
                      )
                    }

                  </div>

                </div>


                {/* CLASSES */}

                <div>

                  <h3 className="text-xl font-black text-slate-900 mb-5">

                    Assigned Classes

                  </h3>


                  <div className="flex flex-wrap gap-3">


                    {
                      totalClasses > 0 ? (

                        teacher.assignedClasses.map(
                          (cls, index) => (

                            <div
                              key={index}
                              className={`px-5 py-3 rounded-2xl font-semibold flex items-center gap-2

                              ${
                                cls.isClassTeacher

                                  ? "bg-emerald-100 text-emerald-700"

                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >

                              <GraduationCap size={16} />

                              {
                                cls.displayName ||

                                cls.className
                              }


                              {
                                cls.isClassTeacher && (

                                  <span className="bg-white/70 px-2 py-1 rounded-lg text-xs font-black">

                                    CT
                                  </span>
                                )
                              }

                            </div>
                          )
                        )

                      ) : (

                        <div className="text-slate-400">

                          No classes assigned

                        </div>
                      )
                    }

                  </div>

                </div>

              </div>

            </div>
          );
        })
      }

    </div>
  );
};

export default TeacherTable;