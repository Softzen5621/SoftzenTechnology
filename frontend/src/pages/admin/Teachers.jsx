import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import {
  Plus,
  Search,
  Upload,
  Download,
  Users,
  UserCheck,
  UserX,
  Briefcase,
  GraduationCap,
  BookOpen,
  Sparkles,
  Filter,
} from "lucide-react";

import {

  getTeachers,

  createTeacher,

  updateTeacher,

  deleteTeacher,

  downloadTeacherSample,

  importTeachersExcel,
} from "../../services/teacherService";

import TeacherFormModal from "../../components/teachers/TeacherFormModal";

import TeacherTable from "../../components/teachers/TeacherTable";

import TeacherCredentialsModal from "../../components/teachers/TeacherCredentialsModal";
const getToken = () => {

  return localStorage.getItem(
    "token"
  );
};


const Teachers = () => {

  // ======================================================
  // STATES
  // ======================================================

  const [teachers, setTeachers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [credentials, setCredentials] =
    useState(null);

    const [selectedTeacher, setSelectedTeacher] =
  useState(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [importLoading, setImportLoading] =
    useState(false);


  // ======================================================
  // FETCH TEACHERS
  // ======================================================

  const fetchTeachers =
    async () => {

      try {

        setLoading(true);

        const data =
          await getTeachers();


        setTeachers(

          Array.isArray(
            data?.teachers
          )

            ? data.teachers

            : []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };


  useEffect(() => {

    fetchTeachers();

  }, []);


  // ======================================================
  // IMPORT
  // ======================================================

  const handleImport =
    async (e) => {

      try {

        const file =
          e.target.files[0];

        if (!file) return;

        setImportLoading(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );


        await axios.post(

          `${import.meta.env.VITE_API_URL}/teachers/import`,

          formData,

          {

            headers: {

              Authorization:

                `Bearer ${getToken()}`,
            },
          }
        );


        alert(
          "Teachers imported successfully"
        );

        fetchTeachers();

      } catch (error) {

        console.log(error);

        alert(

          error?.response?.data?.message ||

          "Import failed"
        );

      } finally {

        setImportLoading(false);
      }
    };


  // ======================================================
  // FILTERED DATA
  // ======================================================

  const filteredTeachers =
    useMemo(() => {

      return teachers.filter(
        (teacher) => {

          const matchesSearch =

            teacher?.fullName
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            teacher?.employeeId
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            teacher?.phone
              ?.includes(search);


          const matchesStatus =

            statusFilter === "All"

              ? true

              : teacher.status ===
                statusFilter;


          const matchesDepartment =

            departmentFilter === "All"

              ? true

              : teacher.department ===
                departmentFilter;


          return (

            matchesSearch &&
            matchesStatus &&
            matchesDepartment
          );
        }
      );

    }, [

      teachers,
      search,
      statusFilter,
      departmentFilter,
    ]);


  // ======================================================
  // ANALYTICS
  // ======================================================

  const analytics =
    useMemo(() => {

      return {

        total:
          teachers.length,

        active:
          teachers.filter(
            (t) =>
              t.status === "Active"
          ).length,

        onLeave:
          teachers.filter(
            (t) =>
              t.status === "On Leave"
          ).length,

        inactive:
          teachers.filter(
            (t) =>
              t.status === "Inactive"
          ).length,

        totalSubjects:
          teachers.reduce(
            (acc, t) =>

              acc +

              (
                t.assignedSubjects
                  ?.length || 0
              ),

            0
          ),

        totalClasses:
          teachers.reduce(
            (acc, t) =>

              acc +

              (
                t.assignedClasses
                  ?.length || 0
              ),

            0
          ),
      };

    }, [teachers]);


  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 p-6">


      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">


        <div>

          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold mb-4">

            <Sparkles size={16} />

            Faculty Management

          </div>


          <h1 className="text-5xl font-black bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">

            Teachers Dashboard

          </h1>


          <p className="text-slate-500 mt-3 text-lg">

            Manage faculty, assignments,
            academic workload & employee accounts

          </p>

        </div>


        <button

  onClick={() => {

    setSelectedTeacher(null);

    setShowModal(true);
  }}

          className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition text-white px-7 py-4 rounded-2xl font-bold shadow-xl"
        >

          <Plus size={20} />

          Add Teacher

        </button>

      </div>


      {/* ====================================================== */}
      {/* STATS */}
      {/* ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5 mb-8">


        {/* TOTAL */}

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500 font-semibold">

                Total Teachers

              </p>

              <h2 className="text-4xl font-black mt-2 text-slate-900">

                {analytics.total}

              </h2>

            </div>


            <div className="w-16 h-16 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-700">

              <Users size={30} />

            </div>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500 font-semibold">

                Active

              </p>

              <h2 className="text-4xl font-black mt-2 text-slate-900">

                {analytics.active}

              </h2>

            </div>


            <div className="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-700">

              <UserCheck size={30} />

            </div>

          </div>

        </div>


        {/* ON LEAVE */}

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500 font-semibold">

                On Leave

              </p>

              <h2 className="text-4xl font-black mt-2 text-slate-900">

                {analytics.onLeave}

              </h2>

            </div>


            <div className="w-16 h-16 rounded-3xl bg-yellow-100 flex items-center justify-center text-yellow-700">

              <Briefcase size={30} />

            </div>

          </div>

        </div>


        {/* INACTIVE */}

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500 font-semibold">

                Inactive

              </p>

              <h2 className="text-4xl font-black mt-2 text-slate-900">

                {analytics.inactive}

              </h2>

            </div>


            <div className="w-16 h-16 rounded-3xl bg-red-100 flex items-center justify-center text-red-700">

              <UserX size={30} />

            </div>

          </div>

        </div>


        {/* SUBJECTS */}

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500 font-semibold">

                Assigned Subjects

              </p>

              <h2 className="text-4xl font-black mt-2 text-slate-900">

                {analytics.totalSubjects}

              </h2>

            </div>


            <div className="w-16 h-16 rounded-3xl bg-indigo-100 flex items-center justify-center text-indigo-700">

              <BookOpen size={30} />

            </div>

          </div>

        </div>


        {/* CLASSES */}

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500 font-semibold">

                Assigned Classes

              </p>

              <h2 className="text-4xl font-black mt-2 text-slate-900">

                {analytics.totalClasses}

              </h2>

            </div>


            <div className="w-16 h-16 rounded-3xl bg-purple-100 flex items-center justify-center text-purple-700">

              <GraduationCap size={30} />

            </div>

          </div>

        </div>

      </div>


      {/* ====================================================== */}
      {/* TOOLBAR */}
      {/* ====================================================== */}

      <div className="bg-white/90 backdrop-blur-xl rounded-[32px] shadow-xl border border-white p-5 mb-8">


        <div className="flex flex-col 2xl:flex-row gap-4 justify-between">


          {/* SEARCH */}

          <div className="relative w-full 2xl:w-[420px]">

            <Search
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input

              type="text"

              placeholder="Search teacher, employee ID or phone..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              className="w-full border border-slate-200 bg-slate-50 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-blue-100"
            />

          </div>


          {/* FILTERS */}

          <div className="flex flex-wrap gap-3">


            <div className="flex items-center gap-2 px-4 bg-slate-100 rounded-2xl">

              <Filter
                size={16}
                className="text-slate-500"
              />

              <span className="text-sm font-semibold text-slate-600">

                Filters

              </span>

            </div>


            {/* STATUS */}

            <select

              value={statusFilter}

              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }

              className="border border-slate-200 rounded-2xl px-5 py-4 bg-white font-medium"
            >

              <option value="All">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="On Leave">
                On Leave
              </option>

              <option value="Inactive">
                Inactive
              </option>

              <option value="Suspended">
                Suspended
              </option>

            </select>


            {/* DEPARTMENT */}

            <select

              value={departmentFilter}

              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }

              className="border border-slate-200 rounded-2xl px-5 py-4 bg-white font-medium"
            >

              <option value="All">
                All Departments
              </option>

              <option value="Academic">
                Academic
              </option>

              <option value="Computer">
                Computer
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Arts">
                Arts
              </option>

            </select>


            {/* SAMPLE */}
<button

  onClick={async () => {

    try {

      const blob =

        await downloadTeacherSample();


      const url =
        window.URL.createObjectURL(
          new Blob([blob])
        );


      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(

        "download",

        "teacher_sample.xlsx"
      );

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

    } catch (error) {

      console.log(error);

      alert(
        "Sample download failed"
      );
    }
  }}

  className="flex items-center gap-2 border border-slate-200 rounded-2xl px-5 py-4 hover:bg-slate-100 font-semibold"
>

  <Download size={18} />

  Sample

</button>


            {/* IMPORT */}

            <label className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition text-white px-6 py-4 rounded-2xl cursor-pointer font-bold shadow-lg">

              <Upload size={18} />

              {
                importLoading

                  ? "Importing..."

                  : "Import"
              }

              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleImport}
              />

            </label>

          </div>

        </div>

      </div>


      {/* ====================================================== */}
      {/* TABLE */}
      {/* ====================================================== */}

      <TeacherTable

  teachers={filteredTeachers}

  loading={loading}

  onEdit={(teacher) => {

    setSelectedTeacher(
      teacher
    );

    setShowModal(true);
  }}

  onDelete={async (teacher) => {

    const confirmDelete =

      window.confirm(

        `Delete ${teacher.fullName}?`
      );

    if (!confirmDelete) return;

    try {

     await deleteTeacher(
  teacher._id
);

      fetchTeachers();

      alert(
        "Teacher deleted successfully"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Delete failed"
      );
    }
  }}
/>


      {/* ====================================================== */}
      {/* MODALS */}
      {/* ====================================================== */}

      {
        showModal && (

          <TeacherFormModal

  setShowModal={
    setShowModal
  }

  refreshTeachers={
    fetchTeachers
  }

  setCredentials={
    setCredentials
  }

  teacher={
    selectedTeacher
  }
/>
        )
      }


      {
        credentials && (

          <TeacherCredentialsModal

            credentials={
              credentials
            }

            setCredentials={
              setCredentials
            }
          />
        )
      }

    </div>
  );
}
export default Teachers;