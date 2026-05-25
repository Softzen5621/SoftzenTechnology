import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import API from "../../services/api";


export default function Subjects() {

  // =====================================
  // STATES
  // =====================================

  const [subjects, setSubjects] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [formData, setFormData] =
    useState({

      name: "",

      status: "Active",
    });


  // =====================================
  // FETCH SUBJECTS
  // =====================================

  const fetchSubjects = async () => {

    try {

      setLoading(true);

      const res = await API.get(
        "/subjects"
      );

      setSubjects(
        res.data.subjects || []
      );

    } catch (err) {

      console.error(err);

      alert(
        "Failed to fetch subjects"
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    fetchSubjects();

  }, []);


  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  // =====================================
  // ADD SUBJECT
  // =====================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    if (!formData.name) {

      alert(
        "Please enter subject name"
      );

      return;
    }

    try {

      await API.post(
        "/subjects",
        formData
      );

      alert(
        "Subject Added Successfully"
      );

      setShowModal(false);

      setFormData({

        name: "",

        status: "Active",
      });

      fetchSubjects();

    } catch (err) {

      console.error(err);

      alert(

        err.response?.data
          ?.message ||

        "Failed to add subject"
      );
    }
  };


  // =====================================
  // FILTER SUBJECTS
  // =====================================

  const filteredSubjects =
    subjects.filter((subject) =>
      subject.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );


  // =====================================
  // STATS
  // =====================================

  const activeSubjects =
    subjects.filter(
      (s) =>
        s.status === "Active"
    ).length;


  const inactiveSubjects =
    subjects.filter(
      (s) =>
        s.status === "Inactive"
    ).length;


  return (

    <div className="p-6">


      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Subjects
          </h1>

          <p className="text-gray-500 mt-1">
            Manage school academic subjects
          </p>

        </div>


        <button
          onClick={() =>
            setShowModal(true)
          }
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
        >

          <Plus size={18} />

          Add Subject

        </button>

      </div>


      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">


        {/* TOTAL */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Subjects
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {subjects.length}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

              <BookOpen size={28} />

            </div>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Active Subjects
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {activeSubjects}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">

              <CheckCircle2 size={28} />

            </div>

          </div>

        </div>


        {/* INACTIVE */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Inactive Subjects
              </p>

              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {inactiveSubjects}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">

              <XCircle size={28} />

            </div>

          </div>

        </div>

      </div>


      {/* ===================================== */}
      {/* SEARCH */}
      {/* ===================================== */}

      <div className="bg-white border rounded-2xl shadow-sm p-4 mb-6">

        <div className="relative w-full md:w-96">

          <Search
            size={18}
            className="absolute left-3 top-3.5 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search subject..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>


      {/* ===================================== */}
      {/* TABLE */}
      {/* ===================================== */}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr className="text-left text-gray-600 text-sm">

                <th className="px-6 py-4">
                  Subject Name
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {
                loading ? (

                  <tr>

                    <td
                      colSpan="2"
                      className="text-center py-10 text-gray-500"
                    >

                      Loading...

                    </td>

                  </tr>

                ) : filteredSubjects.length === 0 ? (

                  <tr>

                    <td
                      colSpan="2"
                      className="text-center py-10 text-gray-500"
                    >

                      No subjects found

                    </td>

                  </tr>

                ) : (

                  filteredSubjects.map(
                    (subject) => (

                      <tr
                        key={
                          subject._id
                        }
                        className="border-t hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-4 font-medium text-gray-800">

                          {subject.name}

                        </td>


                        <td className="px-6 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium

                            ${
                              subject.status ===
                              "Active"

                                ? "bg-green-100 text-green-700"

                                : "bg-red-100 text-red-700"
                            }`}
                          >

                            {
                              subject.status
                            }

                          </span>

                        </td>

                      </tr>
                    )
                  )
                )
              }

            </tbody>

          </table>

        </div>

      </div>


      {/* ===================================== */}
      {/* ADD SUBJECT MODAL */}
      {/* ===================================== */}

      {
        showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-5">

            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">


              {/* HEADER */}

              <div className="flex items-center justify-between border-b px-6 py-5">

                <div>

                  <h2 className="text-2xl font-bold text-gray-800">
                    Add Subject
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Create academic subject
                  </p>

                </div>


                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl"
                >

                  ×

                </button>

              </div>


              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >


                {/* SUBJECT NAME */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">

                    Subject Name

                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter subject name"
                    required
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>


                {/* STATUS */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">

                    Status

                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>


                {/* ACTIONS */}

                <div className="flex justify-end gap-4 pt-4 border-t">

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(false)
                    }
                    className="px-6 py-3 rounded-xl border hover:bg-gray-100"
                  >

                    Cancel

                  </button>


                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium"
                  >

                    Create Subject

                  </button>

                </div>

              </form>

            </div>

          </div>
        )
      }

    </div>
  );
}