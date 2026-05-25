import {

  Navigate

} from "react-router-dom";

import {

  useAuth

} from "../context/AuthContext";

// ======================================================
// PROTECTED ROUTE
// ======================================================

export default function ProtectedRoute({

  children,

  allowedRoles = []

}) {

  // ======================================================
  // AUTH
  // ======================================================

  const {

    user,

    loading,

    isAuthenticated

  } = useAuth();

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-black
          text-white
          text-xl
        "
      >

        Loading...

      </div>
    );
  }

  // ======================================================
  // NOT LOGGED IN
  // ======================================================

  if (!isAuthenticated) {

    return (
      <Navigate
  to="/"
  replace
/>
    );
  }

  // ======================================================
  // ROLE CHECK
  // ======================================================

  if (

    allowedRoles.length > 0 &&

    !allowedRoles.includes(
      user?.role
    )
  ) {

    return (

      <div
        className="
          min-h-screen
          flex
          flex-col
          items-center
          justify-center
          bg-black
          text-white
          px-6
        "
      >

        <h1
          className="
            text-7xl
            mb-6
          "
        >
          🚫
        </h1>

        <h2
          className="
            text-3xl
            font-bold
            mb-3
          "
        >
          Access Denied
        </h2>

        <p
          className="
            text-slate-400
            text-center
            max-w-md
          "
        >
          You don't have permission
          to access this page.
        </p>

      </div>
    );
  }

  // ======================================================
  // ACCESS GRANTED
  // ======================================================

  return children;
}