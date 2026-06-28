// import { useEffect, useState } from "react";
// import { getCases } from "../api/cases";
// import { useNavigate } from "react-router-dom";
// import CreateCaseForm from "../components/CreateCaseForm";

// const Cases = () => {
//   const [cases, setCases] = useState<any[]>([]);

//   const navigate = useNavigate();

//   const fetchCases = async () => {
//     try {
//       const data = await getCases();
//       setCases(data);
//     } catch (err) {
//       console.error("Failed to fetch cases");
//     }
//   };

//   useEffect(() => {
//     fetchCases();
//   }, []);

//   const handleAdd = (c: any) => {
//     setCases((prev) => [c, ...prev]);
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Cases</h2>

//       <CreateCaseForm onSuccess={handleAdd} />

//       {cases.length === 0 ? (
//         <p>No cases</p>
//       ) : (
//         <ul>
//           {cases.map((c) => (
//             <li
//               key={c.id}
//               onClick={() => navigate(`/cases/${c.id}`)}
//               style={{ cursor: "pointer" }}
//             >
//               <strong>{c.title}</strong> - {c.client?.name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Cases;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getCases } from "../api/cases";

import CreateCaseForm from "../components/CreateCaseForm";

const Cases = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    try {
      const data = await getCases();

      setCases(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleCaseCreated = (newCase: any) => {
    setCases((prev) => [newCase, ...prev]);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-[var(--bg)] min-h-screen">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cases</h1>

        <p className="text-gray-500 mt-1">Manage all legal cases</p>
      </div>

      {/* CREATE FORM */}

      {user?.user?.role === "LAWYER" && (
        <div className="mb-8">
          <CreateCaseForm onSuccess={handleCaseCreated} />
        </div>
      )}

      {/* CASE LIST */}

      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Cases</h2>
        </div>

        <div className="divide-y">
          {cases.length === 0 ? (
            <div className="p-6 text-gray-500">No cases found</div>
          ) : (
            cases.map((c) => (
              <Link to={`/cases/${c.id}`} key={c.id}>
                <div className="p-6 hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{c.title}</h3>

                      <p className="text-gray-500">{c.client?.name}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          c.status === "OPEN"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Cases;
