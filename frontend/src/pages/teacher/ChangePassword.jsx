import {
  useState
} from "react";

import axios from "axios";

export default function ChangePassword() {

  // =========================
  // STATES
  // =========================

  const [form, setForm] =
    useState({

      currentPassword: "",

      newPassword: "",

      confirmPassword: ""
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value
      });

      setError("");

      setSuccess("");
    };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");

      setSuccess("");

      // VALIDATION
      if (

        !form.currentPassword ||

        !form.newPassword ||

        !form.confirmPassword

      ) {

        setError(
          "Please fill all fields"
        );

        return;
      }

      // MATCH CHECK
      if (

        form.newPassword !==
        form.confirmPassword

      ) {

        setError(
          "Passwords do not match"
        );

        return;
      }

      // PASSWORD LENGTH
      if (

        form.newPassword.length < 6

      ) {

        setError(
          "Password must be at least 6 characters"
        );

        return;
      }

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(

          `${import.meta.env.VITE_API_URL}/teachers/change-password`,

          {

            currentPassword:
              form.currentPassword,

            newPassword:
              form.newPassword
          },

          {

            headers: {

              Authorization:
                `Bearer ${token}`
            }
          }
        );

        setSuccess(
          "Password changed successfully"
        );

        // REDIRECT
        setTimeout(() => {

          window.location.replace(
            "/teacher");

        }, 1500);

      } catch (err) {

        console.error(err);

        setError(

          err?.response?.data?.msg ||

          "Password update failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        px-4
        relative
        overflow-hidden
      "
    >

      {/* BG EFFECTS */}
      <div
        className="
          absolute
          top-[-200px]
          left-[-100px]
          w-[500px]
          h-[500px]
          bg-blue-600/20
          blur-[120px]
          rounded-full
        "
      />

      <div
        className="
          absolute
          bottom-[-200px]
          right-[-100px]
          w-[500px]
          h-[500px]
          bg-cyan-500/20
          blur-[120px]
          rounded-full
        "
      />

      {/* CARD */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          bg-white/5
          backdrop-blur-2xl
          border
          border-white/10
          rounded-[40px]
          shadow-[0_0_80px_rgba(0,0,0,0.8)]
          p-10
        "
      >

        {/* HEADER */}
        <div
          className="
            text-center
            mb-10
          "
        >

          <h1
            className="
              text-4xl
              font-black
              text-white
            "
          >
            Change Password
          </h1>

          <p
            className="
              text-slate-400
              mt-3
            "
          >
            First login security update
          </p>

        </div>

        {/* ERROR */}
        {
          error && (

            <div
              className="
                mb-5
                p-4
                rounded-2xl
                bg-red-500/10
                border
                border-red-500/20
                text-red-400
              "
            >
              {error}
            </div>
          )
        }

        {/* SUCCESS */}
        {
          success && (

            <div
              className="
                mb-5
                p-4
                rounded-2xl
                bg-green-500/10
                border
                border-green-500/20
                text-green-400
              "
            >
              {success}
            </div>
          )
        }

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="
            space-y-5
          "
        >

          {/* CURRENT PASSWORD */}
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={handleChange}
            className="
              w-full
              p-5
              rounded-2xl
              bg-white/5
              border
              border-white/10
              text-white
              placeholder-slate-500
              outline-none
              focus:border-blue-500
            "
          />

          {/* NEW PASSWORD */}
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="
              w-full
              p-5
              rounded-2xl
              bg-white/5
              border
              border-white/10
              text-white
              placeholder-slate-500
              outline-none
              focus:border-cyan-500
            "
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="
              w-full
              p-5
              rounded-2xl
              bg-white/5
              border
              border-white/10
              text-white
              placeholder-slate-500
              outline-none
              focus:border-cyan-500
            "
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              p-5
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              text-white
              font-bold
              text-lg
              hover:scale-[1.02]
              transition
              shadow-[0_0_40px_rgba(59,130,246,0.5)]
            "
          >

            {
              loading

                ? "Updating Password..."

                : "Update Password"
            }

          </button>

        </form>

      </div>
    </div>
  );
}