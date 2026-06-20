import { useEffect, useState } from "react";

import {

  getAcademicYears,

  activateAcademicYear,

  cloneStructure

} from "../../services/academicYearService";

export default function AcademicYears() {

  const [years, setYears] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const loadYears =
    async () => {

      try {

        setLoading(true);

        const res =
          await getAcademicYears();

        setYears(
          res.academicYears || []
        );

      } catch (err) {

        console.error(err);

        alert(
          "Failed to load academic years"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    loadYears();

  }, []);

  const handleActivate =
    async (id) => {

      try {

        await activateAcademicYear(id);

        alert(
          "Academic year activated"
        );

        loadYears();

      } catch (err) {

        console.error(err);

        alert(
          "Activation failed"
        );
      }
    };

  const handleClone =
    async (sourceYearId) => {

      const targetYearId =
        prompt(
          "Enter Target Academic Year ID"
        );

      if (!targetYearId)
        return;

      try {

        const res =
          await cloneStructure(

            sourceYearId,

            targetYearId
          );

        alert(

          res.message ||

          "Structure cloned successfully"
        );

      } catch (err) {

        console.error(err);

        alert(
          "Clone failed"
        );
      }
    };

  return (

    <div className="p-6">

      <div
        className="
        flex
        justify-between
        items-center
        mb-6
        "
      >

        <div>

          <h1
            className="
            text-2xl
            font-bold
            "
          >

            Academic Years

          </h1>

          <p
            className="
            text-gray-500
            "
          >

            Academic year
            management

          </p>

        </div>

      </div>

      {loading ? (

        <div>
          Loading...
        </div>

      ) : (

        <div
          className="
          bg-white
          rounded-lg
          shadow
          overflow-hidden
          "
        >

          <table
            className="
            w-full
            border-collapse
            "
          >

            <thead>

              <tr
                className="
                bg-gray-100
                "
              >

                <th
                  className="
                  p-3
                  text-left
                  "
                >
                  Name
                </th>

                <th
                  className="
                  p-3
                  text-left
                  "
                >
                  Code
                </th>

                <th
                  className="
                  p-3
                  text-left
                  "
                >
                  Status
                </th>

                <th
                  className="
                  p-3
                  text-left
                  "
                >
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {years.map(
                (year) => (

                  <tr
                    key={year._id}
                    className="
                    border-t
                    "
                  >

                    <td
                      className="p-3"
                    >
                      {year.name}
                    </td>

                    <td
                      className="p-3"
                    >
                      {year.code}
                    </td>

                    <td
                      className="p-3"
                    >

                      {year.isActive ? (

                        <span
                          className="
                          text-green-600
                          font-semibold
                          "
                        >

                          Active

                        </span>

                      ) : (

                        <span
                          className="
                          text-gray-500
                          "
                        >

                          Inactive

                        </span>
                      )}

                    </td>

                    <td
                      className="
                      p-3
                      flex
                      gap-2
                      "
                    >

                      {!year.isActive && (

                        <button
                          onClick={() =>
                            handleActivate(
                              year._id
                            )
                          }
                          className="
                          bg-blue-600
                          text-white
                          px-3
                          py-1
                          rounded
                          "
                        >

                          Activate

                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleClone(
                            year._id
                          )
                        }
                        className="
                        bg-green-600
                        text-white
                        px-3
                        py-1
                        rounded
                        "
                      >

                       Setup New Session

                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}