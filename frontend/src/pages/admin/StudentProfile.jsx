import "./StudentProfile.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

export default function StudentProfile() {

const { id } = useParams();

const [student, setStudent] =
useState(null);

const fetchStudent =
async () => {


  try {

    const res =
      await API.get(
        `/students/${id}`
      );

    setStudent(res.data);

  } catch (err) {

    console.error(err);
  }
};


const issueTC =
async () => {


  try {

    const reason =
      window.prompt(
        "Reason for Leaving"
      );

    if (!reason) return;

    await API.post(

      "/transfer-certificates/issue",

      {
        studentId:
          student._id,

        reasonForLeaving:
          reason,

        result:
          "PASSED",

        remarks:
          ""
      }
    );

    alert(
      "Transfer Certificate Generated Successfully"
    );

    fetchStudent();

  } catch (err) {

    console.error(err);

    alert(

      err?.response?.data?.msg ||

      "Failed to generate TC"
    );
  }
};


useEffect(() => {


fetchStudent();

}, [id]);

if (!student) {

return (

  <div className="student-profile-loading">

    Loading Student Profile...

  </div>
);
 

}

return (

 
<div className="student-profile">

  <div className="profile-header">

    <div className="profile-avatar">

      {student.name?.charAt(0)}

    </div>

    <div className="profile-header-info">

      <h1>{student.name}</h1>

      <div className="profile-tags">

        <span>
          Admission:
          {" "}
          {student.admissionNumber || "-"}
        </span>

        <span>
          Student ID:
          {" "}
          {student.studentId || "-"}
        </span>

        <span>
          Status:
          {" "}
          {student.studentStatus || "ACTIVE"}
        </span>

      </div>

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "10px"
        }}
      >

        {
          student.studentStatus !== "TC" && (

            <button

              onClick={issueTC}

              style={{
                background: "#dc2626",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >

              Generate TC

            </button>
          )
        }

      </div>

    </div>

  </div>

  <div className="profile-grid">

    <div className="profile-card">

      <h3>Academic Information</h3>

      <p>
        <strong>Class:</strong>
        {" "}
        {student.sectionId?.className || "-"}
      </p>

      <p>
        <strong>Section:</strong>
        {" "}
        {student.sectionId?.sectionName || "-"}
      </p>

      <p>
        <strong>Academic Year:</strong>
        {" "}
        {student.academicYear || "-"}
      </p>

      <p>
        <strong>Admission Date:</strong>
        {" "}
        {student.admissionDate || "-"}
      </p>

      <p>
        <strong>Stream:</strong>
        {" "}
        {student.stream || "-"}
      </p>

      <p>
        <strong>Previous School:</strong>
        {" "}
        {student.previousSchool || "-"}
      </p>

      <p>
        <strong>Previous Board:</strong>
        {" "}
        {student.previousBoard || "-"}
      </p>

    </div>

    <div className="profile-card">

      <h3>Personal Information</h3>

      <p><strong>Gender:</strong> {student.gender || "-"}</p>
      <p><strong>DOB:</strong> {student.dob || "-"}</p>
      <p><strong>Age:</strong> {student.age || "-"}</p>
      <p><strong>Religion:</strong> {student.religion || "-"}</p>
      <p><strong>Category:</strong> {student.category || "-"}</p>
      <p><strong>Aadhaar:</strong> {student.aadhaarNumber || "-"}</p>
      <p><strong>Nationality:</strong> {student.nationality || "-"}</p>

    </div>

    <div className="profile-card">

      <h3>Parent Information</h3>

      <p><strong>Father:</strong> {student.fatherName || "-"}</p>
      <p><strong>Mother:</strong> {student.motherName || "-"}</p>
      <p><strong>Parent Mobile:</strong> {student.parentMobile || "-"}</p>
      <p><strong>Parent Email:</strong> {student.parentEmail || "-"}</p>
      <p><strong>Occupation:</strong> {student.parentOccupation || "-"}</p>
      <p><strong>Annual Income:</strong> {student.annualIncome || "-"}</p>

    </div>

    <div className="profile-card">

      <h3>Address Information</h3>

      <p><strong>Current:</strong> {student.currentAddress || "-"}</p>
      <p><strong>Permanent:</strong> {student.permanentAddress || "-"}</p>
      <p><strong>City:</strong> {student.city || "-"}</p>
      <p><strong>District:</strong> {student.district || "-"}</p>
      <p><strong>State:</strong> {student.state || "-"}</p>
      <p><strong>PIN:</strong> {student.pincode || "-"}</p>

    </div>

    <div className="profile-card">

      <h3>Emergency Information</h3>

      <p><strong>Name:</strong> {student.emergencyContactName || "-"}</p>
      <p><strong>Mobile:</strong> {student.emergencyContactNumber || "-"}</p>
      <p><strong>Relation:</strong> {student.emergencyRelation || "-"}</p>
      <p><strong>Doctor:</strong> {student.doctorName || "-"}</p>
      <p><strong>Hospital:</strong> {student.nearbyHospital || "-"}</p>

    </div>

    <div className="profile-card">

      <h3>Fee Information</h3>

      <p><strong>Category:</strong> {student.feeCategory || "-"}</p>
      <p><strong>Scholarship:</strong> {student.scholarship || "-"}</p>
      <p><strong>Discount:</strong> {student.discount || 0}%</p>

    </div>

  </div>

</div>


);
}
