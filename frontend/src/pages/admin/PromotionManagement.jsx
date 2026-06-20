import { useState } from "react";

import {
  previewPromotion,
  promoteSchool
} from "../../services/promotionService";

export default function PromotionManagement() {

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const handlePreview =
    async () => {

      try {

        setLoading(true);

        const data =
          await previewPromotion();

        setStudents(
          data.data || []
        );

      } catch (err) {

        alert(
          err?.response?.data?.message ||
          "Preview failed"
        );

      } finally {

        setLoading(false);
      }
    };

  const handlePromote =
    async () => {

      const ok =
        window.confirm(
          "Are you sure you want to promote all eligible students?"
        );

      if (!ok) return;

      try {

        setLoading(true);

        const data =
          await promoteSchool();

        alert(
          data.message
        );

      } catch (err) {

        alert(
          err?.response?.data?.message ||
          "Promotion failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="p-6">

      {/* Header */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Student Promotions
        </h1>

        <p className="text-gray-500 mt-1">
          Manage academic year promotions and class progression
        </p>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-xl shadow p-5">

          <p className="text-gray-500 text-sm">
            Total Students
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {students.length}
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <p className="text-gray-500 text-sm">
            Ready For Promotion
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {students.length}
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <p className="text-gray-500 text-sm">
            Promotion Status
          </p>

          <h2 className="text-xl font-semibold text-purple-600 mt-2">
            Academic Session Upgrade
          </h2>

        </div>

      </div>

      {/* Action Buttons */}

      <div className="flex flex-wrap gap-3 mb-6">

        <button
          onClick={handlePreview}
          disabled={loading}
          className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-5
          py-2.5
          rounded-lg
          font-medium
          transition
          "
        >
          {loading
            ? "Loading..."
            : "Preview Promotions"}
        </button>

        <button
          onClick={handlePromote}
          disabled={loading}
          className="
          bg-green-600
          hover:bg-green-700
          text-white
          px-5
          py-2.5
          rounded-lg
          font-medium
          transition
          "
        >
          Promote Students
        </button>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-4 border-b">

          <h3 className="font-semibold text-lg">
            Promotion Preview
          </h3>

        </div>

        {

          students.length === 0 ? (

            <div className="p-10 text-center text-gray-500">

              Click
              <strong>
                {" "}Preview Promotions{" "}
              </strong>

              to view eligible students.

            </div>

          ) : (

            <table className="w-full">

              <thead>

                <tr className="bg-gray-50">

                  <th className="p-4 text-left">
                    Student ID
                  </th>

                  <th className="p-4 text-left">
                    Student Name
                  </th>

                  <th className="p-4 text-left">
                    Current Class
                  </th>

                  <th className="p-4 text-left">
                    Next Class
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  students.map((s) => (

                    <tr
                      key={s.studentId}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {s.studentId}
                      </td>

                      <td className="p-4 font-medium">
                        {s.name}
                      </td>

                      <td className="p-4">
                        {s.currentClass}
                      </td>

                      <td className="p-4">
                        {s.nextClass}
                      </td>

                      <td className="p-4">

                        <span
                          className="
                          bg-green-100
                          text-green-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-medium
                          "
                        >
                          Ready
                        </span>

                      </td>

                    </tr>
                  ))
                }

              </tbody>

            </table>
          )
        }

      </div>

    </div>
  );
}