import api from "../services/api";


// =========================================
// GET NOTICES
// =========================================

export const getNotices =
  async () => {

    const response =
      await api.get(
        "/notices"
      );

    return response.data;
  };


// =========================================
// MARK NOTICE VIEWED
// =========================================

export const markNoticeViewed =
  async (id) => {

    const response =
      await api.put(
        `/notices/view/${id}`
      );

    return response.data;
  };


// =========================================
// ACKNOWLEDGE NOTICE
// =========================================

export const acknowledgeNotice =
  async (id) => {

    const response =
      await api.put(
        `/notices/acknowledge/${id}`
      );

    return response.data;
  };


// =========================================
// CREATE NOTICE
// =========================================

export const createNotice =
  async (data) => {

    const response =
      await api.post(

        "/notices/create",

        data
      );

    return response.data;
  };


// =========================================
// UPDATE NOTICE
// =========================================

export const updateNotice =
  async (
    id,
    data
  ) => {

    const response =
      await api.put(

        `/notices/${id}`,

        data
      );

    return response.data;
  };


// =========================================
// DELETE NOTICE
// =========================================

export const deleteNotice =
  async (id) => {

    const response =
      await api.delete(
        `/notices/${id}`
      );

    return response.data;
  };


// =========================================
// CLOSE NORMAL NOTICE
// =========================================

export const closeNotice =
  (id) => {

    localStorage.setItem(

      `closed_notice_${id}`,

      "true"
    );
  };


// =========================================
// CHECK CLOSED NOTICE
// =========================================

export const isNoticeClosed =
  (id) => {

    return localStorage.getItem(

      `closed_notice_${id}`

    );
  };


// =========================================
// CLOSE POPUP
// =========================================

export const closePopupNotice =
  (id) => {

    localStorage.setItem(

      `popup_closed_${id}`,

      "true"
    );
  };


// =========================================
// CHECK POPUP CLOSED
// =========================================

export const isPopupClosed =
  (id) => {

    return localStorage.getItem(

      `popup_closed_${id}`

    );
  };


// =========================================
// RESET CLOSED NOTICE
// =========================================

export const resetClosedNotice =
  (id) => {

    localStorage.removeItem(

      `closed_notice_${id}`
    );
  };


// =========================================
// RESET POPUP NOTICE
// =========================================

export const resetPopupNotice =
  (id) => {

    localStorage.removeItem(

      `popup_closed_${id}`
    );
  };


// =========================================
// RESET ALL NOTICES
// =========================================

export const resetAllNotices =
  () => {

    Object.keys(
      localStorage
    ).forEach((key) => {

      if (

        key.startsWith(
          "closed_notice_"
        ) ||

        key.startsWith(
          "popup_closed_"
        )
      ) {

        localStorage.removeItem(
          key
        );
      }
    });
  };