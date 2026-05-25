import {
  useEffect,
  useState
} from "react";

import API
from "../../services/api";

import {
  Plus,
  School,
  RefreshCw,
  X,
  Globe,
  Phone,
  Mail,
  MapPin,
  Crown,
  Users,
  GraduationCap,
  ShieldCheck,
  Pencil,
  Trash2,
  Power,
  Settings,
  KeyRound,
  LogIn
} from "lucide-react";

export default function Schools() {

  // ======================
  // STATES
  // ======================

  const [schools, setSchools] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedSchool, setSelectedSchool] =
    useState(null);

  const [form, setForm] =
    useState({

      schoolName: "",

      adminName: "",

      adminEmail: "",

      email: "",

      phone: "",

      address: "",

      website: "",

      plan: "FREE"
    });

  // ======================
  // FETCH SCHOOLS
  // ======================

  const fetchSchools =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/super-admin/schools"
          );

        setSchools(
          res.data.schools || []
        );

      } catch (err) {

        console.error(err);

        alert(
          "Error fetching schools"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchSchools();

  }, []);

  // ======================
  // HANDLE CHANGE
  // ======================

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value
      });
    };

  // ======================
  // CREATE SCHOOL
  // ======================

  const createSchool =
    async (e) => {

      e.preventDefault();

      try {

        const res =
          await API.post(

            "/super-admin/create-school",

            form
          );

        alert(

`🎉 School Created Successfully

🏫 School:
${res.data.school.schoolName}

🆔 School Code:
${res.data.adminCredentials.schoolCode}

📧 Admin Email:
${res.data.adminCredentials.email}

🔑 Password:
${res.data.adminCredentials.password}`
        );

        setShowModal(false);

        setForm({

          schoolName: "",

          adminName: "",

          adminEmail: "",

          email: "",

          phone: "",

          address: "",

          website: "",

          plan: "FREE"
        });

        fetchSchools();

      } catch (err) {

        console.error(err);

        alert(

          err?.response?.data?.msg ||

          "Error creating school"
        );
      }
    };

  return (

    <div className="text-white">

      {/* ======================
          HEADER
      ====================== */}

      <div
        className="
          flex
          justify-between
          items-center
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
            Schools Management
          </h1>

          <p
            className="
              text-slate-400
              mt-2
            "
          >
            Manage all ERP schools
          </p>

        </div>

        <div
          className="
            flex
            gap-4
          "
        >

          <button
            onClick={fetchSchools}

            className="
              flex
              items-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-white/10
              hover:bg-white/20
              transition-all
            "
          >

            <RefreshCw size={18} />

            Refresh

          </button>

          <button
            onClick={() =>
              setShowModal(true)
            }

            className="
              flex
              items-center
              gap-2
              px-6
              py-3
              rounded-2xl
              bg-cyan-500
              text-black
              font-bold
            "
          >

            <Plus size={18} />

            Create School

          </button>

        </div>

      </div>

      {/* ======================
          STATS
      ====================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          mb-10
        "
      >

        <StatCard
          title="Total Schools"
          value={schools.length}
          color="text-white"
        />

        <StatCard
          title="Active Schools"
          value={
            schools.filter(
              s => s.isActive
            ).length
          }
          color="text-green-400"
        />

        <StatCard
          title="ERP System"
          value="SaaS"
          color="text-cyan-400"
        />

      </div>

      {/* ======================
          TABLE
      ====================== */}

      <div
        className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          overflow-hidden
        "
      >

        <table className="w-full">

          <thead
            className="
              bg-white/5
            "
          >

            <tr>

              <th className="p-5 text-left">
                School
              </th>

              <th className="p-5 text-left">
                Code
              </th>

              <th className="p-5 text-left">
                Admin
              </th>

              <th className="p-5 text-left">
                Plan
              </th>

              <th className="p-5 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {
              schools.map((school) => (

                <tr
                  key={school._id}

                  onClick={() =>
                    setSelectedSchool(school)
                  }

                  className="
                    border-t
                    border-white/5
                    hover:bg-white/5
                    cursor-pointer
                    transition-all
                  "
                >

                  <td className="p-5">

                    <div
                      className="
                        flex
                        items-center
                        gap-4
                      "
                    >

                      <div
                        className="
                          w-14
                          h-14
                          rounded-2xl
                          bg-cyan-500/20
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <School size={22} />

                      </div>

                      <div>

                        <h2
                          className="
                            font-bold
                            text-lg
                          "
                        >
                          {
                            school.schoolName
                          }
                        </h2>

                        <p
                          className="
                            text-slate-400
                            text-sm
                          "
                        >
                          {
                            school.email ||
                            "No Email"
                          }
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="p-5">
                    {school.schoolCode}
                  </td>

                  <td className="p-5">

                    <div
                      className="
                        flex
                        flex-col
                        gap-1
                      "
                    >

                      <span>
                        {school.adminName}
                      </span>

                      <span
                        className="
                          text-slate-400
                          text-sm
                        "
                      >
                        {school.adminEmail}
                      </span>

                    </div>

                  </td>

                  <td className="p-5">

                    <span
                      className="
                        px-4
                        py-2
                        rounded-xl
                        bg-cyan-500/20
                        text-cyan-400
                        text-sm
                      "
                    >
                      {school.plan}
                    </span>

                  </td>

                  <td className="p-5">

                    <span
                      className={
                        `
                        px-4
                        py-2
                        rounded-xl
                        text-sm
                        ${
                          school.isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }
                      `
                      }
                    >
                      {
                        school.isActive
                          ? "Active"
                          : "Inactive"
                      }
                    </span>

                  </td>

                </tr>
              ))
            }

          </tbody>

        </table>

      </div>

      {/* ======================
          DETAILS DRAWER
      ====================== */}

      {
        selectedSchool && (

          <div
            className="
              fixed
              inset-0
              bg-black/70
              z-50
              flex
              justify-end
            "
          >

            <div
              className="
                w-full
                max-w-2xl
                h-full
                overflow-auto
                bg-[#020617]
                border-l
                border-white/10
                p-8
              "
            >

              {/* HEADER */}

              <div
                className="
                  flex
                  justify-between
                  items-center
                  mb-8
                "
              >

                <div>

                  <h1
                    className="
                      text-4xl
                      font-black
                    "
                  >
                    {
                      selectedSchool.schoolName
                    }
                  </h1>

                  <p
                    className="
                      text-slate-400
                      mt-2
                    "
                  >
                    Enterprise School Details
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelectedSchool(null)
                  }

                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-white/10
                    flex
                    items-center
                    justify-center
                  "
                >

                  <X size={20} />

                </button>

              </div>

              {/* SCHOOL INFO */}

              <DrawerCard
                title="School Information"
              >

                <Info
                  icon={<School size={16} />}
                  label="School Code"
                  value={
                    selectedSchool.schoolCode
                  }
                />

                <Info
                  icon={<Phone size={16} />}
                  label="Phone"
                  value={
                    selectedSchool.phone
                  }
                />

                <Info
                  icon={<Mail size={16} />}
                  label="School Email"
                  value={
                    selectedSchool.email
                  }
                />

                <Info
                  icon={<Globe size={16} />}
                  label="Website"
                  value={
                    selectedSchool.website
                  }
                />

                <Info
                  icon={<MapPin size={16} />}
                  label="Address"
                  value={
                    selectedSchool.address
                  }
                />

              </DrawerCard>

              {/* ADMIN INFO */}

              <DrawerCard
                title="Admin Credentials"
              >

                <Info
                  icon={<Crown size={16} />}
                  label="Admin Name"
                  value={
                    selectedSchool.adminName
                  }
                />

                <Info
                  icon={<Mail size={16} />}
                  label="Admin Login Email"
                  value={
                    selectedSchool.adminEmail
                  }
                />

                <Info
                  icon={<ShieldCheck size={16} />}
                  label="Plan"
                  value={
                    selectedSchool.plan
                  }
                />

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                    mt-6
                  "
                >

                  <button
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-3
                      rounded-2xl
                      bg-cyan-500
                      text-black
                      font-bold
                    "
                  >

                    <KeyRound size={18} />

                    Reset Password

                  </button>

                  <button
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-3
                      rounded-2xl
                      bg-yellow-500
                      text-black
                      font-bold
                    "
                  >

                    <LogIn size={18} />

                    Login As Admin

                  </button>

                </div>

              </DrawerCard>

              {/* ANALYTICS */}

              <DrawerCard
                title="ERP Analytics"
              >

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                  "
                >

                  <AnalyticsCard
                    icon={<Users />}
                    value={
                      selectedSchool.totalStudents || 0
                    }
                    title="Students"
                  />

                  <AnalyticsCard
                    icon={<GraduationCap />}
                    value={
                      selectedSchool.totalTeachers || 0
                    }
                    title="Teachers"
                  />

                </div>

              </DrawerCard>

              {/* MODULES */}

              <DrawerCard
                title="Enabled Modules"
              >

                <div
                  className="
                    flex
                    flex-wrap
                    gap-3
                  "
                >

                  {
                    selectedSchool
                      .enabledModules
                      ?.map((module) => (

                        <span
                          key={module}

                          className="
                            px-4
                            py-2
                            rounded-xl
                            bg-cyan-500/20
                            text-cyan-400
                            text-sm
                            capitalize
                          "
                        >
                          {module}
                        </span>
                      ))
                  }

                </div>

              </DrawerCard>

              {/* ACTIONS */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                  mt-8
                "
              >

                <button
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    py-4
                    rounded-2xl
                    bg-blue-500
                    text-white
                    font-bold
                  "
                >

                  <Pencil size={18} />

                  Edit School

                </button>

                <button
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    py-4
                    rounded-2xl
                    bg-red-500
                    text-white
                    font-bold
                  "
                >

                  <Trash2 size={18} />

                  Delete School

                </button>

                <button
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    py-4
                    rounded-2xl
                    bg-yellow-500
                    text-black
                    font-bold
                  "
                >

                  <Power size={18} />

                  Suspend School

                </button>

                <button
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    py-4
                    rounded-2xl
                    bg-green-500
                    text-black
                    font-bold
                  "
                >

                  <Settings size={18} />

                  Manage Modules

                </button>

              </div>

            </div>

          </div>
        )
      }

      {/* ======================
          CREATE MODAL
      ====================== */}

      {
        showModal && (

          <div
            className="
              fixed
              inset-0
              bg-black/70
              flex
              items-center
              justify-center
              z-50
            "
          >

            <div
              className="
                w-full
                max-w-2xl
                bg-[#0f172a]
                border
                border-white/10
                rounded-3xl
                p-10
              "
            >

              <h2
                className="
                  text-3xl
                  font-black
                  mb-8
                "
              >
                Create School
              </h2>

              <form
                onSubmit={createSchool}

                className="
                  grid
                  grid-cols-2
                  gap-5
                "
              >

                <input
                  type="text"
                  name="schoolName"
                  placeholder="School Name"
                  value={form.schoolName}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <input
                  type="text"
                  name="adminName"
                  placeholder="Admin Name"
                  value={form.adminName}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <input
                  type="email"
                  name="adminEmail"
                  placeholder="Admin Email"
                  value={form.adminEmail}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="School Email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <input
                  type="text"
                  name="website"
                  placeholder="Website"
                  value={form.website}
                  onChange={handleChange}
                  className={inputStyle}
                />

                <select
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  className={inputStyle}
                >

                  <option>FREE</option>
                  <option>BASIC</option>
                  <option>PRO</option>
                  <option>ENTERPRISE</option>

                </select>

                <textarea
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  className={`${inputStyle} col-span-2 min-h-[120px]`}
                />

                <div
                  className="
                    col-span-2
                    flex
                    justify-end
                    gap-4
                    mt-4
                  "
                >

                  <button
                    type="button"

                    onClick={() =>
                      setShowModal(false)
                    }

                    className="
                      px-6
                      py-3
                      rounded-2xl
                      bg-white/10
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"

                    className="
                      px-8
                      py-3
                      rounded-2xl
                      bg-cyan-500
                      text-black
                      font-bold
                    "
                  >
                    Create School
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

/* ======================
   COMPONENTS
====================== */

function StatCard({
  title,
  value,
  color
}) {

  return (

    <div
      className="
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-8
      "
    >

      <h2
        className={`
          text-5xl
          font-black
          ${color}
        `}
      >
        {value}
      </h2>

      <p
        className="
          text-slate-400
          mt-2
        "
      >
        {title}
      </p>

    </div>
  );
}

function DrawerCard({
  title,
  children
}) {

  return (

    <div
      className="
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
        mb-6
      "
    >

      <h2
        className="
          text-xl
          font-bold
          mb-5
        "
      >
        {title}
      </h2>

      <div
        className="
          space-y-4
        "
      >
        {children}
      </div>

    </div>
  );
}

function Info({
  icon,
  label,
  value
}) {

  return (

    <div
      className="
        flex
        items-start
        gap-3
      "
    >

      <div
        className="
          text-cyan-400
          mt-1
        "
      >
        {icon}
      </div>

      <div>

        <p
          className="
            text-slate-400
            text-sm
          "
        >
          {label}
        </p>

        <h2
          className="
            font-semibold
            break-all
          "
        >
          {value || "N/A"}
        </h2>

      </div>

    </div>
  );
}

function AnalyticsCard({
  icon,
  value,
  title
}) {

  return (

    <div
      className="
        bg-white/5
        border
        border-white/10
        rounded-2xl
        p-6
      "
    >

      <div
        className="
          text-cyan-400
          mb-4
        "
      >
        {icon}
      </div>

      <h2
        className="
          text-4xl
          font-black
        "
      >
        {value}
      </h2>

      <p
        className="
          text-slate-400
          mt-2
        "
      >
        {title}
      </p>

    </div>
  );
}

const inputStyle =
  `
  w-full
  bg-white/5
  border
  border-white/10
  rounded-2xl
  px-5
  py-4
  outline-none
  focus:border-cyan-400
`;