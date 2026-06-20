import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  School,
  Users,
  Trash2,
  Eye,
  Layers3,
  GraduationCap,
  X,
  Search,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import API from "../../services/api";


export default function Sections() {

  const navigate = useNavigate();


  // ======================================================
  // STATES
  // ======================================================

  const [sections, setSections] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [selectedClass, setSelectedClass] =
    useState("");

  const [sectionName, setSectionName] =
    useState("");

  const [search, setSearch] =
    useState("");


  // ======================================================
  // FETCH SECTIONS
  // ======================================================

  const fetchSections = async () => {

    try {

      setLoading(true);

      const res =
        await API.get("/sections");


      if (
        Array.isArray(
          res.data
        )
      ) {

        setSections(
          res.data
        );

      } else if (
        Array.isArray(
          res.data.sections
        )
      ) {

        setSections(
          res.data.sections
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };


  // ======================================================
  // FETCH STUDENTS
  // ======================================================

  const fetchStudents = async () => {

    try {

     const res = await API.get("/students?page=1&limit=5000");

      if (
        Array.isArray(
          res.data
        )
      ) {

        setStudents(
          res.data
        );

      } else if (
        Array.isArray(
          res.data.students
        )
      ) {

        setStudents(
          res.data.students
        );
      }

    } catch (error) {

      console.log(error);
    }
  };


  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {

    fetchSections();

    fetchStudents();

  }, []);


  // ======================================================
  // UNIQUE CLASSES
  // ======================================================

  const uniqueClasses =
    useMemo(() => {

      const map = {};

      sections.forEach(
        (item) => {

          if (
            !map[item.className]
          ) {

            map[item.className] = {

              className:
                item.className,

              sections: [],
            };
          }

          map[
            item.className
          ].sections.push(item);
        }
      );

      return Object.values(map);

    }, [sections]);


  // ======================================================
  // FILTERED
  // ======================================================

  const filteredClasses =
    uniqueClasses.filter(
      (item) =>

        item.className
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  // ======================================================
  // CREATE
  // ======================================================

  const addSection = async () => {

    try {

      if (!selectedClass) {

        return alert(
          "Class name required ⚠️"
        );
      }


      await API.post(
        "/sections",
        {

          className:
            selectedClass.trim(),

          sectionName:
            sectionName.trim(),
        }
      );


      alert(
        sectionName

          ? "Section created successfully ✅"

          : "Class created successfully ✅"
      );


      setSelectedClass("");

      setSectionName("");

      setShowForm(false);

      fetchSections();

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data
          ?.msg ||

        "Failed ❌"
      );
    }
  };


  // ======================================================
  // DELETE
  // ======================================================

  const deleteSection =
    async (id) => {

      try {

        const confirmDelete =
          window.confirm(
            "Delete this item?"
          );

        if (!confirmDelete)
          return;


        await API.delete(
          `/sections/${id}`
        );

        fetchSections();

      } catch (error) {

        console.log(error);

        alert(
          "Delete failed ❌"
        );
      }
    };


  // ======================================================
  // TOTALS
  // ======================================================

  const totalClasses =
    uniqueClasses.length;

  const totalSections =
    sections.filter(
      (item) =>
        item.sectionName
    ).length;

  const totalStudents =
    students.length;


  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 p-6">


      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">


        <div>

          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold mb-5">

            <Sparkles size={16} />

            Premium ERP Structure

          </div>


          <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent tracking-tight">

            Classes Management

          </h1>


          <p className="text-slate-500 mt-3 text-lg">

            Modern SaaS class & section management

          </p>

        </div>


        <button

          onClick={() =>
            setShowForm(true)
          }

          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-100 duration-300 text-white px-7 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-[0_10px_30px_rgba(37,99,235,0.35)]"
        >

          <Plus size={22} />

          Create Class

        </button>

      </div>


      {/* ====================================================== */}
      {/* SEARCH */}
      {/* ====================================================== */}

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 border border-white shadow-xl mb-8">

        <div className="relative">

          <Search
            size={20}
            className="absolute left-4 top-4 text-gray-400"
          />

          <input

            type="text"

            placeholder="Search classes..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
          />

        </div>

      </div>


      {/* ====================================================== */}
      {/* STATS */}
      {/* ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">


        {/* CLASSES */}

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-7 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 duration-300">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-semibold">

                Total Classes

              </p>

              <h2 className="text-5xl font-black mt-3 text-slate-900">

                {
                  totalClasses
                }

              </h2>

            </div>


            <div className="w-20 h-20 rounded-3xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">

              <School size={34} />

            </div>

          </div>

        </div>


        {/* SECTIONS */}

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-7 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 duration-300">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-semibold">

                Total Sections

              </p>

              <h2 className="text-5xl font-black mt-3 text-slate-900">

                {
                  totalSections
                }

              </h2>

            </div>


            <div className="w-20 h-20 rounded-3xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-inner">

              <Layers3 size={34} />

            </div>

          </div>

        </div>


        {/* STUDENTS */}

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-7 border border-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 duration-300">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-semibold">

                Total Students

              </p>

              <h2 className="text-5xl font-black mt-3 text-slate-900">

                {
                  totalStudents
                }

              </h2>

            </div>


            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">

              <Users size={34} />

            </div>

          </div>

        </div>

      </div>


      {/* ====================================================== */}
      {/* CLASS GRID */}
      {/* ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">


        {
          filteredClasses.map(
            (classData) => {

              const className =
                classData.className;

              const classSections =
                classData.sections;

const classStudents =
  students.filter((student) =>
    classSections.some(
      (sec) =>
        String(sec._id) ===
        String(student.sectionId?._id || student.sectionId)
    )
  ).length;

              return (

                <div
                  key={className}
                  className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-white shadow-[0_15px_50px_rgba(0,0,0,0.06)] overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(37,99,235,0.12)] duration-300"
                >


                  {/* TOP */}

                  <div className="p-7 border-b border-slate-100">

                    <div className="flex justify-between items-start">

                      <div>

                        <h2 className="text-4xl font-black text-slate-900">

                          {className}

                        </h2>

                        <p className="text-slate-500 mt-3">

                          Academic structure

                        </p>

                      </div>


                      <button

                        onClick={() => {

                          setSelectedClass(
                            className
                          );

                          setShowForm(true);
                        }}

                        className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 duration-300 text-white flex items-center justify-center shadow-lg"
                      >

                        <Plus size={24} />

                      </button>

                    </div>


                    {/* BADGES */}

                    <div className="flex flex-wrap gap-3 mt-6">

                      <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-sm font-bold">

                        {
                          classSections.filter(
                            (
                              sec
                            ) =>
                              sec.sectionName
                          ).length
                        } Sections

                      </div>


                      <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl text-sm font-bold">

                        {
                          classStudents
                        } Students

                      </div>

                    </div>

                  </div>


                  {/* BODY */}

                  <div className="p-6">


                    {
                      classSections.length ===
                        0 ? (

                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center bg-slate-50">

                          <GraduationCap
                            size={45}
                            className="mx-auto text-slate-300 mb-4"
                          />

                          <h3 className="text-xl font-black text-slate-700">

                            No Sections

                          </h3>

                          <p className="text-slate-400 mt-2">

                            Create your first section

                          </p>

                        </div>

                      ) : (

                        <div className="space-y-4">


                          {
                            classSections.map(
                              (
                                section
                              ) => {

                                const sectionStudents =
  students.filter(
    (student) =>
      String(student.sectionId?._id || student.sectionId) ===
      String(section._id)
  ).length;

                                return (

                                  <div
                                    key={
                                      section._id
                                    }
                                    className="bg-gradient-to-r from-slate-50 to-blue-50 border border-blue-100 rounded-3xl p-5 hover:shadow-lg hover:border-blue-200 duration-300"
                                  >

                                    <div className="flex items-center justify-between">

                                      <div>

                                        <h3 className="text-2xl font-black text-slate-900">

                                          {
                                            section.displayName
                                          }

                                        </h3>

                                        <p className="text-slate-500 mt-3 font-medium">

                                           {
                                            sectionStudents
                                          } Students

                                        </p>

                                      </div>


                                      {/* ACTIONS */}

                                      <div className="flex gap-3">

                                        <button

                                          onClick={() =>
                                            navigate(
                                              `/admin/classes/${section._id}`
                                            )
                                          }

                                          className="w-12 h-12 rounded-2xl bg-slate-900 hover:bg-black hover:scale-105 duration-300 text-white flex items-center justify-center shadow-lg"
                                        >

                                          <Eye size={18} />

                                        </button>


                                        <button

                                          onClick={() =>
                                            deleteSection(
                                              section._id
                                            )
                                          }

                                          className="w-12 h-12 rounded-2xl bg-red-500 hover:bg-red-600 hover:scale-105 duration-300 text-white flex items-center justify-center shadow-lg"
                                        >

                                          <Trash2 size={18} />

                                        </button>

                                      </div>

                                    </div>

                                  </div>
                                );
                              }
                            )
                          }

                        </div>
                      )
                    }

                  </div>

                </div>
              );
            }
          )
        }

      </div>


      {/* ====================================================== */}
      {/* MODAL */}
      {/* ====================================================== */}

      {
        showForm && (

          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">

            <div className="bg-white/95 backdrop-blur-2xl rounded-[36px] shadow-[0_25px_80px_rgba(0,0,0,0.18)] w-full max-w-xl overflow-hidden border border-white">


              {/* HEADER */}

              <div className="flex items-center justify-between p-8 border-b border-slate-100">

                <div>

                  <h2 className="text-4xl font-black text-slate-900">

                    Create Class

                  </h2>

                  <p className="text-slate-500 mt-3">

                    Dynamic SaaS class & section structure

                  </p>

                </div>


                <button

                  onClick={() =>
                    setShowForm(false)
                  }

                  className="w-12 h-12 rounded-2xl hover:bg-slate-100 transition flex items-center justify-center"
                >

                  <X size={24} />

                </button>

              </div>


              {/* BODY */}

              <div className="p-8 space-y-7">


                {/* CLASS */}

                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-3">

                    Class Name

                  </label>

                  <input

                    type="text"

                    placeholder="Example: Class 1, Nursery, Computer Lab"

                    value={
                      selectedClass
                    }

                    onChange={(e) =>
                      setSelectedClass(
                        e.target.value
                      )
                    }

                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                  />

                </div>


                {/* SECTION */}

                <div>

                  <label className="block text-sm font-bold text-slate-700 mb-3">

                    Section Name

                    <span className="text-slate-400 font-normal ml-2">

                      (Optional)

                    </span>

                  </label>

                  <input

                    type="text"

                    placeholder="Example: A, Science, Commerce"

                    value={
                      sectionName
                    }

                    onChange={(e) =>
                      setSectionName(
                        e.target.value
                      )
                    }

                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
                  />

                </div>


                {/* INFO */}

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6">

                  <p className="text-sm text-blue-700 leading-8">

                    Create fully dynamic classes for your SaaS ERP.

                    <br />

                    Examples:
                    <span className="font-bold">

                      {" "}
                      Nursery, Class 1, Computer Lab, Dance Batch
                    </span>

                    <br /><br />

                    Optional section examples:
                    <span className="font-bold">

                      {" "}
                      Class 11 - Science
                    </span>

                  </p>

                </div>

              </div>


              {/* FOOTER */}

              <div className="p-8 border-t border-slate-100 flex gap-4">

                <button

                  onClick={() =>
                    setShowForm(false)
                  }

                  className="flex-1 bg-slate-100 hover:bg-slate-200 transition py-4 rounded-2xl font-bold"
                >

                  Cancel

                </button>


                <button

                  onClick={
                    addSection
                  }

                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-100 duration-300 text-white py-4 rounded-2xl font-bold shadow-[0_10px_30px_rgba(37,99,235,0.35)]"
                >

                  Create

                </button>

              </div>

            </div>

          </div>
        )
      }


      {/* ====================================================== */}
      {/* LOADING */}
      {/* ====================================================== */}

      {
        loading && (

          <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-semibold">

            Loading...

          </div>
        )
      }

    </div>
  );
}