import instance from "./axios";

export const getCases = async () => {
  const res = await instance.get("/cases/my-cases");
  // console.log("cases of clerk :", res.data.cases);
  return res.data.cases;
};

export const createCase = async (data: {
  title: string;
  description?: string;
  clientId: number;
  hearingDate: string;
  courtName?: string;
  caseNumber?: string;
  priority?: string;
  status?: string;
}) => {
  const res = await instance.post("/cases/create-case", data);
  return res.data;
};

export const getCaseDetails = async (id: number) => {
  const res = await instance.get(`/cases/${id}/details`);
  return res.data;
};

export const assignClerk = async (caseId: number, clerkId: number) => {
  const res = await instance.patch(`/cases/${caseId}/assign`, {
    clerkId,
  });
  return res.data.case;
};

export const updateCase = async (
  caseId: number,
  data: any
) => {
  const res = await instance.put(`/cases/${caseId}`, data);

  return res.data;
};