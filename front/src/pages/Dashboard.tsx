// import { useAuth } from "../hooks/useAuth";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
// const { user, logout } = useAuth();

//   // console.log(user)
//   // console.log(user.user.name)
//   const navigate = useNavigate();

//   if (!user) return <div>No user found</div>;

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Dashboard</h2>

//       <div style={{ marginBottom: "20px" }}>
//         <p><strong>Name:</strong> {user.user.name}</p>
//         <p><strong>Email:</strong> {user.user.email}</p>
//         <p><strong>Role:</strong> {user.user.role}</p>
//         <p><strong>Unique Id:</strong> {user.user.id}</p>
//       </div>

//       <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//         <button onClick={() => navigate("/clients")}>
//           Go to Clients
//         </button>

//         <button onClick={() => navigate("/cases")}>
//           Go to Cases
//         </button>
//       </div>

//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState } from "react";
import { FiBriefcase, FiCheckCircle, FiClock, FiUsers } from "react-icons/fi";

import { useAuth } from "../hooks/useAuth";

import { getCases } from "../api/cases";
import { getClients } from "../api/clients";

const Dashboard = () => {
  const { user } = useAuth();

  const [cases, setCases] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showProfile, setShowProfile] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const casesRes = await getCases();

        // console.log("cases of clerk :", casesRes);

        setCases(casesRes || []);

        // clerk shouldn't call clients API
        if (user?.role !== "CLERK") {
          const clientsRes = await getClients();
          setClients(clientsRes || []);
        } else {
          setClients([]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-lg font-semibold">Loading Dashboard...</div>
    );
  }

  const totalCases = cases.length;

  // console.log(totalCases);

  const openCases = cases.filter((c) => c.status === "OPEN").length;

  const closedCases = cases.filter((c) => c.status === "CLOSED").length;

  const totalClients = clients.length;

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen">
      {/* HEADER */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Welcome back, {user?.user?.name}
          </h1>

          <p className="text-[var(--text-secondary)] mt-1">
            Manage your legal cases efficiently.
          </p>
        </div>

        {/* <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
          {user?.user?.name?.charAt(0)}
        </div> */}

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg hover:opacity-90 transition"
          >
            {user?.user?.name?.charAt(0)?.toUpperCase()}
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-[var(--border)] bg-white shadow-xl p-5 z-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {user?.user?.name?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {user?.user?.name}
                  </h3>

                  <p className="text-sm text-[var(--text-secondary)]">
                    {user?.user?.role}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[var(--text-secondary)]">Email</p>

                  <p className="font-medium">{user?.user?.email}</p>
                </div>

                <div>
                  <p className="text-[var(--text-secondary)]">User ID</p>

                  <p className="font-medium">#{user?.user?.id}</p>
                </div>

                <div>
                  <p className="text-[var(--text-secondary)]">Role</p>

                  <p className="font-medium">{user?.user?.role}</p>
                </div>

                { user?.user?.lawyerCode && ( <div>
                  <p className="text-[var(--text-secondary)]">Lawyer Code</p>

                  <p className="font-medium">{user?.user?.lawyerCode}</p>
                </div>)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STATS */}

      {user?.user?.role === "LAWYER" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {/* TOTAL CASES */}

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm">Total Cases</p>

              <FiBriefcase className="text-2xl text-blue-600" />
            </div>

            <h2 className="text-4xl font-bold text-gray-900">{totalCases}</h2>
          </div>

          {/* OPEN CASES */}

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm">Open Cases</p>

              <FiClock className="text-2xl text-yellow-500" />
            </div>

            <h2 className="text-4xl font-bold text-gray-900">{openCases}</h2>
          </div>

          {/* CLOSED CASES */}

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm">Closed Cases</p>

              <FiCheckCircle className="text-2xl text-green-600" />
            </div>

            <h2 className="text-4xl font-bold text-gray-900">{closedCases}</h2>
          </div>

          {/* CLIENTS */}

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm">Total Clients</p>

              <FiUsers className="text-2xl text-purple-600" />
            </div>

            <h2 className="text-4xl font-bold text-gray-900">{totalClients}</h2>
          </div>
        </div>
      )}

      {user?.user?.role !== "LAWYER" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-sm">Assigned Cases</p>

            <FiBriefcase className="text-2xl text-blue-600" />
          </div>

          <h2 className="text-4xl font-bold text-gray-900">{totalCases}</h2>
        </div>
      )}

      {/* RECENT CASES */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Cases</h2>
        </div>

        {cases.length === 0 ? (
          <p className="text-gray-500">No cases found.</p>
        ) : (
          <div className="space-y-4">
            {cases.slice(0, 5).map((caseItem) => (
              <div
                key={caseItem.id}
                className="border border-gray-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {caseItem.title}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {caseItem.description}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    caseItem.status === "OPEN"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {caseItem.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
