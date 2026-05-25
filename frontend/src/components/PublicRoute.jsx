import {

  Navigate

} from "react-router-dom";

import {

  useAuth

} from "../context/AuthContext";

// ======================================================
// PUBLIC ROUTE
// ======================================================

export default function PublicRoute({

  children

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

    return children;
  }

  // ======================================================
  // ROLE BASED REDIRECT
  // ======================================================

  if (

    user?.role ===
    "super_admin"

  ) {

    return (
      <Navigate
        to="/super-admin"
        replace
      />
    );
  }

  if (

    user?.role ===
    "admin"

  ) {

    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  if (

    user?.role ===
    "teacher"

  ) {

    return (
      <Navigate
        to="/teacher"
        replace
      />
    );
  }

  if (

    user?.role ===
    "student"

  ) {

    return (
      <Navigate
        to="/student"
        replace
      />
    );
  }

  if (

    user?.role ===
    "parent"

  ) {

    return (
      <Navigate
        to="/parent"
        replace
      />
    );
  }

  // ======================================================
  // DEFAULT
  // ======================================================

  return children;
}