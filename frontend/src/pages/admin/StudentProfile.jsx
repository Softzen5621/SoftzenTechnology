import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

export default function StudentProfile() {

  const { id } = useParams();

  const [student, setStudent] =
    useState(null);

  // 📥 FETCH STUDENT
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

  useEffect(() => {

    fetchStudent();

  }, [id]);

  if (!student) {

    return <h2>Loading...</h2>;
  }

  return (

    <div style={{ padding: "20px" }}>

      {/* TOP CARD */}
      <div
        style={{
          background: "white",

          borderRadius: "20px",

          padding: "25px",

          marginBottom: "25px",

          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)"
        }}
      >

        <h1>
          👨‍🎓 {student.name}
        </h1>

        <p>
          Admission ID:
          {" "}
          <strong>
            {student.admissionId}
          </strong>
        </p>

        <p>
          Enrollment:
          {" "}
          <strong>
            {
              student.enrollmentNumber
            }
          </strong>
        </p>

        <p>
          Class:
          {" "}
          <strong>
            {
              student.sectionId
                ?.className
            }

            {
              student.sectionId
                ?.sectionName
            }
          </strong>
        </p>

      </div>

      {/* DETAILS GRID */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",

          gap: "20px"
        }}
      >

        {/* PERSONAL */}
        <div
          style={{
            background: "white",

            padding: "20px",

            borderRadius: "15px"
          }}
        >

          <h2>
            📄 Personal Details
          </h2>

          <p>
            Gender:
            {" "}
            {student.gender}
          </p>

          <p>
            DOB:
            {" "}
            {student.dob}
          </p>

          <p>
            Age:
            {" "}
            {student.age}
          </p>

          <p>
            Blood Group:
            {" "}
            {
              student.bloodGroup
            }
          </p>

          <p>
            Religion:
            {" "}
            {
              student.religion
            }
          </p>

          <p>
            Category:
            {" "}
            {
              student.category
            }
          </p>

        </div>

        {/* PARENTS */}
        <div
          style={{
            background: "white",

            padding: "20px",

            borderRadius: "15px"
          }}
        >

          <h2>
            👨‍👩‍👧 Parents Details
          </h2>

          <p>
            Father:
            {" "}
            {
              student.fatherName
            }
          </p>

          <p>
            Mother:
            {" "}
            {
              student.motherName
            }
          </p>

          <p>
            Occupation:
            {" "}
            {
              student.parentOccupation
            }
          </p>

          <p>
            Parent Mobile:
            {" "}
            {
              student.parentMobile
            }
          </p>

        </div>

        {/* CONTACT */}
        <div
          style={{
            background: "white",

            padding: "20px",

            borderRadius: "15px"
          }}
        >

          <h2>
            📞 Contact Details
          </h2>

          <p>
            Mobile:
            {" "}
            {student.mobile}
          </p>

          <p>
            Email:
            {" "}
            {student.email}
          </p>

          <p>
            Address:
            {" "}
            {student.address}
          </p>

          <p>
            City:
            {" "}
            {student.city}
          </p>

          <p>
            State:
            {" "}
            {student.state}
          </p>

          <p>
            Pincode:
            {" "}
            {student.pincode}
          </p>

        </div>

        {/* DOCUMENT */}
        <div
          style={{
            background: "white",

            padding: "20px",

            borderRadius: "15px"
          }}
        >

          <h2>
            🪪 Documents
          </h2>

          <p>
            Aadhaar:
            {" "}
            {
              student.aadhaarNumber
            }
          </p>

          <p>
            Emergency Contact:
            {" "}
            {
              student.emergencyContact
            }
          </p>

        </div>

      </div>

    </div>
  );
}