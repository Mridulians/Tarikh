import instance from "./axios";

export const getClerks = async () => {
  const res = await instance.get("/users/clerks");
  return res.data.clerks;
};