import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

export default function TransferCertificates() {

const [tcs, setTcs] =
useState([]);

const [loading, setLoading] =
useState(true);

const fetchTCs =
async () => {

  
  try {

    const res =
      await API.get(
        "/transfer-certificates"
      );

    setTcs(
      res.data.tcs || []
    );

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);
  }
};
  

useEffect(() => {

  
fetchTCs();
  

}, []);

return (

  
<div>

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
          text-3xl
          font-bold
          text-slate-800
        "
      >
        Transfer Certificates
      </h1>

      <p
        className="
          text-slate-500
          mt-1
        "
      >
        Manage all issued transfer certificates
      </p>

    </div>

    <div
      className="
        bg-blue-50
        px-4
        py-2
        rounded-xl
        font-semibold
      "
    >
      Total TC: {tcs.length}
    </div>

  </div>

  <div
    className="
      bg-white
      rounded-2xl
      shadow
      overflow-hidden
    "
  >

    <table className="w-full">

      <thead>

        <tr
          className="
            bg-slate-100
            text-slate-700
          "
        >

          <th className="p-4 text-left">
            TC Number
          </th>

          <th className="p-4 text-left">
            Student
          </th>

          <th className="p-4 text-left">
            Admission No
          </th>

          <th className="p-4 text-left">
            Class
          </th>

          <th className="p-4 text-left">
            Issue Date
          </th>

          <th className="p-4 text-center">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {

          loading ? (

            <tr>

              <td
                colSpan="6"
                className="
                  p-8
                  text-center
                "
              >
                Loading...
              </td>

            </tr>

          ) : tcs.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="
                  p-8
                  text-center
                "
              >
                No Transfer Certificates Found
              </td>

            </tr>

          ) : (

            tcs.map((tc) => (

              <tr
                key={tc._id}
                className="
                  border-b
                  hover:bg-slate-50
                "
              >

                <td className="p-4 font-semibold">
                  {tc.tcNumber}
                </td>

                <td className="p-4">
                  {tc.studentId?.name}
                </td>

                <td className="p-4">
                  {
                    tc.studentId
                      ?.admissionNumber
                  }
                </td>

                <td className="p-4">
                  {
                    tc.studentId
                      ?.currentClassName
                  }
                </td>

                <td className="p-4">
                  {
                    new Date(
                      tc.issueDate
                    ).toLocaleDateString()
                  }
                </td>

                <td
                  className="
                    p-4
                    text-center
                  "
                >

                  <div
                    className="
                      flex
                      gap-2
                      justify-center
                    "
                  >

                    <Link

                      to={`/admin/transfer-certificates/${tc._id}`}

                      className="
                        px-3
                        py-2
                        rounded-lg
                        bg-blue-600
                        text-white
                        text-sm
                      "
                    >

                      View

                    </Link>

                    <button

                      disabled

                      className="
                        px-3
                        py-2
                        rounded-lg
                        bg-slate-300
                        text-sm
                      "
                    >

                      PDF

                    </button>

                  </div>

                </td>

              </tr>
            ))
          )
        }

      </tbody>

    </table>

  </div>

</div>
  

);
}
