import { useState, useEffect } from "react";
import API
from "../../services/api";

export default function Settings() {

  const [form, setForm] =
    useState({

      schoolName: "",

      udiseCode: "",

      principalName: "",

      email: "",

      phone: "",

      website: "",

      address: ""
    });

const [logo,setLogo] =
useState(null);

const [seal,setSeal] =
useState(null);

const [signature,setSignature] =
useState(null);

const fetchSettings =
async () => {

  try {

    const res =
      await API.get(
        "/settings"
      );

    const school =
      res.data.school || {};

    setForm({

      schoolName:
        school.schoolName || "",

      udiseCode:
        school.udiseCode || "",

      principalName:
        school.principalName || "",

      email:
        school.email || "",

      phone:
        school.phone || "",

      website:
        school.website || "",

      address:
        school.address || ""
    });

  } catch (err) {

    console.error(err);
  }
};

useEffect(() => {

  fetchSettings();

}, []);

const handleSubmit =
async (e) => {

  e.preventDefault();

  try {

    const formData =
      new FormData();

    Object.keys(form).forEach(
      (key) => {

        formData.append(
          key,
          form[key]
        );
      }
    );

    if (logo) {

      formData.append(
        "logo",
        logo
      );
    }

    if (seal) {

      formData.append(
        "schoolSeal",
        seal
      );
    }

    if (signature) {

      formData.append(
        "principalSignature",
        signature
      );
    }

    await API.put(

      "/settings",

      formData,

      {

        headers: {

          "Content-Type":
            "multipart/form-data"
        }
      }
    );

    alert(
      "Settings Saved Successfully"
    );

    fetchSettings();

  } catch (err) {

    console.error(err);

    alert(
      "Save Failed"
    );
  }
};

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
        e.target.value
      });
    };


  return (

    <div
      className="
        max-w-7xl
        mx-auto
        space-y-8
      "
    >

      {/* HEADER */}

      <div
        className="
          bg-gradient-to-r
          from-cyan-600
          to-blue-700
          rounded-3xl
          p-8
          text-white
          shadow-xl
        "
      >

        <h1
          className="
            text-4xl
            font-black
          "
        >
          School Settings
        </h1>

        <p
          className="
            mt-2
            text-cyan-100
          "
        >
          Manage school profile,
          branding and
          certificate settings.
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="
          space-y-8
        "
      >

        {/* SCHOOL INFORMATION */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-8
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-6
            "
          >
            School Information
          </h2>

          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >

            <div>

              <label
                className="
                  block
                  mb-2
                  font-semibold
                "
              >
                School Name
              </label>

              <input
                type="text"
                name="schoolName"
                value={form.schoolName}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  p-4
                "
              />

            </div>

            <div>

              <label
                className="
                  block
                  mb-2
                  font-semibold
                "
              >
                UDISE Code
              </label>

              <input
                type="text"
                name="udiseCode"
                value={form.udiseCode}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  p-4
                "
              />

            </div>

            <div>

              <label
                className="
                  block
                  mb-2
                  font-semibold
                "
              >
                Principal Name
              </label>

              <input
                type="text"
                name="principalName"
                value={form.principalName}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  p-4
                "
              />

            </div>

            <div>

              <label
                className="
                  block
                  mb-2
                  font-semibold
                "
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  p-4
                "
              />

            </div>

            <div>

              <label
                className="
                  block
                  mb-2
                  font-semibold
                "
              >
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  p-4
                "
              />

            </div>

            <div>

              <label
                className="
                  block
                  mb-2
                  font-semibold
                "
              >
                Website
              </label>

              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="
                  w-full
                  border
                  rounded-xl
                  p-4
                "
              />

            </div>

          </div>

          <div
            className="
              mt-6
            "
          >

            <label
              className="
                block
                mb-2
                font-semibold
              "
            >
              Address
            </label>

            <textarea
              rows="4"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="
                w-full
                border
                rounded-xl
                p-4
              "
            />

          </div>

        </div>

        {/* BRANDING */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-8
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-6
            "
          >
            School Branding
          </h2>

          <div
            className="
              grid
              md:grid-cols-3
              gap-6
            "
          >

            <div
              className="
                border-2
                border-dashed
                rounded-2xl
                p-8
                text-center
              "
            >

              <p className="font-semibold">
                School Logo
              </p>

              <input
  type="file"
  className="mt-4"
  onChange={(e) =>
    setLogo(
      e.target.files[0]
    )
  }
/>

            </div>

            <div
              className="
                border-2
                border-dashed
                rounded-2xl
                p-8
                text-center
              "
            >

              <p className="font-semibold">
                School Seal
              </p>
<input
  type="file"
  className="mt-4"
  onChange={(e) =>
    setSeal(
      e.target.files[0]
    )
  }
/>

            </div>

            <div
              className="
                border-2
                border-dashed
                rounded-2xl
                p-8
                text-center
              "
            >

              <p className="font-semibold">
                Principal Signature
              </p>

              <input
  type="file"
  className="mt-4"
  onChange={(e) =>
    setSignature(
      e.target.files[0]
    )
  }
/>

            </div>

          </div>

        </div>

        {/* TC SETTINGS */}

        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-8
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-6
            "
          >
            Transfer Certificate Settings
          </h2>

          <div
            className="
              grid
              md:grid-cols-3
              gap-6
            "
          >

            <div>

              <label className="block mb-2">
                TC Prefix
              </label>

              <input
                defaultValue="TC"
                className="
                  w-full
                  border
                  rounded-xl
                  p-4
                "
              />

            </div>

            <div>

              <label className="block mb-2">
                Watermark
              </label>

              <select
                className="
                  w-full
                  border
                  rounded-xl
                  p-4
                "
              >

                <option>
                  Enabled
                </option>

                <option>
                  Disabled
                </option>

              </select>

            </div>

            <div>

              <label className="block mb-2">
                QR Verification
              </label>

              <select
                className="
                  w-full
                  border
                  rounded-xl
                  p-4
                "
              >

                <option>
                  Enabled
                </option>

                <option>
                  Disabled
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* SAVE */}

        <div
          className="
            flex
            justify-end
          "
        >

          <button
            type="submit"
            className="
              px-8
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              text-white
              font-bold
              shadow-lg
            "
          >

            Save Configuration

          </button>

        </div>

      </form>

    </div>
  );
}