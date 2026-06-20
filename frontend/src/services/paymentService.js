import api from "./api";



// ======================
// CREATE ORDER
// ======================

export const createPaymentOrder =
async (payload) => {

  const response =
    await api.post(

      "/payments/create-order",

      payload
    );

  return response.data;
};



// ======================
// VERIFY PAYMENT
// ======================

export const verifyPayment =
async (payload) => {

  const response =
    await api.post(

      "/payments/verify",

      payload
    );

  return response.data;
};