// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       setError("Email and password required");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       await login(email, password);

//       navigate("/"); // redirect to dashboard
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "100px auto" }}>
//       <h2>Login</h2>

//       <form onSubmit={handleSubmit}>
//         <div>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         <div style={{ marginTop: 10 }}>
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         {error && (
//           <p style={{ color: "red", marginTop: 10 }}>{error}</p>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           style={{ marginTop: 15 }}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;




import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login } =
    useAuth();

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (
        !email ||
        !password
      ) {
        setError(
          "Email and password required"
        );
        return;
      }

      try {
        setLoading(
          true
        );
        setError("");

        await login(
          email,
          password
        );

        navigate("/");
      } catch (
        err: any
      ) {
        setError(
          err?.response
            ?.data
            ?.message ||
            "Login failed"
        );
      } finally {
        setLoading(
          false
        );
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
            Login to your
            account
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(
              e
            ) =>
              setEmail(
                e.target
                  .value
              )
            }
            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />

          <input
            type="password"
            placeholder="Password"
            value={
              password
            }
            onChange={(
              e
            ) =>
              setPassword(
                e.target
                  .value
              )
            }
            className="w-full rounded-lg border border-[var(--border)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />

          {error && (
            <p className="text-sm text-[var(--danger)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={
              loading
            }
            className="w-full rounded-lg bg-[var(--primary)] py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Don’t have an
          account?{" "}
          <Link
            to="/register"
            className="font-medium text-[var(--primary)] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;