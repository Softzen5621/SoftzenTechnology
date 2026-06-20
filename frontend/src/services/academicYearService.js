import API from "./api";

export const getAcademicYears =
async () => {

  const res =
  await API.get(
    "/academic-years/all"
  );

  return res.data;
};

export const activateAcademicYear =
async (id) => {

  const res =
  await API.put(
    `/academic-years/activate/${id}`
  );

  return res.data;
};

export const cloneStructure =
async (
  sourceYearId,
  targetYearId
) => {

  const res =
  await API.post(
    `/academic-years/clone-structure/${sourceYearId}`,
    {
      targetYearId
    }
  );

  return res.data;
};