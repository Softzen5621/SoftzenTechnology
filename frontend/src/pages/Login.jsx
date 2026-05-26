import {
  useEffect,
  useState
} from "react";

import API from "../services/api";
import.meta.env.VITE_API_URL

import socket
from "../services/socket";

import {

  useAuth

} from "../context/AuthContext";


export default function Login() {
const {

  login

} = useAuth();
  // =========================
  // STATES
  // =========================

  const [form, setForm] =
  useState({

    loginId: "",

    password: "",

    schoolId: ""
  });
  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [capsLock, setCapsLock] =
    useState(false);

  const [time, setTime] =
    useState(new Date());

    const [selectedRole, setSelectedRole] =
  useState("admin");

  const [showForgotPassword, setShowForgotPassword] =
  useState(false);

const [otpSent, setOtpSent] =
  useState(false);

const [forgotForm, setForgotForm] =
  useState({

    email: "",

    schoolId: "",

    otp: "",

    newPassword: ""
  });

const [success, setSuccess] =
  useState("");

  // =========================
  // LIVE CLOCK
  // =========================

  useEffect(() => {

    const interval =
      setInterval(() => {

        setTime(new Date());

      }, 1000);

    return () =>
      clearInterval(interval);

  }, []);

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
    };

  // =========================
  // CAPS LOCK DETECT
  // =========================

  const handleCapsLock =
    (e) => {

      setCapsLock(

        e.getModifierState(
          "CapsLock"
        )
      );
    };

    // =========================
// FORGOT CHANGE
// =========================

const handleForgotChange =
  (e) => {

    setForgotForm({

      ...forgotForm,

      [e.target.name]:
        e.target.value
    });
  };

// =========================
// SEND OTP
// =========================

const handleSendOtp =
  async () => {
    if (

  selectedRole === "student"

) {

  setError(
    "Student recovery coming soon"
  );

  return;
}

    try {

      setLoading(true);

      setError("");

      setSuccess("");

    await API.post(
  `/auth/${selectedRole}-forgot-password`,
        {

          email:
            forgotForm.email,

          schoolId:
            forgotForm.schoolId
        }
      );

      setOtpSent(true);

      setSuccess(
        "OTP sent successfully"
      );

    } catch (err) {

      setError(

        err?.response?.data?.msg ||

        "Failed to send OTP"
      );

    } finally {

      setLoading(false);
    }
  };

// =========================
// RESET PASSWORD
// =========================

const handleResetPassword =
  async () => {

    try {

      setLoading(true);

      setError("");

      setSuccess("");

      await API.post(
  `/auth/${selectedRole}-reset-password`,

        {

          email:
            forgotForm.email,

          schoolId:
            forgotForm.schoolId,

          otp:
            forgotForm.otp,

          newPassword:
            forgotForm.newPassword
        }
      );

      setSuccess(
        "Password reset successful"
      );

      setTimeout(() => {

        setShowForgotPassword(false);

        setOtpSent(false);

      }, 1500);

    } catch (err) {

      setError(

        err?.response?.data?.msg ||

        "Reset failed"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================
const handleLogin =
  async () => {

    setError("");

    if (

      !form.loginId ||

      !form.password ||

      !form.schoolId

    ) {

      setError(
        "Please fill all fields"
      );

      return;
    }

    try {

      setLoading(true);

      let res;

      // ====================================
      // ADMIN LOGIN
      // ====================================

      if (
        selectedRole === "admin"
      ) {

        res =
         await API.post(
  `/auth/login`,

            {

              email:
                form.loginId,

              password:
                form.password,

              schoolId:
                form.schoolId
            }
          );
      }

      // ====================================
      // TEACHER LOGIN
      // ====================================

      else if (
        selectedRole === "teacher"
      ) {

        res =
          await API.post(
  `/auth/teacher-login`,

            {

              employeeId:
                form.loginId,

              password:
                form.password,

              schoolId:
                form.schoolId
            }
          );
      }

      // ====================================
      // PARENT LOGIN
      // ====================================

      else if (
        selectedRole === "parent"
      ) {

        res =
          await API.post(
  `/auth/parent-login`,

            {

              email:
                form.loginId,

              password:
                form.password,

              schoolId:
                form.schoolId
            }
          );
      }

      // ====================================
      // STUDENT LOGIN
      // ====================================

      else {

        setError(
          "Student not found"
        );

        return;
      }

      // ====================================
      // USER DATA
      // ====================================

      const userData =

        res.data.user ||

        res.data.teacher ||

        res.data.parent;

      // ====================================
      // SAVE AUTH
      // ====================================

      login({

        token:
          res.data.token,

        role:
          userData.role,

        schoolId:
          userData.schoolId,

        name:

          userData.name ||

          userData.fullName ||

          userData.fatherName,

        ...userData
      });

      // ====================================
// SOCKET JOIN
// ====================================

socket.emit(

  "join",

  userData._id
);

      // ====================================
      // REDIRECTS
      // ====================================

      if (

        userData.role ===
        "super_admin"

      ) {

        window.location.replace(
          "/super-admin"
        );

      } else if (

        userData.role ===
        "admin"

      ) {

        window.location.replace(
          "/admin"
        );

      } else if (

        userData.role ===
        "teacher"

      ) {

        window.location.replace(
          "/teacher/dashboard"
        );

      } else if (

        userData.role ===
        "parent"

      ) {

        window.location.replace(
          "/parent/dashboard"
        );

      } else if (

        userData.role ===
        "student"

      ) {

        window.location.replace(
          "/student/dashboard"
        );

      }

    } catch (err) {

      console.error(err);

      setError(

        err?.response?.data?.msg ||

        "Login Failed ❌"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // ENTER KEY LOGIN
  // =========================

  const handleKeyDown =
    (e) => {

      if (e.key === "Enter") {

        handleLogin();
      }
    };

  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-black
        flex
        items-center
        justify-center
      "
    >

      {/* BACKGROUND */}
      <div
        className="
          absolute
          inset-0
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            top-[-200px]
            left-[-100px]
            w-[500px]
            h-[500px]
            bg-blue-600/30
            blur-[120px]
            rounded-full
            animate-pulse
          "
        />

        <div
          className="
            absolute
            bottom-[-200px]
            right-[-100px]
            w-[500px]
            h-[500px]
            bg-purple-600/30
            blur-[120px]
            rounded-full
            animate-pulse
          "
        />

        <div
          className="
            absolute
            top-[30%]
            left-[40%]
            w-[300px]
            h-[300px]
            bg-cyan-500/20
            blur-[100px]
            rounded-full
          "
        />

      </div>

      {/* GRID */}
      <div
        className="
          absolute
          inset-0
          opacity-10
        "
        style={{

          backgroundImage:
            `
            linear-gradient(
              rgba(255,255,255,0.1) 1px,
              transparent 1px
            ),

            linear-gradient(
              90deg,
              rgba(255,255,255,0.1) 1px,
              transparent 1px
            )
          `,

          backgroundSize:
            "50px 50px"
        }}
      />

      {/* MAIN */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-7xl
          grid
          lg:grid-cols-2
          rounded-[40px]
          overflow-hidden
          border
          border-white/10
          shadow-[0_0_80px_rgba(0,0,0,0.8)]
          backdrop-blur-2xl
          bg-white/5
        "
      >

        {/* LEFT */}
        <div
          className="
            hidden
            lg:flex
            flex-col
            justify-between
            p-16
            border-r
            border-white/10
          "
        >

          <div>

            {/* LOGO */}
            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              

             <div>
                <div
  className="
    flex
    items-center
    gap-5
  "
>

  {/* Animated Logo */}
  <div
    className="
      flex items-center gap-2
      bg-black/30
      border border-white/10
      px-4 py-3
      rounded-3xl
      backdrop-blur-xl
      shadow-[0_0_30px_rgba(0,0,0,0.5)]
    "
  >

    {/* S */}
    <div className="
      w-11 h-11 rounded-2xl
      bg-[#4285F4]
      flex items-center justify-center
      text-white text-xl font-black
      shadow-lg shadow-blue-500/40
      hover:scale-110 hover:-translate-y-1
      transition-all duration-300
      cursor-pointer
    ">
      S
    </div>

    {/* O */}
    <div className="
      w-11 h-11 rounded-full
      bg-[#EA4335]
      flex items-center justify-center
      text-white text-xl font-black
      shadow-lg shadow-red-500/40
      hover:scale-110 hover:rotate-6
      transition-all duration-300
      cursor-pointer
    ">
      O
    </div>

    {/* F */}
    <div className="
      w-11 h-11 rounded-2xl
      bg-[#FBBC05]
      flex items-center justify-center
      text-white text-xl font-black
      shadow-lg shadow-yellow-500/40
      hover:scale-110 hover:-translate-y-1
      transition-all duration-300
      cursor-pointer
    ">
      F
    </div>

    {/* T */}
    <div className="
      w-11 h-11 rounded-full
      bg-[#34A853]
      flex items-center justify-center
      text-white text-xl font-black
      shadow-lg shadow-green-500/40
      hover:scale-110 hover:rotate-[-6deg]
      transition-all duration-300
      cursor-pointer
    ">
      T
    </div>

    {/* Z */}
    <div className="
      w-11 h-11 rounded-2xl
      bg-[#4285F4]
      flex items-center justify-center
      text-white text-xl font-black
      shadow-lg shadow-blue-500/40
      hover:scale-110 hover:-translate-y-1
      transition-all duration-300
      cursor-pointer
    ">
      Z
    </div>

    {/* E */}
    <div className="
      w-11 h-11 rounded-full
      bg-[#EA4335]
      flex items-center justify-center
      text-white text-xl font-black
      shadow-lg shadow-red-500/40
      hover:scale-110 hover:rotate-6
      transition-all duration-300
      cursor-pointer
    ">
      E
    </div>

    {/* N */}
    <div className="
      w-11 h-11 rounded-2xl
      bg-[#FBBC05]
      flex items-center justify-center
      text-white text-xl font-black
      shadow-lg shadow-yellow-500/40
      hover:scale-110 hover:-translate-y-1
      transition-all duration-300
      cursor-pointer
    ">
      N
    </div>

  </div>

 </div>

                <p
                  className="
                    text-slate-400
                    mt-2
                  "
                >
                Enterprise Multi-School Platform
                </p>

              </div>
            </div>

            {/* STATS */}
            <div
              className="
                mt-20
                grid
                grid-cols-2
                gap-6
              "
            >

              <div
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-3xl
                  p-6
                "
              >
                <h2
                  className="
                    text-5xl
                    font-bold
                    text-white
                  "
                >
                  12K+
                </h2>

                <p
                  className="
                    text-slate-400
                    mt-3
                  "
                >
                  Active Students
                </p>
              </div>

              <div
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-3xl
                  p-6
                "
              >
                <h2
                  className="
                    text-5xl
                    font-bold
                    text-cyan-400
                  "
                >
                  28+
                </h2>

                <p
                  className="
                    text-slate-400
                    mt-3
                  "
                >
                  Connected Schools
                </p>
              </div>

              <div
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-3xl
                  p-6
                "
              >
                <h2
                  className="
                    text-5xl
                    font-bold
                    text-green-400
                  "
                >
                  99.9%
                </h2>

                <p
                  className="
                    text-slate-400
                    mt-3
                  "
                >
                  Server Uptime
                </p>
              </div>

              <div
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-3xl
                  p-6
                "
              >
                <h2
                  className="
                    text-5xl
                    font-bold
                    text-purple-400
                  "
                >
                  AI
                </h2>

                <p
                  className="
                    text-slate-400
                    mt-3
                  "
                >
                  Powered ERP
                </p>
              </div>

            </div>
          </div>

          {/* BOTTOM */}
          <div
            className="
              flex
              gap-4
              flex-wrap
            "
          >

            <div
              className="
                px-5
                py-3
                rounded-2xl
                bg-white/5
                border
                border-white/10
                text-slate-300
              "
            >
              🔐 JWT Secured
            </div>

            <div
              className="
                px-5
                py-3
                rounded-2xl
                bg-white/5
                border
                border-white/10
                text-slate-300
              "
            >
              ☁ Cloud Sync
            </div>

            <div
              className="
                px-5
                py-3
                rounded-2xl
                bg-white/5
                border
                border-white/10
                text-slate-300
              "
            >
              📊 Audit Logs
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div
          className="
            p-8
            lg:p-16
            flex
            items-center
            justify-center
          "
        >

          <div
            className="
              w-full
              max-w-md
            "
          >

            {/* TOP */}
            <div
              className="
                flex
                items-center
                justify-between
                mb-10
              "
            >

              <div>

                <h2
                  className="
                    text-5xl
                    font-black
                    text-white
                  "
                >
                  Login
                </h2>

                <p
                  className="
                    text-slate-400
                    mt-2
                  "
                >
                  Access your dashboard
                </p>

              </div>

              <div
                className="
                  text-right
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    justify-end
                  "
                >

                  <div
                    className="
                      w-3
                      h-3
                      rounded-full
                      bg-green-400
                      animate-pulse
                    "
                  />

                  <span
                    className="
                      text-green-400
                      text-sm
                    "
                  >
                    Server Live
                  </span>

                </div>

                <p
                  className="
                    text-slate-500
                    text-xs
                    mt-2
                  "
                >
                  {
                    time.toLocaleTimeString()
                  }
                </p>

              </div>
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
            <div
              className="
                space-y-5
              "
            >

              {/* LOGIN ID */}
<input
  type="text"
  name="loginId"
  placeholder={

  selectedRole === "teacher"

    ? "Employee ID"

    : selectedRole === "parent"

    ? "Parent Email"

    : selectedRole === "student"

    ? "Student ID"

    : "Admin ID"
}
  value={form.loginId}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
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

              {/* PASSWORD */}
              <div
                className="
                  relative
                "
              >

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  name="password"

                  placeholder="Password"

                  value={form.password}

                  onChange={handleChange}

                  onKeyDown={
                    handleKeyDown
                  }

                  onKeyUp={
                    handleCapsLock
                  }

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

                <button
                  type="button"

                  onClick={() =>

                    setShowPassword(
                      !showPassword
                    )
                  }

                  className="
                    absolute
                    right-5
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >
                  {
                    showPassword
                      ? "🙈"
                      : "👁"
                  }
                </button>

              </div>

              {/* CAPS LOCK */}
              {
                capsLock && (

                  <div
                    className="
                      text-yellow-400
                      text-sm
                    "
                  >
                    Caps Lock is ON
                  </div>
                )
              }

              {/* SCHOOL */}
              <input
                type="text"
                name="schoolId"
                placeholder="School Code"
                value={form.schoolId}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
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

              {/* OPTIONS */}
              <div
                className="
                  flex
                  justify-between
                  items-center
                  text-sm
                "
              >

                <label
                  className="
                    flex
                    items-center
                    gap-2
                    text-slate-400
                  "
                >

                  <input
                    type="checkbox"
                  />

                  Remember me
                </label>

                <button

  type="button"

  onClick={() =>
    setShowForgotPassword(
      !showForgotPassword
    )
  }

  className="
    text-blue-400
  "
>
  {

    showForgotPassword

      ? "Back To Login"

      : "Forgot Password?"
  }
</button>

              </div>
       
              {/* BUTTON */}
              <button

               onClick={() => {

  if (!loading) {

    handleLogin();
  }
}}
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
                  active:scale-[0.98]
duration-200
disabled:opacity-70
disabled:cursor-not-allowed
                  transition
                  shadow-[0_0_40px_rgba(59,130,246,0.5)]
                "
              >

                {
  loading

    ? "Authenticating..."

    : "Secure Login"
}
              </button>

              {/* ROLE CARDS */}
              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                  pt-4
                "
              >

               <button

 onClick={() => {

  setSelectedRole(
    "admin"
  );

  setOtpSent(false);

  setShowForgotPassword(false);

  setError("");

  setSuccess("");
}}
  className={`
    p-4
    rounded-2xl
    border
    text-center
    transition

    ${

      selectedRole === "admin"

        ? "bg-blue-600 border-blue-500 text-white"

        : "bg-white/5 border-white/10 text-slate-300"
    }
  `}
>
  Admin
</button>

                <button

 onClick={() => {

  setSelectedRole(
    "teacher"
  );

  setOtpSent(false);

  setShowForgotPassword(false);

  setError("");

  setSuccess("");
}}

  className={`
    p-4
    rounded-2xl
    border
    text-center
    transition

    ${

      selectedRole === "teacher"

        ? "bg-cyan-600 border-cyan-500 text-white"

        : "bg-white/5 border-white/10 text-slate-300"
    }
  `}
>
  Teacher
</button>
               <button

  onClick={() => {

  setSelectedRole(
    "student"
  );

  setOtpSent(false);

  setShowForgotPassword(false);

  setError("");

  setSuccess("");
}}
  className={`
    p-4
    rounded-2xl
    border
    text-center
    transition

    ${

      selectedRole === "student"

        ? "bg-purple-600 border-purple-500 text-white"

        : "bg-white/5 border-white/10 text-slate-300"
    }
  `}
>
  Student
</button>
                <button

  onClick={() => {

  setSelectedRole(
    "parent"
  );

  setOtpSent(false);

  setShowForgotPassword(false);

  setError("");

  setSuccess("");
}}
  className={`
    p-4
    rounded-2xl
    border
    text-center
    transition

    ${

      selectedRole === "parent"

        ? "bg-green-600 border-green-500 text-white"

        : "bg-white/5 border-white/10 text-slate-300"
    }
  `}
>
  Parent
</button>
              </div>

            </div>

            {/* FOOTER */}
{
  showForgotPassword && (

    <div
      className="
        fixed
        inset-0
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
        p-5
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-[#0B0F19]
          border
          border-white/10
          rounded-3xl
          p-6
          animate-in
          fade-in
          zoom-in
          duration-200
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
                text-white
              "
            >
              Reset Password
            </h2>

            <p
              className="
                text-slate-400
                text-sm
              "
            >
              {
  selectedRole === "teacher"

    ? "Teacher account recovery"

    : selectedRole === "student"

    ? "Student account recovery"

    : selectedRole === "admin"

    ? "Admin account recovery"

    : "Parent account recovery"
}
            </p>

          </div>

          <button

            type="button"

            onClick={() => {

              setShowForgotPassword(false);

              setOtpSent(false);
            }}

            className="
              text-slate-400
              text-2xl
            "
          >
            ×
          </button>

        </div>

        {/* INPUTS */}

        <div
          className="
            space-y-4
          "
        >

          <input
            type="email"
            name="email"
           placeholder={

  selectedRole === "teacher"

    ? "Teacher ID"

    : selectedRole === "student"

    ? "Student ID"

    : selectedRole === "admin"

    ? "Admin Email"

    : "Parent Email"
}
            value={forgotForm.email}
            onChange={handleForgotChange}
            className="
              w-full
              p-4
              rounded-2xl
              bg-white/5
              border
              border-white/10
              text-white
            "
          />

          <input
            type="text"
            name="schoolId"
            placeholder="School ID"
            value={forgotForm.schoolId}
            onChange={handleForgotChange}
            className="
              w-full
              p-4
              rounded-2xl
              bg-white/5
              border
              border-white/10
              text-white
            "
          />

          {

            otpSent && (

              <>

                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={forgotForm.otp}
                  onChange={handleForgotChange}
                  className="
                    w-full
                    p-4
                    rounded-2xl
                    bg-white/5
                    border
                    border-white/10
                    text-white
                  "
                />

                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={forgotForm.newPassword}
                  onChange={handleForgotChange}
                  className="
                    w-full
                    p-4
                    rounded-2xl
                    bg-white/5
                    border
                    border-white/10
                    text-white
                  "
                />

              </>
            )
          }

          {

            !otpSent

              ? (

               <button

  type="button"

  disabled={loading}

  onClick={() => {

    if (!loading) {

      handleSendOtp();
    }
  }}

  className="
    relative
    overflow-hidden
    w-full
    p-4
    rounded-2xl

    bg-gradient-to-r
    from-blue-600
    via-cyan-500
    to-blue-600

    bg-[length:200%_200%]

    text-white
    font-bold
    text-lg

    shadow-[0_0_35px_rgba(59,130,246,0.45)]

    transition-all
    duration-300

    hover:scale-[1.02]
    hover:shadow-[0_0_55px_rgba(34,211,238,0.7)]

    active:scale-[0.97]

    disabled:opacity-70
    disabled:cursor-not-allowed

    animate-gradient-x
  "
>

  {/* GLOW EFFECT */}

  <div
    className="
      absolute
      inset-0
      bg-white/10
      opacity-0
      hover:opacity-100
      transition
      duration-300
    "
  />

  {/* TEXT */}

  <div
    className="
      relative
      z-10
      flex
      items-center
      justify-center
      gap-3
    "
  >

    {

      loading

        ? (

          <>

            <div
              className="
                w-5
                h-5
                border-2
                border-white/40
                border-t-white
                rounded-full
                animate-spin
              "
            />

            Sending OTP...
          </>
        )

        : (

          <>
            Send OTP
          </>
        )
    }

  </div>

</button>            )

              : (

                <button

                  type="button"

                  onClick={handleResetPassword}

                  className="
                    w-full
                    p-4
                    rounded-2xl
                    bg-gradient-to-r
                    from-green-600
                    to-emerald-500
                    text-white
                    font-bold
                  "
                >
                  Reset Password
                </button>
              )
          }

        </div>

      </div>

    </div>
  )
}
            
            <div
              className="
                mt-10
                text-center
                text-slate-500
                text-sm
              "
            >
              SoftZen ERP © 2021 • Enterprise Edition
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}