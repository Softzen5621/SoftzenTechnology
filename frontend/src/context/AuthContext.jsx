import {

  createContext,

  useContext,

  useEffect,

  useState

} from "react";

// ======================================================
// CREATE CONTEXT
// ======================================================

const AuthContext =
  createContext();

// ======================================================
// PROVIDER
// ======================================================

export function AuthProvider({

  children

}) {

  // ======================================================
  // STATES
  // ======================================================

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // LOAD AUTH
  // ======================================================

  useEffect(() => {

    try {

      // ==========================================
      // GET ERP AUTH
      // ==========================================

      const savedAuth =

        localStorage.getItem(
          "erp_auth"
        );

      // ==========================================
      // IF AUTH EXISTS
      // ==========================================

      if (savedAuth) {

        const parsedAuth =

          JSON.parse(
            savedAuth
          );

        // ======================================
        // SET USER
        // ======================================

        if (
          parsedAuth?.user
        ) {

          setUser(
            parsedAuth.user
          );
        }

        // ======================================
        // SET TOKEN
        // ======================================

        if (
          parsedAuth?.token
        ) {

          setToken(
            parsedAuth.token
          );
        }
      }

    } catch (error) {

      console.log(
        "AUTH LOAD ERROR:",
        error
      );

      // ======================================
      // CLEAR BROKEN AUTH
      // ======================================

      localStorage.removeItem(
        "erp_auth"
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "schoolId"
      );
    }

    setLoading(false);

  }, []);

  // ======================================================
  // LOGIN
  // ======================================================

  const login = (data) => {

    console.log(
      "LOGIN DATA:",
      data
    );

    // ==========================================
    // USER OBJECT
    // ==========================================

    const userData = {

      _id:

        data._id ||

        data.user?._id ||

        "",

      name:

        data.name ||

        data.fullName ||

        data.user?.name ||

        data.user?.fullName ||

        "User",

      email:

        data.email ||

        data.user?.email ||

        "",

      role:

        data.role ||

        data.user?.role ||

        "",

      schoolId:

        data.schoolId ||

        data.user?.schoolId ||

        ""
    };

    // ==========================================
    // AUTH OBJECT
    // ==========================================

    const authData = {

      token:
        data.token,

      user:
        userData
    };

    // ==========================================
    // SAVE COMPLETE AUTH
    // ==========================================

    localStorage.setItem(

      "erp_auth",

      JSON.stringify(
        authData
      )
    );

    // ==========================================
    // OPTIONAL SUPPORT
    // ==========================================

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "role",
      userData.role
    );

    localStorage.setItem(
      "schoolId",
      userData.schoolId
    );

    // ==========================================
    // UPDATE STATE
    // ==========================================

    setToken(
      data.token
    );

    setUser(
      userData
    );
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {

    // ==========================================
    // CLEAR STORAGE
    // ==========================================

    localStorage.removeItem(
      "erp_auth"
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "schoolId"
    );

    sessionStorage.clear();

    // ==========================================
    // CLEAR STATE
    // ==========================================

    setUser(null);

    setToken(null);

    // ==========================================
    // REDIRECT
    // ==========================================

    window.location.replace(
      "/"
    );
  };

  // ======================================================
  // VALUES
  // ======================================================

  const value = {

    user,

    token,

    loading,

    login,

    logout,

    role:
      user?.role ||

      null,

    schoolId:
      user?.schoolId ||

      null,

    isAuthenticated:
      !!token
  };

  // ======================================================
  // PROVIDER
  // ======================================================

  return (

    <AuthContext.Provider
      value={value}
    >

      {children}

    </AuthContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useAuth() {

  return useContext(
    AuthContext
  );
}