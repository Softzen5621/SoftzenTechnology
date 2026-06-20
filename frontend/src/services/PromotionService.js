import API from "./api";

export const previewPromotion =
async () => {

  const res =
  await API.post(
  "/promotions/preview"
);
  return res.data;
};

export const promoteSchool =
async () => {

  const res =
 await API.post(
  "/promotions/school"
);
  return res.data;
};

//comment for check github delete