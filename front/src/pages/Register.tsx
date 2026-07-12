// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { registerUser } from "../api/auth";

// const Register = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "LAWYER",
//   });

//   const [error, setError] = useState("");

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await registerUser(form);
//       navigate("/login");
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Register</h2>

//       <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}>

//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange}
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//         />

//         <select name="role" value={form.role} onChange={handleChange}>
//           <option value="LAWYER">Lawyer</option>
//           <option value="CLERK">Clerk</option>
//         </select>

//         <button type="submit">Register</button>

//         {error && <p style={{ color: "red" }}>{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default Register;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

const Register = () => {
  const navigate = useNavigate();

  interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: "LAWYER" | "CLERK";
    lawyerCode: string;
  }

  // const [form, setForm] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  //   role: "LAWYER",
  //   lawyerCode: "",
  // });

  const [form, setForm] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    role: "LAWYER",
    lawyerCode: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // const handleChange = (
  //   e:
  //     | React.ChangeEvent<HTMLInputElement>
  //     | React.ChangeEvent<HTMLSelectElement>,
  // ) => {
  //   setForm({
  //     ...form,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "role" ? (value as "LAWYER" | "CLERK") : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await registerUser(form);

      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md rounded-[var(--radius)] bg-[var(--card)] border border-[var(--border)] shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Tarikh
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="LAWYER">Lawyer</option>

            <option value="CLERK">Clerk</option>
          </select>

          {form.role === "CLERK" && (
            <input
              type="text"
              name="lawyerCode"
              placeholder="Lawyer ID (e.g. LAW-1)"
              value={form.lawyerCode}
              onChange={handleChange}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          )}

          {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--primary)] py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[var(--primary)] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
