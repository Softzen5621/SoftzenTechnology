import { useEffect, useState } from "react";



import {
  X,
  Plus,
  User,
  Briefcase,
  GraduationCap,
  School,
  Check,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  createTeacher,
  updateTeacher,
} from "../../services/teacherService";
import API from "../../services/api";

const TeacherFormModal = ({

  setShowModal,

  refreshTeachers,

  setCredentials,

  teacher,
}) => {
  // ======================================================
  // STATES
  // ======================================================

  const [loading, setLoading] =
    useState(false);

  const [subjects, setSubjects] =
    useState([]);

  const [sections, setSections] =
    useState([]);


  // ======================================================
  // FORM DATA
  // ======================================================

  const [formData, setFormData] =
    useState({

      // PERSONAL

     fullName:
  teacher?.fullName || "",

      email:
  teacher?.email || "",

     phone:
  teacher?.phone || "",

gender:
  teacher?.gender || "Male",

dob:
  teacher?.dob || "",

address:
  teacher?.address || "",

emergencyContact:
  teacher?.emergencyContact || "",


      // PROFESSIONAL

      joiningDate:
  teacher?.joiningDate || "",

qualification:
  teacher?.qualification || "",

experience:
  teacher?.experience || "",

salary:
  teacher?.salary || "",

department:
  teacher?.department || "Academic",

teacherType:
  teacher?.teacherType || "Full Time",

designation:
  teacher?.designation || "Teacher",

specialization:
  teacher?.specialization || "",

status:
  teacher?.status || "Active",


      // ACADEMIC

      assignedSubjects:
  teacher?.assignedSubjects || [],

assignedClasses:
  teacher?.assignedClasses || [],

classTeacherOf:
  teacher?.classTeacherOf || {},
    });


  // ======================================================
  // FETCH SUBJECTS
  // ======================================================

  const fetchSubjects = async () => {

  try {

    const res =
      await API.get(
        "/subjects"
      );

    console.log(
      "SUBJECTS RESPONSE:",
      res.data
    );

    setSubjects(

      Array.isArray(
        res.data?.subjects
      )

        ? res.data.subjects

        : Array.isArray(
            res.data
          )

        ? res.data

        : []
    );

  } catch (error) {

    console.log(
      "SUBJECT FETCH ERROR:",
      error
    );
  }
};

  // ======================================================
  // FETCH SECTIONS
  // ======================================================

  const fetchSections = async () => {

  try {

    const res =
      await API.get(
        "/sections"
      );

    console.log(
      "SECTIONS RESPONSE:",
      res.data
    );

    setSections(

      Array.isArray(
        res.data?.sections
      )

        ? res.data.sections

        : Array.isArray(
            res.data
          )

        ? res.data

        : []
    );

  } catch (error) {

    console.log(
      "SECTION FETCH ERROR:",
      error
    );
  }
};

  // ======================================================
  // LOAD
  // ======================================================

  useEffect(() => {

    fetchSubjects();

    fetchSections();

  }, []);


  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  // ======================================================
  // SUBJECT SELECT
  // ======================================================

  const handleSubjectSelect =
    (subjectId) => {

      const exists =

        formData.assignedSubjects.includes(
          subjectId
        );


      if (exists) {

        setFormData({

          ...formData,

          assignedSubjects:

            formData.assignedSubjects.filter(
              (id) =>
                id !== subjectId
            ),
        });

      } else {

        setFormData({

          ...formData,

          assignedSubjects: [

            ...formData.assignedSubjects,

            subjectId,
          ],
        });
      }
    };


  // ======================================================
  // ADD CLASS
  // ======================================================

  const addClassAssignment =
    () => {

      setFormData({

        ...formData,

        assignedClasses: [

          ...formData.assignedClasses,

          {

            classId: "",

            className: "",

            section: "",

            displayName: "",

            isClassTeacher: false,
          },
        ],
      });
    };


  // ======================================================
  // REMOVE CLASS
  // ======================================================

  const removeClassAssignment =
    (index) => {

      const updated =

        formData.assignedClasses.filter(
          (_, i) => i !== index
        );


      setFormData({

        ...formData,

        assignedClasses: updated,
      });
    };


  // ======================================================
  // HANDLE SECTION SELECT
  // ======================================================

  const handleSectionSelect =
    (index, value) => {

      const selected =
        sections.find(
          (s) =>
            s._id === value
        );


      if (!selected) return;


      const updated = [
        ...formData.assignedClasses,
      ];


      updated[index] = {

        classId:
          selected._id,

        className:
          selected.className || "",

        section:
          selected.sectionName || "",

        displayName:

          selected.displayName ||

          (
            selected.sectionName

              ? `${selected.className} - ${selected.sectionName}`

              : selected.className
          ),

        isClassTeacher:

          updated[index]
            ?.isClassTeacher ||
          false,
      };


      setFormData({

        ...formData,

        assignedClasses: updated,
      });
    };


  // ======================================================
  // TOGGLE CLASS TEACHER
  // ======================================================

  const toggleClassTeacher =
    (index) => {

      const updated =

        formData.assignedClasses.map(
          (cls, i) => ({

            ...cls,

            isClassTeacher:
              i === index
                ? !cls.isClassTeacher
                : false,
          })
        );


      setFormData({

        ...formData,

        assignedClasses: updated,
      });
    };


  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);


        // REQUIRED

        if (
          !formData.fullName ||
          !formData.phone ||
          !formData.joiningDate
        ) {

          alert(
            "Please fill required fields"
          );

          return;
        }


        // CLEAN

        const cleanedAssignments =

          formData.assignedClasses.filter(
            (cls) =>
              cls.className
          );


        // REMOVE DUPLICATE

        const uniqueAssignments = [];

        const seen =
          new Set();


        cleanedAssignments.forEach(
          (cls) => {

            const key =
              cls.displayName;

            if (
              !seen.has(key)
            ) {

              seen.add(key);

              uniqueAssignments.push(
                cls
              );
            }
          }
        );


        // CLASS TEACHER

        let classTeacherOf =
          {};


        const classTeacherClass =

          uniqueAssignments.find(
            (cls) =>
              cls.isClassTeacher
          );


        if (
          classTeacherClass
        ) {

          classTeacherOf = {

            classId:
              classTeacherClass.classId,

            className:
              classTeacherClass.className,

            section:
              classTeacherClass.section,

            displayName:
              classTeacherClass.displayName,
          };
        }


        // PAYLOAD

        const payload = {

          ...formData,

          assignedClasses:
            uniqueAssignments,

          classTeacherOf,
        };


        // API

        let data;

if (teacher?._id) {

  data =
    await updateTeacher(

      teacher._id,

      payload
    );

  alert(
    "Teacher updated successfully"
  );

} else {

  data =
    await createTeacher(
      payload
    );

  alert(
    "Teacher created successfully"
  );
}


        // SUCCESS

        if (
          data?.credentials
        ) {

          setCredentials(
            data.credentials
          );
        }


        await refreshTeachers();

        setShowModal(false);

      } catch (error) {

        console.log(error);

        alert(

          error?.response?.data
            ?.message ||

          "Failed to create teacher"
        );

      } finally {

        setLoading(false);
      }
    };


  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto backdrop-blur-sm">

      <div className="min-h-screen flex items-start justify-center p-6">

        <div className="bg-white rounded-[36px] shadow-2xl w-full max-w-7xl overflow-hidden">


          {/* ====================================================== */}
          {/* HEADER */}
          {/* ====================================================== */}

          <div className="flex items-center justify-between border-b border-slate-100 px-8 py-7 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">


            <div>

              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-3">

                <Sparkles size={16} />

                Faculty Onboarding

              </div>


              <h2 className="text-4xl font-black">

  {
    teacher?._id

      ? "Update Teacher"

      : "Add Teacher"
  }

</h2>


              <p className="text-blue-100 mt-2">

                Create teacher profile,
                academic assignments &
                employee account

              </p>

            </div>


            <button
              onClick={() =>
                setShowModal(false)
              }
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >

              <X size={24} />

            </button>

          </div>


          {/* ====================================================== */}
          {/* FORM */}
          {/* ====================================================== */}

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-8"
          >


            {/* ====================================================== */}
            {/* PERSONAL */}
            {/* ====================================================== */}

            <div className="bg-slate-50 rounded-[32px] p-7">

              <div className="flex items-center gap-4 mb-7">

                <div className="w-14 h-14 rounded-3xl bg-blue-100 text-blue-700 flex items-center justify-center">

                  <User size={24} />

                </div>

                <div>

                  <h3 className="text-2xl font-black text-slate-900">

                    Personal Information

                  </h3>

                  <p className="text-slate-500">

                    Teacher identity & contact details

                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="border rounded-2xl px-5 py-4"
                />


                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="border rounded-2xl px-5 py-4"
                />


                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Mobile Number"
                  className="border rounded-2xl px-5 py-4"
                />


                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="border rounded-2xl px-5 py-4"
                >

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>


               <input
  type="date"
  name="dob"
  value={
    formData.dob
      ? formData.dob
          .toString()
          .split("T")[0]
      : ""
  }
  onChange={handleChange}
  className="
    border
    rounded-2xl
    px-5
    py-4
  "
/>

                <input
                  type="text"
                  name="emergencyContact"
                  value={
                    formData.emergencyContact
                  }
                  onChange={handleChange}
                  placeholder="Emergency Contact"
                  className="border rounded-2xl px-5 py-4"
                />

              </div>


              <textarea
                rows={4}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border rounded-2xl px-5 py-4 mt-5"
              />

            </div>


            {/* ====================================================== */}
            {/* PROFESSIONAL */}
            {/* ====================================================== */}

            <div className="bg-slate-50 rounded-[32px] p-7">

              <div className="flex items-center gap-4 mb-7">

                <div className="w-14 h-14 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center">

                  <Briefcase size={24} />

                </div>

                <div>

                  <h3 className="text-2xl font-black text-slate-900">

                    Professional Information

                  </h3>

                  <p className="text-slate-500">

                    HR & employment details

                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                <input
                  type="date"
                  name="joiningDate"
                  value={
  formData.joiningDate
    ? formData.joiningDate
        .toString()
        .split("T")[0]
    : ""
}
                  onChange={handleChange}
                  required
                  className="border rounded-2xl px-5 py-4"
                />


                <input
                  type="text"
                  name="qualification"
                  value={
                    formData.qualification
                  }
                  onChange={handleChange}
                  placeholder="Qualification"
                  className="border rounded-2xl px-5 py-4"
                />


                <input
                  type="text"
                  name="experience"
                  value={
                    formData.experience
                  }
                  onChange={handleChange}
                  placeholder="Experience"
                  className="border rounded-2xl px-5 py-4"
                />


                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Salary"
                  className="border rounded-2xl px-5 py-4"
                />


                <select
                  name="department"
                  value={
                    formData.department
                  }
                  onChange={handleChange}
                  className="border rounded-2xl px-5 py-4"
                >

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


                <select
                  name="teacherType"
                  value={
                    formData.teacherType
                  }
                  onChange={handleChange}
                  className="border rounded-2xl px-5 py-4"
                >

                  <option value="Full Time">
                    Full Time
                  </option>

                  <option value="Part Time">
                    Part Time
                  </option>

                  <option value="Guest Faculty">
                    Guest Faculty
                  </option>

                </select>


                <input
                  type="text"
                  name="designation"
                  value={
                    formData.designation
                  }
                  onChange={handleChange}
                  placeholder="Designation"
                  className="border rounded-2xl px-5 py-4"
                />


                <input
                  type="text"
                  name="specialization"
                  value={
                    formData.specialization
                  }
                  onChange={handleChange}
                  placeholder="Specialization"
                  className="border rounded-2xl px-5 py-4"
                />


                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border rounded-2xl px-5 py-4"
                >

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

              </div>

            </div>


            {/* ====================================================== */}
            {/* SUBJECTS */}
            {/* ====================================================== */}

            <div className="bg-slate-50 rounded-[32px] p-7">

              <div className="flex items-center gap-4 mb-7">

                <div className="w-14 h-14 rounded-3xl bg-indigo-100 text-indigo-700 flex items-center justify-center">

                  <GraduationCap size={24} />

                </div>

                <div>

                  <h3 className="text-2xl font-black text-slate-900">

                    Subject Assignments

                  </h3>

                  <p className="text-slate-500">

                    Assign academic subjects

                  </p>

                </div>

              </div>


              <div className="flex flex-wrap gap-3">

                {
                  subjects.map(
                    (subject) => {

                      const selected =

                        formData.assignedSubjects.includes(
                          subject._id
                        );

                      return (

                        <button
                          type="button"
                          key={subject._id}
                          onClick={() =>
                            handleSubjectSelect(
                              subject._id
                            )
                          }
                          className={`px-5 py-3 rounded-2xl border font-semibold transition flex items-center gap-2

                          ${
                            selected

                              ? "bg-blue-600 text-white border-blue-600"

                              : "bg-white hover:bg-slate-100"
                          }`}
                        >

                          {
                            selected && (
                              <Check size={16} />
                            )
                          }

                          {subject.name}

                        </button>
                      );
                    }
                  )
                }

              </div>

            </div>


            {/* ====================================================== */}
            {/* CLASS ASSIGNMENTS */}
            {/* ====================================================== */}

            <div className="bg-slate-50 rounded-[32px] p-7">

              <div className="flex items-center justify-between mb-7">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center">

                    <School size={24} />

                  </div>

                  <div>

                    <h3 className="text-2xl font-black text-slate-900">

                      Class Assignments

                    </h3>

                    <p className="text-slate-500">

                      Assign classes & sections

                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={
                    addClassAssignment
                  }
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold"
                >

                  <Plus size={18} />

                  Add Class

                </button>

              </div>


              <div className="space-y-5">

                {
                  formData.assignedClasses.map(
                    (
                      cls,
                      index
                    ) => (

                      <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-3xl p-5"
                      >

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

<select
  value={
    cls.classId || ""
  }
  onChange={(e) =>
    handleSectionSelect(
      index,
      e.target.value
    )
  }
  className="
    border
    rounded-2xl
    px-5
    py-4
  "
>

  <option value="">
    Select Class
  </option>

  {
    sections.map(
      (section) => (

        <option
          key={section._id}
          value={section._id}
        >

          {
            section.displayName ||

            `${section.className} - ${section.sectionName}`
          }

        </option>
      )
    )
  }

</select>


                          {/* CLASS */}

                          <input
                            type="text"
                            value={
                              cls.className
                            }
                            readOnly
                            placeholder="Class"
                            className="border rounded-2xl px-5 py-4 bg-slate-100"
                          />


                          {/* SECTION */}

                          <input
                            type="text"
                            value={
                              cls.section ||
                              "General"
                            }
                            readOnly
                            placeholder="Section"
                            className="border rounded-2xl px-5 py-4 bg-slate-100"
                          />


                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeClassAssignment(
                                index
                              )
                            }
                            className="bg-red-100 text-red-600 rounded-2xl px-5 py-4 hover:bg-red-200 flex items-center justify-center gap-2 font-bold"
                          >

                            <Trash2 size={18} />

                            Remove

                          </button>

                        </div>


                        {/* CLASS TEACHER */}

                        <div className="mt-5">

                          <label className="flex items-center gap-3 text-emerald-700 font-semibold">

                            <input
                              type="checkbox"
                              checked={
                                cls.isClassTeacher ||
                                false
                              }
                              onChange={() =>
                                toggleClassTeacher(
                                  index
                                )
                              }
                              className="w-5 h-5"
                            />

                            Assign as Class Teacher

                          </label>

                        </div>

                      </div>
                    )
                  )
                }

              </div>

            </div>


            {/* ====================================================== */}
            {/* FOOTER */}
            {/* ====================================================== */}

            <div className="flex justify-end gap-4 border-t pt-7">


              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="px-7 py-4 rounded-2xl border border-slate-300 hover:bg-slate-100 font-semibold"
              >

                Cancel

              </button>


              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition text-white px-8 py-4 rounded-2xl font-bold shadow-xl"
              >

              {
  loading

    ? (
        teacher?._id

          ? "Updating Teacher..."

          : "Creating Teacher..."
      )

    : (
        teacher?._id

          ? "Update Teacher"

          : "Create Teacher"
      )
}

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default TeacherFormModal;