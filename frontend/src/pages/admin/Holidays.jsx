import {
  useEffect,
  useState
} from "react";

import API
from "../../services/api";

import Calendar
from "react-calendar";

import "react-calendar/dist/Calendar.css";

import {
  Search,
  RefreshCcw,
  Plus,
  Pencil,
  Trash2,
  CalendarDays
} from "lucide-react";

// ======================================================
// COMPONENT
// ======================================================

export default function Holidays() {

  // ======================================================
  // STATES
  // ======================================================

  const [holidays, setHolidays] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("");

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editingHoliday, setEditingHoliday] =
    useState(null);

  const [formData, setFormData] =
    useState({

      title: "",

      holidayType: "School",

      startDate: "",

      endDate: "",

      description: ""
    });

  const [editData, setEditData] =
    useState({

      title: "",

      holidayType: "School",

      startDate: "",

      endDate: "",

      description: ""
    });

  // ======================================================
  // FETCH HOLIDAYS
  // ======================================================

  useEffect(() => {

    fetchHolidays();

  }, []);

  // ======================================================
  // FETCH
  // ======================================================

  const fetchHolidays =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/holidays/all"
          );

        setHolidays(
          res.data.holidays || []
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value
      });
    };

  // ======================================================
  // CREATE HOLIDAY
  // ======================================================

  const createHoliday =
    async (e) => {

      e.preventDefault();

      try {

        setSaving(true);

        await API.post(

          "/holidays/create",

          formData
        );

        alert(
          "Holiday Added Successfully ✅"
        );

        setFormData({

          title: "",

          holidayType: "School",

          startDate: "",

          endDate: "",

          description: ""
        });

        fetchHolidays();

      } catch (err) {

        console.log(err);

        alert(
          "Failed to Add Holiday ❌"
        );

      } finally {

        setSaving(false);
      }
    };

  // ======================================================
  // DELETE
  // ======================================================

  const deleteHoliday =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete Holiday?"
        );

      if (!confirmDelete)
        return;

      try {

        await API.delete(
          `/holidays/delete/${id}`
        );

        alert(
          "Holiday Deleted ✅"
        );

        fetchHolidays();

      } catch (err) {

        console.log(err);

        alert(
          "Delete Failed ❌"
        );
      }
    };

  // ======================================================
  // OPEN EDIT MODAL
  // ======================================================

  const openEditModal =
    (holiday) => {

      setEditingHoliday(
        holiday
      );

      setEditData({

        title:
          holiday.title || "",

        holidayType:
          holiday.holidayType || "School",

        startDate:
          holiday.startDate
            ?.split("T")[0] || "",

        endDate:
          holiday.endDate
            ?.split("T")[0] || "",

        description:
          holiday.description || ""
      });

      setShowEditModal(
        true
      );
    };

  // ======================================================
  // HANDLE EDIT CHANGE
  // ======================================================

  const handleEditChange =
    (e) => {

      setEditData({

        ...editData,

        [e.target.name]:
          e.target.value
      });
    };

  // ======================================================
  // UPDATE HOLIDAY
  // ======================================================

  const updateHoliday =
    async (e) => {

      e.preventDefault();

      try {

        await API.put(

          `/holidays/update/${editingHoliday._id}`,

          editData
        );

        alert(
          "Holiday Updated ✅"
        );

        setShowEditModal(
          false
        );

        fetchHolidays();

      } catch (err) {

        console.log(err);

        alert(
          "Update Failed ❌"
        );
      }
    };

  // ======================================================
  // FILTERS
  // ======================================================

  const filteredHolidays =
    holidays.filter((holiday) => {

      const matchesSearch =

        holiday.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesType =

        typeFilter === ""

          ? true

          : holiday.holidayType ===
            typeFilter;

      return (
        matchesSearch &&
        matchesType
      );
    });

  // ======================================================
  // TYPE COLORS
  // ======================================================

  const getTypeColor =
    (type) => {

      switch (type) {

        case "National":

          return
            "bg-red-100 text-red-700 border border-red-200";

        case "Festival":

          return
            "bg-orange-100 text-orange-700 border border-orange-200";

        case "Vacation":

          return
            "bg-green-100 text-green-700 border border-green-200";

        case "Emergency":

          return
            "bg-purple-100 text-purple-700 border border-purple-200";

        default:

          return
            "bg-blue-100 text-blue-700 border border-blue-200";
      }
    };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="space-y-6 pb-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          flex-wrap
          gap-4
        "
      >

        <div>

          <h1
            className="
              text-4xl
              font-black
              text-slate-800
              tracking-tight
            "
          >
            Holiday Management
          </h1>

          <p
            className="
              text-slate-500
              mt-2
            "
          >
            Manage school holidays, vacations & events
          </p>

        </div>

        <button

          onClick={fetchHolidays}

          className="
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            font-semibold
            shadow-lg
            hover:scale-[1.02]
            transition
          "
        >

          <RefreshCcw size={18} />

          Refresh

        </button>

      </div>

      {/* ======================================================
          TOP SECTION
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >

        {/* ======================================================
            ADD FORM
        ====================================================== */}

        <form

          onSubmit={createHoliday}

          className="
            xl:col-span-2
            bg-white
            rounded-[30px]
            p-6
            shadow-sm
            border
            border-slate-200
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          "
        >

          <input
            type="text"
            name="title"
            placeholder="Holiday Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="
              px-5
              py-4
              rounded-2xl
              border
              border-slate-200
              outline-none
              focus:border-blue-500
            "
          />

          <select

            name="holidayType"

            value={formData.holidayType}

            onChange={handleChange}

            className="
              px-5
              py-4
              rounded-2xl
              border
              border-slate-200
              outline-none
              focus:border-blue-500
            "
          >

            <option value="School">
              School
            </option>

            <option value="National">
              National
            </option>

            <option value="Festival">
              Festival
            </option>

            <option value="Vacation">
              Vacation
            </option>

            <option value="Emergency">
              Emergency
            </option>

          </select>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="
              px-5
              py-4
              rounded-2xl
              border
              border-slate-200
              outline-none
            "
          />

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="
              px-5
              py-4
              rounded-2xl
              border
              border-slate-200
              outline-none
            "
          />

          <textarea

            name="description"

            placeholder="Holiday Description"

            value={formData.description}

            onChange={handleChange}

            className="
              md:col-span-2
              px-5
              py-4
              rounded-2xl
              border
              border-slate-200
              outline-none
              min-h-[130px]
            "
          />

          <button

            type="submit"

            disabled={saving}

            className="
              md:col-span-2
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              via-blue-500
              to-cyan-500
              text-white
              font-bold
              shadow-lg
              hover:scale-[1.01]
              transition
            "
          >

            {

              saving

                ? "Saving..."

                : "➕ Add Holiday"
            }

          </button>

        </form>

        {/* ======================================================
            PREMIUM CALENDAR
        ====================================================== */}

        <div
          className="
            bg-gradient-to-br
            from-slate-900
            via-slate-800
            to-slate-900
            rounded-[30px]
            p-5
            shadow-xl
            border
            border-slate-700/50
            relative
            overflow-hidden
          "
        >

          <div
            className="
              absolute
              top-0
              right-0
              w-32
              h-32
              bg-blue-500/20
              blur-3xl
              rounded-full
            "
          />

          {/* HEADER */}

          <div
            className="
              relative
              flex
              items-center
              gap-3
              mb-5
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                flex
                items-center
                justify-center
                shadow-lg
              "
            >

              <CalendarDays
                size={22}
                className="
                  text-white
                "
              />

            </div>

            <div>

              <h2
                className="
                  text-white
                  text-lg
                  font-bold
                "
              >
                Holiday Calendar
              </h2>

              <p
                className="
                  text-slate-400
                  text-xs
                "
              >
                Monthly overview
              </p>

            </div>

          </div>

          {/* CALENDAR */}

          <Calendar

            className="
              premium-calendar
            "

            tileClassName={({ date }) => {

              const isHoliday =
                holidays.some(
                  (holiday) => {

                    const start =
                      new Date(
                        holiday.startDate
                      );

                    const end =
                      new Date(
                        holiday.endDate
                      );

                    return (
                      date >= start &&
                      date <= end
                    );
                  }
                );

              return isHoliday
                ? "holiday-tile"
                : "";
            }}

          />

        </div>

      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div
        className="
          bg-white
          rounded-[30px]
          p-6
          shadow-sm
          border
          border-slate-200
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            bg-slate-100
            rounded-2xl
            px-4
          "
        >

          <Search
            size={18}
            className="
              text-slate-400
            "
          />

          <input

            type="text"

            placeholder="Search holidays..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="
              w-full
              bg-transparent
              py-3
              outline-none
            "
          />

        </div>

        <select

          value={typeFilter}

          onChange={(e) =>
            setTypeFilter(
              e.target.value
            )
          }

          className="
            px-4
            py-3
            rounded-2xl
            border
            border-slate-200
            outline-none
          "
        >

          <option value="">
            All Types
          </option>

          <option value="School">
            School
          </option>

          <option value="National">
            National
          </option>

          <option value="Festival">
            Festival
          </option>

          <option value="Vacation">
            Vacation
          </option>

          <option value="Emergency">
            Emergency
          </option>

        </select>

      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div
        className="
          bg-white
          rounded-[30px]
          shadow-sm
          border
          border-slate-200
          overflow-hidden
        "
      >

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

            <thead
              className="
                bg-slate-100
              "
            >

              <tr>

                <th className="text-left px-6 py-5">
                  Title
                </th>

                <th className="text-left px-6 py-5">
                  Type
                </th>

                <th className="text-left px-6 py-5">
                  Start Date
                </th>

                <th className="text-left px-6 py-5">
                  End Date
                </th>

                <th className="text-left px-6 py-5">
                  Description
                </th>

                <th className="text-left px-6 py-5">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {

                loading

                  ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="
                          text-center
                          py-12
                        "
                      >
                        Loading...
                      </td>

                    </tr>
                  )

                  : filteredHolidays.length === 0

                    ? (

                      <tr>

                        <td
                          colSpan="6"
                          className="
                            text-center
                            py-12
                            text-slate-500
                          "
                        >
                          No Holidays Found
                        </td>

                      </tr>
                    )

                    : (

                      filteredHolidays.map(
                        (holiday) => (

                          <tr

                            key={holiday._id}

                            className="
                              border-t
                              border-slate-100
                              hover:bg-slate-50
                              transition
                            "
                          >

                            <td className="px-6 py-5 font-semibold text-slate-800">
                              {holiday.title}
                            </td>

                            <td className="px-6 py-5">

                              <span
                                className={`
                                  px-3
                                  py-1.5
                                  rounded-full
                                  text-xs
                                  font-bold
                                  ${getTypeColor(
                                    holiday.holidayType
                                  )}
                                `}
                              >

                                {
                                  holiday.holidayType
                                }

                              </span>

                            </td>

                            <td className="px-6 py-5">
                              {

                                new Date(
                                  holiday.startDate
                                ).toLocaleDateString()
                              }
                            </td>

                            <td className="px-6 py-5">
                              {

                                new Date(
                                  holiday.endDate
                                ).toLocaleDateString()
                              }
                            </td>

                            <td className="px-6 py-5 text-slate-600">
                              {
                                holiday.description || "-"
                              }
                            </td>

                            <td className="px-6 py-5">

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-3
                                "
                              >

                                <button

                                  onClick={() =>
                                    openEditModal(
                                      holiday
                                    )
                                  }

                                  className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-blue-600
                                    text-white
                                    hover:bg-blue-700
                                    transition
                                  "
                                >

                                  <Pencil size={15} />

                                  Edit

                                </button>

                                <button

                                  onClick={() =>
                                    deleteHoliday(
                                      holiday._id
                                    )
                                  }

                                  className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-red-600
                                    text-white
                                    hover:bg-red-700
                                    transition
                                  "
                                >

                                  <Trash2 size={15} />

                                  Delete

                                </button>

                              </div>

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

      {/* ======================================================
          EDIT MODAL
      ====================================================== */}

      {

        showEditModal && (

          <div
            className="
              fixed
              inset-0
              bg-black/50
              backdrop-blur-sm
              flex
              items-center
              justify-center
              z-50
              p-4
            "
          >

            <form

              onSubmit={updateHoliday}

              className="
                w-full
                max-w-2xl
                bg-white
                rounded-[30px]
                p-8
                space-y-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <h2
                  className="
                    text-2xl
                    font-black
                    text-slate-800
                  "
                >
                  Edit Holiday
                </h2>

                <button

                  type="button"

                  onClick={() =>
                    setShowEditModal(
                      false
                    )
                  }

                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-red-600
                    text-white
                  "
                >

                  Close

                </button>

              </div>

              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleEditChange}
                placeholder="Holiday Title"
                className="
                  w-full
                  px-5
                  py-4
                  rounded-2xl
                  border
                  border-slate-200
                  outline-none
                "
              />

              <select

                name="holidayType"

                value={editData.holidayType}

                onChange={handleEditChange}

                className="
                  w-full
                  px-5
                  py-4
                  rounded-2xl
                  border
                  border-slate-200
                  outline-none
                "
              >

                <option value="School">
                  School
                </option>

                <option value="National">
                  National
                </option>

                <option value="Festival">
                  Festival
                </option>

                <option value="Vacation">
                  Vacation
                </option>

                <option value="Emergency">
                  Emergency
                </option>

              </select>

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                "
              >

                <input
                  type="date"
                  name="startDate"
                  value={editData.startDate}
                  onChange={handleEditChange}
                  className="
                    px-5
                    py-4
                    rounded-2xl
                    border
                    border-slate-200
                    outline-none
                  "
                />

                <input
                  type="date"
                  name="endDate"
                  value={editData.endDate}
                  onChange={handleEditChange}
                  className="
                    px-5
                    py-4
                    rounded-2xl
                    border
                    border-slate-200
                    outline-none
                  "
                />

              </div>

              <textarea

                name="description"

                value={editData.description}

                onChange={handleEditChange}

                placeholder="Description"

                className="
                  w-full
                  min-h-[130px]
                  px-5
                  py-4
                  rounded-2xl
                  border
                  border-slate-200
                  outline-none
                "
              />

              <button

                type="submit"

                className="
                  w-full
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500
                  text-white
                  font-bold
                "
              >

                Update Holiday

              </button>

            </form>

          </div>
        )
      }

      {/* ======================================================
          PREMIUM CALENDAR CSS
      ====================================================== */}

      <style jsx>{`

        .premium-calendar {

          width: 100% !important;
          background: transparent !important;
          border: none !important;
          color: white;
        }

        .premium-calendar .react-calendar__navigation {

          display: flex;
          align-items: center;
          margin-bottom: 18px;
          gap: 8px;
        }

        .premium-calendar .react-calendar__navigation button {

          min-width: 40px;
          height: 40px;
          border-radius: 14px;
          border: none;
          background: rgba(255,255,255,0.08);
          color: white;
          font-weight: 700;
          transition: 0.3s;
        }

        .premium-calendar .react-calendar__navigation button:hover {

          background: rgba(59,130,246,0.3);
        }

        .premium-calendar .react-calendar__navigation__label {

          font-size: 16px;
          font-weight: 700;
        }

        .premium-calendar .react-calendar__month-view__weekdays {

          margin-bottom: 10px;
        }

        .premium-calendar .react-calendar__month-view__weekdays__weekday {

          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 8px 0;
        }

        .premium-calendar .react-calendar__month-view__weekdays__weekday abbr {

          text-decoration: none;
        }

        .premium-calendar .react-calendar__tile {

          height: 52px;
          border-radius: 16px;
          border: none;
          background: transparent;
          color: white;
          font-size: 14px;
          font-weight: 600;
          transition: 0.25s;
        }

        .premium-calendar .react-calendar__tile:hover {

          background: rgba(255,255,255,0.08);
          transform: scale(1.05);
        }

        .premium-calendar .react-calendar__tile--now {

          background: rgba(59,130,246,0.25) !important;
          color: #60a5fa !important;
          border: 1px solid rgba(59,130,246,0.3);
        }

        .premium-calendar .react-calendar__tile--active {

          background: linear-gradient(
            135deg,
            #2563eb,
            #06b6d4
          ) !important;

          color: white !important;

          box-shadow:
            0 10px 25px rgba(37,99,235,0.35);
        }

        .holiday-tile {

          background: rgba(239,68,68,0.18) !important;
          color: #fca5a5 !important;
          border: 1px solid rgba(239,68,68,0.25);
        }

        .holiday-tile:hover {

          background: rgba(239,68,68,0.25) !important;
        }

        .premium-calendar .react-calendar__month-view__days__day--neighboringMonth {

          color: #475569;
        }

      `}</style>

    </div>
  );
}