import axios from "./axios";

// 🔐 LOGIN
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post("/auth/login", data);
  return res.data;
};

// 📝 REGISTER
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: "LAWYER" | "CLERK";
}) => {
  const res = await axios.post("/auth/register", data);
  return res.data;
};

// 👤 GET CURRENT USER
export const getMe = async () => {
  const res = await axios.get("/auth/me");
  return res.data;
};