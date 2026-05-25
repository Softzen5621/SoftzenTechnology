// ======================================================
// GET TOKEN
// ======================================================

export const getToken = () => {

  return localStorage.getItem(
    "token"
  );
};

// ======================================================
// GET USER
// ======================================================

export const getUser = () => {

  try {

    return JSON.parse(

      localStorage.getItem(
        "user"
      )
    );

  } catch (error) {

    console.log(
      "USER PARSE ERROR:",
      error
    );

    return null;
  }
};

// ======================================================
// GET ROLE
// ======================================================

export const getRole = () => {

  return localStorage.getItem(
    "role"
  );
};

// ======================================================
// IS AUTHENTICATED
// ======================================================

export const isAuthenticated =
  () => {

    return !!getToken();
  };

// ======================================================
// LOGOUT
// ======================================================

export const logout =
  () => {

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

    window.location.replace(
      "/"
    );
  };