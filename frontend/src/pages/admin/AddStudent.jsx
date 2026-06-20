import { useState, useEffect } from "react";
import API from "../../services/api";

import "./AddStudent.css";

export default function AddStudent() {


const [form, setForm] = useState({
  name: "",
  firstName: "",
  lastName: "",
  gender: "",
  dob: "",
  age: "",
  bloodGroup: "",
  religion: "",
  category: "",
  caste: "",
  nationality: "Indian",
  aadhaarNumber: "",
  motherTongue: "",
  penNumber: "",
  emisNumber: "",
  previousSchool: "",
  academicYear: "",
admissionDate: "",
sectionId: "",
currentClassName: "",
currentSection: "",
stream: "",
studentStatus: "ACTIVE",
fatherName: "",
fatherOccupation: "",
fatherQualification: "",
fatherAadhaar: "",
fatherEmail: "",

motherName: "",
motherMobile: "",
motherOccupation: "",
motherQualification: "",
motherAadhaar: "",

parentMobile: "",
parentEmail: "",
annualIncome: "",

guardianName: "",
guardianRelation: "",
guardianMobile: "",
guardianOccupation: "",
currentAddress: "",
permanentAddress: "",
sameAsCurrentAddress: true,

city: "",
district: "",
state: "",
country: "India",
pincode: "",
guardianAddress: "",

emergencyContactName: "",
emergencyRelation: "",
emergencyContactNumber: "",
alternateMobile: "",

doctorName: "",
doctorContact: "",
nearbyHospital: "",

feeCategory: "",
scholarship: "",
discount: "",

});


  const [step, setStep] = useState(1);
  const [sections, setSections] = useState([]);
const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value
  }));
};

const handleSameAddress = (checked) => {

  setForm((prev) => ({

    ...prev,

    sameAsCurrentAddress: checked,

    permanentAddress: checked
      ? prev.currentAddress
      : prev.permanentAddress

  }));
};

const calculateAge = (dob) => {

  if (!dob) return "";

  const birthDate = new Date(dob);

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDiff =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (
      monthDiff === 0 &&
      today.getDate() <
      birthDate.getDate()
    )
  ) {
    age--;
  }

  return age;
};

useEffect(() => {

  loadSections();

}, []);

const loadSections = async () => {

  try {

    const res =
      await API.get("/sections");

    setSections(
      res.data.sections || []
    );

  } catch (error) {

    console.error(
      "LOAD SECTIONS ERROR",
      error
    );
  }
};

const handleSubmit = async () => {

  try {

    if (
      !form.name ||
      !form.gender ||
      !form.dob
    ) {

      alert(
        "Fill required fields"
      );

      return;
    }

    if (!form.sectionId) {

      alert(
        "Select class"
      );

      return;
    }

    if (
      !form.parentEmail
    ) {

      alert(
        "Parent email required"
      );

      return;
    }

    if (
      !form.parentMobile
    ) {

      alert(
        "Parent mobile required"
      );

      return;
    }

    setLoading(true);

    const res =
      await API.post(
        "/students",
        form
      );

    alert(
      res.data.msg ||
      "Student Created"
    );

    window.location.href =
      "/admin/students";

  } catch (err) {

    console.error(err);

    alert(

      err.response?.data?.msg ||

      "Failed to create student"
    );

  } finally {

    setLoading(false);
  }
};

  const steps = [
    "Basic Info",
    "Academic",
    "Parents",
    "Address",
    "Emergency",
    "Fees",
    "Review"
  ];

  

  return (
    <div className="add-student-container">




      {/* HEADER */}

      <div className="page-header">

        <h1 className="page-title">
          Student Admission Wizard
        </h1>

        <p className="page-subtitle">
          Complete student admission process
        </p>

      </div>

      {/* STEPPER */}

      <div className="stepper-card">

        <div className="stepper">

          {steps.map((item, index) => (

            <div
              key={index}
              className="step-item"
            >

              <div
                className={`step-circle ${
                  step >= index + 1
                    ? "active"
                    : ""
                }`}
              >
                {index + 1}
              </div>

              <div className="step-title">
                {item}
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* FORM CARD */}

      <div className="form-card">

        {step === 1 && (

<>
  <h2 className="section-title">
    Basic Information
  </h2>

  <div className="form-grid">

    <div className="form-group">
      <label>Student Name *</label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>First Name</label>
      <input
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Last Name</label>
      <input
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Gender *</label>
      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
      >
        <option value="">
          Select Gender
        </option>
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
    </div>

    <div className="form-group">
      <label>Date Of Birth *</label>
      <input
        type="date"
        name="dob"
        value={form.dob}
        onChange={(e) => {

          const dob =
            e.target.value;

          setForm(prev => ({
  ...prev,
  dob,
  age: calculateAge(dob)
}));
        }}
      />
    </div>

    <div className="form-group">
      <label>Age</label>
      <input
        value={form.age}
        disabled
      />
    </div>

    <div className="form-group">
      <label>Blood Group</label>
      <select
        name="bloodGroup"
        value={form.bloodGroup}
        onChange={handleChange}
      >
        <option value="">
          Select
        </option>
        <option>A+</option>
        <option>A-</option>
        <option>B+</option>
        <option>B-</option>
        <option>AB+</option>
        <option>AB-</option>
        <option>O+</option>
        <option>O-</option>
      </select>
    </div>

    <div className="form-group">
      <label>Religion</label>
      <input
        name="religion"
        value={form.religion}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Category</label>
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        <option value="">
          Select
        </option>
        <option>General</option>
        <option>OBC</option>
        <option>SC</option>
        <option>ST</option>
      </select>
    </div>

    <div className="form-group">
      <label>Caste</label>
      <input
        name="caste"
        value={form.caste}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Nationality</label>
      <input
        name="nationality"
        value={form.nationality}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Aadhaar Number</label>
      <input
        name="aadhaarNumber"
        value={form.aadhaarNumber}
        onChange={handleChange}
        maxLength={12}
      />
    </div>

    <div className="form-group">
      <label>Mother Tongue</label>
      <input
        name="motherTongue"
        value={form.motherTongue}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>PEN Number</label>
      <input
        name="penNumber"
        value={form.penNumber}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>EMIS Number</label>
      <input
        name="emisNumber"
        value={form.emisNumber}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Previous School</label>
      <input
        name="previousSchool"
        value={form.previousSchool}
        onChange={handleChange}
      />
    </div>

  </div>
</>         



        )}

       {step === 2 && (

<>
  <h2 className="section-title">
    Academic Information
  </h2>

  <div className="form-grid">

    <div className="form-group">
      <label>
        Admission Number
      </label>

      <input
        disabled
        value="Auto Generated"
      />
    </div>

    <div className="form-group">
      <label>
        Admission Date
      </label>

      <input
        type="date"
        name="admissionDate"
        value={form.admissionDate}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>
        Academic Year
      </label>

      <input
        name="academicYear"
        value={form.academicYear}
        onChange={handleChange}
        placeholder="2026-27"
      />
    </div>
<div className="form-group">
  <label>
    Class / Section *
  </label>

  <select
  name="sectionId"
  value={form.sectionId}
    onChange={(e) => {

      const selected =
        sections.find(
          s =>
            s._id ===
            e.target.value
        );

      setForm(prev => ({

        ...prev,

        sectionId:
          e.target.value,

        currentClassName:
          selected?.className || "",

        currentSection:
          selected?.sectionName || ""

      }));
    }}
  >

    <option value="">
      Select Class
    </option>

    {sections.map(section => (

      <option
        key={section._id}
        value={section._id}
      >
        {section.displayName}
      </option>

    ))}

  </select>
</div>






    <div className="form-group">
      <label>
        Stream
      </label>

      <select
        name="stream"
        value={form.stream}
        onChange={handleChange}
      >
        <option value="">
          Select Stream
        </option>

        <option value="Science">
          Science
        </option>

        <option value="Commerce">
          Commerce
        </option>

        <option value="Arts">
          Arts
        </option>
      </select>
    </div>

    <div className="form-group">
      <label>
        Student Status
      </label>

      <select
        name="studentStatus"
        value={form.studentStatus}
        onChange={handleChange}
      >
        <option value="ACTIVE">
          Active
        </option>

        <option value="INACTIVE">
          Inactive
        </option>

        <option value="TC">
          TC
        </option>
      </select>
    </div>

  </div>
</>

)}

{step === 3 && (

<>
  <h2 className="section-title">
    Parent / Guardian Information
  </h2>

  <div className="form-grid">

    {/* FATHER */}

    <div className="form-group">
      <label>Father Name</label>
      <input
        name="fatherName"
        value={form.fatherName}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Father Mobile</label>
      <input
        name="parentMobile"
        value={form.parentMobile}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Father Occupation</label>
      <input
        name="fatherOccupation"
        value={form.fatherOccupation}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Father Qualification</label>
      <input
        name="fatherQualification"
        value={form.fatherQualification}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Father Aadhaar</label>
      <input
        name="fatherAadhaar"
        value={form.fatherAadhaar}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Father Email</label>
      <input
        name="fatherEmail"
        value={form.fatherEmail}
        onChange={handleChange}
      />
    </div>

    {/* MOTHER */}

    <div className="form-group">
      <label>Mother Name</label>
      <input
        name="motherName"
        value={form.motherName}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Mother Mobile</label>
      <input
        name="motherMobile"
        value={form.motherMobile}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Mother Occupation</label>
      <input
        name="motherOccupation"
        value={form.motherOccupation}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Mother Qualification</label>
      <input
        name="motherQualification"
        value={form.motherQualification}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Mother Aadhaar</label>
      <input
        name="motherAadhaar"
        value={form.motherAadhaar}
        onChange={handleChange}
      />
    </div>

    {/* COMMON */}

    <div className="form-group">
      <label>Parent Email</label>
      <input
  type="email"
  name="parentEmail"
  value={form.parentEmail}
  onChange={handleChange}
/>
    </div>

    <div className="form-group">
      <label>Annual Income</label>
      <input
        type="number"
        name="annualIncome"
        value={form.annualIncome}
        onChange={handleChange}
      />
    </div>

    {/* GUARDIAN */}

    <div className="form-group">
      <label>Guardian Name</label>
      <input
        name="guardianName"
        value={form.guardianName}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Guardian Relation</label>
      <input
        name="guardianRelation"
        value={form.guardianRelation}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Guardian Mobile</label>
      <input
        name="guardianMobile"
        value={form.guardianMobile}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Guardian Occupation</label>
      <input
        name="guardianOccupation"
        value={form.guardianOccupation}
        onChange={handleChange}
      />
    </div>

  </div>

</>

)}



        {step === 4 && (

<>
  <h2 className="section-title">
    Address Information
  </h2>

  <div className="form-grid">

    <div className="form-group">
      <label>
        Current Address
      </label>

      <textarea
        rows="3"
        name="currentAddress"
        value={form.currentAddress}
        onChange={(e) => {

          handleChange(e);

          if (
            form.sameAsCurrentAddress
          ) {

            setForm(prev => ({
              ...prev,
              currentAddress:
                e.target.value,
              permanentAddress:
                e.target.value
            }));
          }
        }}
      />
    </div>

    <div className="form-group">
      <label>
        Permanent Address
      </label>

      <textarea
        rows="3"
        name="permanentAddress"
        value={form.permanentAddress}
        disabled={
          form.sameAsCurrentAddress
        }
        onChange={handleChange}
      />
    </div>

    <div className="form-group">

      <label>

        <input
          type="checkbox"
          checked={
            form.sameAsCurrentAddress
          }
          onChange={(e) =>
            handleSameAddress(
              e.target.checked
            )
          }
        />

        {" "}
        Same As Current Address

      </label>

    </div>

    <div className="form-group">
      <label>City</label>

      <input
        name="city"
        value={form.city}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>District</label>

      <input
        name="district"
        value={form.district}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>State</label>

      <input
        name="state"
        value={form.state}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Country</label>

      <input
        name="country"
        value={form.country}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>PIN Code</label>

      <input
        name="pincode"
        value={form.pincode}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>
        Guardian Address
      </label>

      <textarea
        rows="3"
        name="guardianAddress"
        value={form.guardianAddress}
        onChange={handleChange}
      />
    </div>

  </div>

</>

)}

       {step === 5 && (

<>
  <h2 className="section-title">
    Emergency Information
  </h2>

  <div className="form-grid">

    <div className="form-group">
      <label>
        Emergency Contact Name
      </label>

      <input
        name="emergencyContactName"
        value={form.emergencyContactName}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>
        Relation
      </label>

      <input
        name="emergencyRelation"
        value={form.emergencyRelation}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>
        Emergency Mobile
      </label>

      <input
        name="emergencyContactNumber"
        value={form.emergencyContactNumber}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>
        Alternate Mobile
      </label>

      <input
        name="alternateMobile"
        value={form.alternateMobile}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>
        Doctor Name
      </label>

      <input
        name="doctorName"
        value={form.doctorName}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>
        Doctor Contact
      </label>

      <input
        name="doctorContact"
        value={form.doctorContact}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>
        Nearby Hospital
      </label>

      <input
        name="nearbyHospital"
        value={form.nearbyHospital}
        onChange={handleChange}
      />
    </div>

  </div>

</>

)}
       {step === 6 && (

<>
  <h2 className="section-title">
    Fee Information
  </h2>

  <div className="form-grid">

    <div className="form-group">
      <label>
        Fee Category
      </label>

      <select
        name="feeCategory"
        value={form.feeCategory}
        onChange={handleChange}
      >
        <option value="">
          Select Category
        </option>

        <option value="GENERAL">
          General
        </option>

        <option value="RTE">
          RTE
        </option>

        <option value="STAFF">
          Staff Child
        </option>

        <option value="SCHOLARSHIP">
          Scholarship
        </option>
      </select>
    </div>

    <div className="form-group">
      <label>
        Scholarship
      </label>

      <input
        name="scholarship"
        value={form.scholarship}
        onChange={handleChange}
        placeholder="Scholarship Name"
      />
    </div>

    <div className="form-group">
      <label>
        Discount (%)
      </label>

      <input
        type="number"
        name="discount"
        value={form.discount}
        onChange={handleChange}
      />
    </div>

  </div>

</>

)}
       {step === 7 && (

<>
  <h2 className="section-title">
    Review & Submit
  </h2>

  <div className="form-grid">

    <div className="form-group">
      <label>Student Name</label>
      <input
        value={form.name}
        disabled
      />
    </div>

    <div className="form-group">
      <label>Gender</label>
      <input
        value={form.gender}
        disabled
      />
    </div>

<div className="form-group">
  <label>
    Class / Section
  </label>

  <input
    value={
      `${form.currentClassName} - ${form.currentSection}`
    }
    disabled
  />
</div>
   
    <div className="form-group">
      <label>Father Name</label>
      <input
        value={form.fatherName}
        disabled
      />
    </div>

    <div className="form-group">
      <label>Parent Mobile</label>
      <input
        value={form.parentMobile}
        disabled
      />
    </div>

    <div className="form-group">
      <label>Current Address</label>
      <input
        value={form.currentAddress}
        disabled
      />
    </div>

    <div className="form-group">
      <label>Fee Category</label>
      <input
        value={form.feeCategory}
        disabled
      />
    </div>

  </div>

</>

)}

        {/* BUTTONS */}

        <div className="button-row">

          <button
            className="btn btn-secondary"
            disabled={step === 1}
            onClick={() =>
              setStep(step - 1)
            }
          >
            Previous
          </button>

          {step < 7 ? (

            <button
              className="btn btn-primary"
              onClick={() =>
                setStep(step + 1)
              }
            >
              Next
            </button>

          ) : (

            <button
  className="btn btn-success"
  onClick={handleSubmit}
  disabled={loading}
>

  {loading
    ? "Saving..."
    : "Create Student"}

</button>

          )}

        </div>

      </div>

    </div>
  );
}