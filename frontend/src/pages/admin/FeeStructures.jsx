import "./FeeStructures.css";
import React, {

  useEffect,

  useState

} from "react";

import api from "../../services/api";
const defaultFeeCategories = [
  {
    title: "Admission Fee",
    code: "ADM",
    recurringType: "ONE_TIME"
  },
  {
    title: "Tuition Fee",
    code: "TUI",
    recurringType: "MONTHLY"
  },
  {
    title: "Exam Fee",
    code: "EXM",
    recurringType: "YEARLY"
  },
  {
    title: "Library Fee",
    code: "LIB",
    recurringType: "YEARLY"
  },
  {
    title: "Sports Fee",
    code: "SPT",
    recurringType: "YEARLY"
  },
  {
    title: "Computer Fee",
    code: "CMP",
    recurringType: "YEARLY"
  },
  {
    title: "Activity Fee",
    code: "ACT",
    recurringType: "YEARLY"
  },
  {
    title: "Transport Fee",
    code: "TRN",
    recurringType: "MONTHLY"
  }
];
const FeeStructures = () => {

  const [academicYears, setAcademicYears] = useState([]);
const [classes, setClasses] = useState([]);

const fetchAcademicYears = async () => {
  try {

    const res =
      await api.get(
        "/academic-years/all"
      );

    setAcademicYears(
      res.data.academicYears || []
    );

  } catch (err) {

    console.error(err);
  }
};
const fetchClasses = async (
  academicYear = ""
) => {

  try {

    const res =
      await api.get(
        "/sections"
      );

console.log(
  "SECTION RESPONSE",
  res.data
);
let sections =
  Array.isArray(res.data)
    ? res.data
    : (res.data.sections || []);
    if (academicYear) {

      sections =
        sections.filter(
          s =>
            s.academicYear ===
            academicYear
        );
    }

    

    const uniqueClasses = [

      ...new Set(

        sections.map(
          s => s.className
        )
      )
    ];
console.log("CLASSES FOUND", uniqueClasses);
  setClasses(uniqueClasses);


  } catch (err) {

    console.error(err);
  }
};


  // ======================
  // STATES
  // ======================

  const [

    structures,

    setStructures

  ] = useState([]);




  const [

    loading,

    setLoading

  ] = useState(false);




  const [

    formData,

    setFormData

    

  ] = useState({

    academicYear:
      "",

    className: "",

    section: "ALL",

    structureName: "",

    effectiveFrom: "",

    effectiveTo: "",

    allowOnlinePayment: true,

    notes: "",

    feeItems: []
  });




  // ======================
  // FETCH STRUCTURES
  // ======================

  const fetchStructures =
  async () => {

    try {

      setLoading(true);



      const response =
        await api.get(
          "/fee-structures"
        );



      setStructures(

        response.data
        .structures || []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };


useEffect(() => {

  fetchStructures();

  fetchAcademicYears();


}, []);



  // ======================
  // HANDLE FORM
  // ======================

  const handleChange = (e) => {

  const updated = {
    ...formData,
    [e.target.name]: e.target.value
  };

  if (e.target.name === "className") {

    updated.structureName =
      `${e.target.value} Fee Structure ${
        updated.academicYear || ""
      }`;

    updated.feeItems =
      defaultFeeCategories.map(
        item => ({
          title: item.title,
          code: item.code,
          amount: "",
          mandatory: true,
          recurringType:
            item.recurringType
        })
      );
  }
if (e.target.name === "academicYear") {

  updated.structureName =
    `${updated.className || ""} Fee Structure ${
      e.target.value
    }`;

  fetchClasses(
    e.target.value
  );
}
  setFormData(updated);
};

  // ======================
  // ADD ITEM
  // ======================

  // ======================
  // SAVE STRUCTURE
  // ======================

  const saveStructure =
  async () => {

    try {

     if (
  !formData.academicYear ||
  !formData.className ||
  !formData.structureName ||
  formData.feeItems.length === 0
) {

        return alert(
          "Please fill all required fields"
        );
      }



      await api.post(

        "/fee-structures",

        formData
      );



      alert(
        "Fee structure created"
      );



      setFormData({

        academicYear:
          "",

        className: "",

        section: "ALL",

        structureName: "",

        effectiveFrom: "",

        effectiveTo: "",

        allowOnlinePayment:
          true,

        notes: "",

        feeItems: []
      });



      fetchStructures();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to create structure"
      );
    }
  };

  const usedClasses =
  structures.map(
    s =>
      `${s.academicYear}-${s.className}`
  );

  const totalFee =
  formData.feeItems.reduce(
    (sum,item)=>
      sum + Number(item.amount || 0),
    0
  );



  // ======================
  // UI
  // ======================

  return (

   <div className="fee-page">

     <h1 className="fee-title">
  Fee Structures
</h1>



      {/* CREATE FORM */}

      <div className="fee-card">
        <h2>
          Create Structure
        </h2>



        {/* BASIC DETAILS */}
<div className="fee-grid">

       <select
  name="academicYear"
  value={formData.academicYear}
  onChange={handleChange}
  className="fee-select"
>

  <option value="">
    Select Academic Year
  </option>

  {academicYears.map(
    year => (
      <option
        key={year._id}
        value={year.name}
      >
        {year.name}
      </option>
    )
  )}

</select>

<select
  name="className"
  value={formData.className}
  onChange={handleChange}
  className="fee-select"
>

  <option value="">
    Select Class
  </option>

  {classes
.filter(
  cls =>
    !usedClasses.includes(
      `${formData.academicYear}-${cls}`
    )
)
.map(
    cls => (
      <option
        key={cls}
        value={cls}
      >
        {cls}
      </option>
    )
  )}

</select>

         {/* <input
  type="text"
  name="structureName"
  value={formData.structureName}
  readOnly
 className="fee-input"

/> */}

<input
  type="date"
  name="effectiveFrom"
  value={formData.effectiveFrom}
  onChange={handleChange}
  className="fee-input"
/>



                 </div>



        {/* ADD FEE ITEM */}

        <div

          style={{

            marginTop: "30px",

            borderTop:
              "1px solid #eee",

            paddingTop: "20px"
          }}
        >

        </div>



        {/* ITEM LIST */}
<div style={{ marginTop:"30px" }}>

  <h3>Fee Items</h3>

  
  <table className="fee-table">

    <thead>

      <tr>

        <th>Fee Category</th>

        <th>Frequency</th>

        <th>Amount</th>

      </tr>

    </thead>

    <tbody>

      {formData.feeItems.map(
        (item,index)=>(
          <tr key={index}>

            <td>
              {item.title}
            </td>

            <td>
              {item.recurringType}
            </td>

            <td>

             <input
  type="number"
   className="amount-input"
  placeholder="Enter Amount"
  value={item.amount || ""}
                onChange={(e)=>{

                  const updated =
                    [...formData.feeItems];

                updated[index].amount =
  e.target.value;
                  setFormData({
                    ...formData,
                    feeItems: updated
                  });

                }}
              />

            </td>

          </tr>
        )
      )}

    </tbody>

  </table>

</div>
<div className="fee-summary-row">
  <div className="total-card">
    <div>
      <span className="total-label">
        Total Fee Structure
      </span>

      <h1>
        ₹{totalFee.toLocaleString()}
      </h1>
    </div>
  </div>
</div>
        {/* SAVE */}

       <button
  onClick={saveStructure}
  className="save-btn"
>

          Save Structure

        </button>

      </div>



      {/* STRUCTURES */}
  <div className="structure-header">
  <div>
    <h2>Fee Structure Overview</h2>
    <p>
      Manage all created fee structures
    </p>
  </div>

  <div className="structure-count">
    {structures.length} Structures
  </div>
</div>
      <div className="structure-grid">

      {

          loading && (
            <p>
              Loading...
            </p>
          )
        }



        {

          structures.map(
            (structure) => (

              <div  className="structure-card"

                key={structure._id}

              
              >

                <h3>
                  {
                    structure.structureName
                  }
                </h3>

<div className="structure-meta">

  <div>
    <label>Class</label>

    <strong>
      {structure.className}
    </strong>
  </div>

  <div>
    <label>Total Fee</label>

    <strong>
      ₹{
        structure.feeItems?.reduce(
          (sum,item)=>
            sum +
            Number(item.amount || 0),
          0
        ).toLocaleString()
      }
    </strong>
  </div>

  <div>
    <label>Status</label>

    <span className="active-badge">
      {structure.status}
    </span>
  </div>

</div>

                {
  structure.feeItems?.map(
    (item,index)=>(
      <div
        key={index}
        className="fee-item-row"
      >

        <span>
          {item.title}
        </span>

        <span>
          ₹{item.amount}
        </span>

      </div>
    )
  )
}

              </div>
            )
          )
        }

      </div>

    </div>
  );
};

export default FeeStructures;