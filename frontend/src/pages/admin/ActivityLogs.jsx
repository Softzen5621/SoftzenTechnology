import {
  useEffect,
  useState
} from "react";

import axios from "axios";

import {
  Search,
  RefreshCcw
} from "lucide-react";

// ======================================================
// API URL
// ======================================================

const API_URL =
  `${import.meta.env.VITE_API_URL}/activity-logs`;

// ======================================================
// COMPONENT
// ======================================================

export default function ActivityLogs() {

  // ======================================================
  // STATES
  // ======================================================

  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [moduleFilter, setModuleFilter] =
    useState("");

  const [severityFilter, setSeverityFilter] =
    useState("");

  // ======================================================
  // GET TOKEN
  // ======================================================

  const getToken = () => {

    try {

      const authData =
        JSON.parse(

          localStorage.getItem(
            "erp_auth"
          )
        );

      return authData?.token;

    } catch (error) {

      console.log(
        "TOKEN ERROR:",
        error
      );

      return null;
    }
  };

  // ======================================================
  // FETCH LOGS
  // ======================================================

  const fetchLogs =
    async () => {

      try {

        setLoading(true);

        const token =
          getToken();

        // ==============================================
        // NO TOKEN
        // ==============================================

        if (!token) {

          console.log(
            "NO TOKEN FOUND"
          );

          return;
        }

        // ==============================================
        // API REQUEST
        // ==============================================

        const res =
          await axios.get(

            API_URL,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`
              },

              params: {

                search,

                module:
                  moduleFilter,

                severity:
                  severityFilter
              }
            }
          );

        // ==============================================
        // SET LOGS
        // ==============================================

        setLogs(
          res.data.logs || []
        );

      } catch (err) {

        console.log(
          "ACTIVITY LOG ERROR:"
        );

        console.log(err);

        // ==============================================
        // AUTO LOGOUT
        // ==============================================

        if (

          err.response?.status ===
          401
        ) {

          localStorage.removeItem(
            "erp_auth"
          );

          window.location.replace(
            "/"
          );
        }

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // FETCH ON FILTER CHANGE
  // ======================================================

  useEffect(() => {

    fetchLogs();

  }, [

    search,

    moduleFilter,

    severityFilter
  ]);

  // ======================================================
  // SEVERITY COLOR
  // ======================================================

  const getSeverityColor =
    (severity) => {

      switch (severity) {

        case "CRITICAL":

          return
            "bg-red-100 text-red-700";

        case "HIGH":

          return
            "bg-orange-100 text-orange-700";

        case "MEDIUM":

          return
            "bg-yellow-100 text-yellow-700";

        default:

          return
            "bg-blue-100 text-blue-700";
      }
    };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-black
              text-slate-800
            "
          >
            Activity Logs
          </h1>

          <p
            className="
              text-slate-500
              mt-1
            "
          >
            Monitor all system activities
          </p>

        </div>

        <button

          onClick={fetchLogs}

          className="
            flex
            items-center
            gap-2
            px-4
            py-3
            rounded-xl
            bg-blue-600
            text-white
            hover:bg-blue-700
          "
        >

          <RefreshCcw size={18} />

          Refresh

        </button>
      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div
        className="
          bg-white
          rounded-3xl
          p-6
          shadow-sm
          border
          border-slate-200
          grid
          grid-cols-1
          md:grid-cols-4
          gap-4
        "
      >

        {/* SEARCH */}

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

            placeholder="Search logs..."

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

        {/* MODULE */}

        <select

          value={moduleFilter}

          onChange={(e) =>
            setModuleFilter(
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
            All Modules
          </option>

          <option value="FEES">
            Fees
          </option>

          <option value="STUDENT">
            Students
          </option>

          <option value="EXAMS">
            Exams
          </option>

          <option value="TEACHER">
            Teachers
          </option>

        </select>

        {/* SEVERITY */}

        <select

          value={severityFilter}

          onChange={(e) =>
            setSeverityFilter(
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
            All Severity
          </option>

          <option value="LOW">
            Low
          </option>

          <option value="MEDIUM">
            Medium
          </option>

          <option value="HIGH">
            High
          </option>

          <option value="CRITICAL">
            Critical
          </option>

        </select>

      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div
        className="
          bg-white
          rounded-3xl
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

                <th className="text-left px-6 py-4">
                  User
                </th>

                <th className="text-left px-6 py-4">
                  Module
                </th>

                <th className="text-left px-6 py-4">
                  Action
                </th>

                <th className="text-left px-6 py-4">
                  Reason
                </th>

                <th className="text-left px-6 py-4">
                  Severity
                </th>

                <th className="text-left px-6 py-4">
                  Date
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
                          py-10
                        "
                      >
                        Loading...
                      </td>

                    </tr>
                  )

                  : logs.length === 0

                    ? (

                      <tr>

                        <td
                          colSpan="6"
                          className="
                            text-center
                            py-10
                            text-slate-500
                          "
                        >
                          No activity logs found
                        </td>

                      </tr>
                    )

                    : (

                      logs.map((log) => (

                        <tr
                          key={log._id}
                          className="
                            border-t
                            border-slate-100
                            hover:bg-slate-50
                          "
                        >

                          <td className="px-6 py-4">

                            <div>

                              <h4
                                className="
                                  font-semibold
                                "
                              >
                                {
                                  log.performedByName
                                }
                              </h4>

                              <p
                                className="
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {
                                  log.performedByRole
                                }
                              </p>

                            </div>

                          </td>

                          <td className="px-6 py-4">
                            {log.module}
                          </td>

                          <td className="px-6 py-4">
                            {log.actionType}
                          </td>

                          <td className="px-6 py-4">
                            {
                              log.reason ||
                              "-"
                            }
                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                                ${getSeverityColor(
                                  log.severity
                                )}
                              `}
                            >

                              {log.severity}

                            </span>

                          </td>

                          <td className="px-6 py-4">

                            {

                              new Date(
                                log.createdAt
                              ).toLocaleString()
                            }

                          </td>

                        </tr>
                      ))
                    )
              }

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}