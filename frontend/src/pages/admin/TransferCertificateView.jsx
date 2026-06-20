import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

export default function TransferCertificateView() {

  const { id } = useParams();

  const [tc, setTC] =
    useState(null);

  const [school, setSchool] =
    useState(null);

  useEffect(() => {

    fetchTC();

  }, [id]);

  const fetchTC =
    async () => {

      try {

        const res =
          await API.get(
            `/transfer-certificates/${id}`
          );

        setTC(
          res.data.tc
        );

        setSchool(
          res.data.school
        );

      } catch (err) {

        console.error(err);
      }
    };

  if (!tc) {

    return (

      <div
        className="
          p-10
          text-center
          text-lg
          font-semibold
        "
      >
        Loading Transfer Certificate...
      </div>
    );
  }

  return (

   <div
  className="
    max-w-4xl
    mx-auto
    p-6
  "
>

      {/* ACTIONS */}

      <div
  className="
    flex
    justify-end
    mb-6
    print-hide
  "
>

        <button
          onClick={() =>
            window.print()
          }
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded-lg
            font-semibold
          "
        >
          Print TC
        </button>

      </div>

      {/* CERTIFICATE */}

     <div
  className="
    bg-white
    border-4
    border-slate-800
    p-4
    relative
  "
>

  <div
    className="
      border-2
      border-slate-400
      p-10
      relative
      min-h-[1100px]
    "
  >

        {/* HEADER */}

        <div
          className="
            border-b
            pb-6
            mb-8
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

             {
  school?.logo && (
    <img
      src={`http://localhost:5000${school.logo}`}
      alt=""
      className="
        absolute
        top-1/2
        left-1/2
        -translate-x-1/2
        -translate-y-1/2
        w-96
        opacity-5
pointer-events-none
z-0
      "
    />
  )
}

            </div>

            <div
              className="
                text-center
                flex-1
              "
            >

              <h1
                className="
                  text-3xl
                  font-bold
                  text-slate-800
                "
              >
                {school?.schoolName}
              </h1>

              <p>
                {school?.address}
              </p>

              <p>
                Phone :
                {" "}
                {school?.phone}
              </p>

              <p>
                Email :
                {" "}
                {school?.email}
              </p>

              <p>
                UDISE :
                {" "}
                {school?.udiseCode}
              </p>

            </div>

            <div
              className="
                w-24
              "
            />
          </div>

        </div>

        
<div
  className="
    text-center
    mb-8
  "
>

  <h2
    className="
      text-4xl
      font-extrabold
      uppercase
      tracking-[8px]
      text-slate-800
    "
  >
    Transfer Certificate
  </h2>
 <div
    className="
      w-40
      h-1
      bg-slate-800
      mx-auto
      mt-4
    "
  />

</div>


{/* CERTIFICATE PARAGRAPH */}

<div className="mb-8 text-[15px] leading-8 text-justify">

  This is to certify that
  <strong> {tc.studentId?.name}</strong>,
  S/o / D/o
  <strong> {tc.studentId?.fatherName}</strong>,
  resident of
  <strong>
    {" "}
    {tc.studentId?.address},
    {tc.studentId?.city},
    {tc.studentId?.state}
  </strong>,
  was a bonafide student of
  <strong> {school?.schoolName}</strong>
 and has been studying in this institution from

<strong>
  {" "}
  {
    tc.studentId?.admissionDate
      ? new Date(
          tc.studentId.admissionDate
        ).toLocaleDateString("en-IN")
      : "-"
  }
</strong>

to

<strong>
  {" "}
  {
    tc.studentId?.leavingDate
      ? new Date(
          tc.studentId.leavingDate
        ).toLocaleDateString("en-IN")
      : "-"
  }
</strong>.

</div>

<table className="w-full border text-sm mb-8">

  <tbody>

    <tr>
      <td className="border p-2 font-semibold">TC Number</td>
      <td className="border p-2">{tc.tcNumber}</td>

      <td className="border p-2 font-semibold">Issue Date</td>
      <td className="border p-2">
        {new Date(tc.issueDate).toLocaleDateString("en-IN")}
      </td>
    </tr>

    <tr>
      <td className="border p-2 font-semibold">Student Name</td>
      <td className="border p-2">{tc.studentId?.name}</td>

      <td className="border p-2 font-semibold">Admission No</td>
      <td className="border p-2">
        {tc.studentId?.admissionNumber}
      </td>
    </tr>

    <tr>
      <td className="border p-2 font-semibold">Father Name</td>
      <td className="border p-2">
        {tc.studentId?.fatherName}
      </td>

      <td className="border p-2 font-semibold">Mother Name</td>
      <td className="border p-2">
        {tc.studentId?.motherName}
      </td>
    </tr>

    <tr>
      <td className="border p-2 font-semibold">Aadhaar Number</td>
      <td className="border p-2">
        {tc.studentId?.aadhaarNumber || "-"}
      </td>

      <td className="border p-2 font-semibold">Family ID</td>
      <td className="border p-2">
        {tc.studentId?.familyId || "-"}
      </td>
    </tr>

    <tr>
      <td className="border p-2 font-semibold">Medium</td>
      <td className="border p-2">
        {tc.studentId?.medium || "English"}
      </td>

      <td className="border p-2 font-semibold">Result</td>
      <td className="border p-2">
        {tc.result}
      </td>
    </tr>

  </tbody>

</table>






        {/* REASON */}

        <div
          className="
            mt-10
          "
        >

          <h3
            className="
              text-xl
              font-bold
              mb-3
            "
          >
            Reason For Leaving
          </h3>

          <div
            className="
              border
              rounded-lg
              p-4
              bg-slate-50
            "
          >
            {tc.reasonForLeaving}
          </div>

        </div>

        {/* REMARKS */}

        <div
          className="
            mt-8
          "
        >

          <h3
            className="
              text-xl
              font-bold
              mb-3
            "
          >
            Remarks
          </h3>

          <div
            className="
              border
              rounded-lg
              p-4
              bg-slate-50
            "
          >
            {tc.remarks || "-"}
          </div>

        </div>

        {/* FOOTER */}

        <div
          className="
            mt-20
            flex
            justify-between
            items-end
          "
        >

          <div
            className="
              text-center
            "
          >

            {
              school?.principalSignature && (

               <img
  src={`http://localhost:5000${school.principalSignature}`}
  alt="Principal"
  className="
    h-20
    mx-auto
    object-contain
  "
/>
              )
            }

            <div
              className="
                border-t
                pt-2
                w-48
              "
            >
              Principal
            </div>

          </div>

          <div
            className="
              text-center
            "
          >

            {
              school?.schoolSeal && (

               <img
  src={`http://localhost:5000${school.schoolSeal}`}
  alt="School Seal"
  className="
    h-24
    mx-auto
    object-contain
  "
/> 
              )
            }

            <div
              className="
                border-t
                pt-2
                w-48
              "
            >
              Official Seal
            </div>

          </div>

             </div> {/* Footer */}

    </div> {/* Inner Border */}

  </div> {/* Outer Border */}
</div>
  );
}