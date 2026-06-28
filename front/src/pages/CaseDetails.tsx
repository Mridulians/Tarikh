// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getCaseDetails } from "../api/cases";
// import { useAuth } from "../hooks/useAuth";
// import { getClerks } from "../api/users";
// import { assignClerk } from "../api/cases";
// import { updateCase } from "../api/cases";

// const CaseDetails = () => {
//   const { id } = useParams();
//   const [data, setData] = useState<any>(null);

//   const { user } = useAuth();

//   const [clerksList, setClerksList] = useState<any[]>([]);
//   const [selectedClerk, setSelectedClerk] = useState("");
//   const [editing, setEditing] = useState(false);

//   const [editForm, setEditForm] = useState({
//     title: "",
//     description: "",
//     status: "",
//     hearingDate: "",
//   });

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const res = await getCaseDetails(Number(id));
//         // console.log(res)
//         setData(res);
//       } catch (err) {
//         console.error("Failed to fetch case details");
//       }
//     };

//     if (id) fetchDetails();

//     if (user?.role !== "CLERK") {
//       const loadClerks = async () => {
//         const data = await getClerks();
//         setClerksList(data);
//       };
//       loadClerks();
//     }
//   }, [id]);

//   useEffect(() => {
//     if (data?.case) {
//       setEditForm({
//         title: data.case.title || "",
//         description: data.case.description || "",
//         status: data.case.status || "",
//         hearingDate: data.case.hearingDate
//           ? data.case.hearingDate.split("T")[0]
//           : "",
//       });
//     }
//   }, [data]);

//   const handleUpdate = async () => {
//     try {
//       await updateCase(Number(id), {
//         ...editForm,
//         hearingDate: new Date(editForm.hearingDate).toISOString(),
//       });

//       setEditing(false);

//       const refreshed = await getCaseDetails(Number(id));

//       setData(refreshed);
//     } catch (err: any) {
//       alert(err?.response?.data?.message || "Update failed");
//     }
//   };

//   const handleAssign = async () => {
//     if (!selectedClerk) return;

//     try {
//       const updated = await assignClerk(Number(id), Number(selectedClerk));

//       // 🔥 update UI instantly
//       setData((prev: any) => ({
//         ...prev,
//         case: updated,
//         clerks: updated.clerks,
//       }));

//       setSelectedClerk("");
//     } catch (err: any) {
//       alert(err?.response?.data?.message || "Assign failed");
//     }
//   };

//   if (!data) return <div>Loading...</div>;

//   // const { case: caseData, client, clerks, activities } = data;

//   const { case: caseData } = data;
//   const client = data.case.client;
//   const clerks = data.case.clerks;
//   const activities = data.case.activities;

//   // console.log(data.case);
//   // console.log(data.case.client);

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Case Details</h2>

//       {/* CASE INFO */}
//       {/* <div>
//         <h3>{caseData.title}</h3>
//         <p>{caseData.description}</p>
//         <p>Status: {caseData.status}</p>
//         <p>Priority: {caseData.priority}</p>
//         <p>Court: {caseData.courtName}</p>
//         <p>Hearing: {new Date(caseData.hearingDate).toLocaleDateString()}</p>
//       </div> */}

//       <div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <h3>Case Information</h3>

//           {user?.role !== "CLERK" && (
//             <button onClick={() => setEditing(!editing)}>
//               {editing ? "Cancel" : "Edit"}
//             </button>
//           )}
//         </div>

//         {editing ? (
//           <div>
//             <input
//               placeholder="Title"
//               value={editForm.title}
//               onChange={(e) =>
//                 setEditForm({
//                   ...editForm,
//                   title: e.target.value,
//                 })
//               }
//             />

//             <input
//               placeholder="Description"
//               value={editForm.description}
//               onChange={(e) =>
//                 setEditForm({
//                   ...editForm,
//                   description: e.target.value,
//                 })
//               }
//             />

//             <select
//               value={editForm.status}
//               onChange={(e) =>
//                 setEditForm({
//                   ...editForm,
//                   status: e.target.value,
//                 })
//               }
//             >
//               <option value="OPEN">OPEN</option>
//               <option value="CLOSED">CLOSED</option>
//             </select>

//             <input
//               type="date"
//               value={editForm.hearingDate}
//               onChange={(e) =>
//                 setEditForm({
//                   ...editForm,
//                   hearingDate: e.target.value,
//                 })
//               }
//             />

//             <button onClick={handleUpdate}>Save Changes</button>
//           </div>
//         ) : (
//           <div>
//             <h3>{caseData.title}</h3>

//             <p>{caseData.description}</p>

//             <p>Status: {caseData.status}</p>

//             <p>
//               Hearing: {new Date(caseData.hearingDate).toLocaleDateString()}
//             </p>
//           </div>
//         )}
//       </div>

//       <hr />

//       {/* CLIENT */}
//       <div>
//         <h3>Client</h3>
//         <p>{client.name}</p>
//         <p>{client.email}</p>
//         <p>{client.phone}</p>
//       </div>

//       <hr />

//       {/* CLERKS */}
//       <div>
//         <h3>Assigned Clerks</h3>

//         {user?.role !== "CLERK" && (
//           <div style={{ marginTop: "20px" }}>
//             <h4>Assign Clerk</h4>

//             <select
//               value={selectedClerk}
//               onChange={(e) => setSelectedClerk(e.target.value)}
//             >
//               <option value="">Select Clerk</option>
//               {clerksList.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name} ({c.email})
//                 </option>
//               ))}
//             </select>

//             <button onClick={handleAssign} style={{ marginLeft: "10px" }}>
//               Assign
//             </button>
//           </div>
//         )}
//         {clerks.length === 0 ? (
//           <p>No clerks assigned</p>
//         ) : (
//           <ul>
//             {clerks.map((c: any) => (
//               <li key={c.user.id}>
//                 {c.user.name} ({c.user.email})
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <hr />

//       {/* ACTIVITY */}
//       <div>
//         <h3>Activity Timeline</h3>

//         {activities.length === 0 ? (
//           <p>No activity</p>
//         ) : (
//           <ul>
//             {activities.map((a: any) => (
//               <li key={a.id}>
//                 <strong>{a.action}</strong> - {a.message}
//                 <br />
//                 <small>{new Date(a.createdAt).toLocaleString()}</small>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CaseDetails;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCaseDetails, assignClerk, updateCase } from "../api/cases";
import { getClerks } from "../api/users";
import { useAuth } from "../hooks/useAuth";

const CaseDetails = () => {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);

  const { user } = useAuth();

  const [clerksList, setClerksList] = useState<any[]>([]);

  const [selectedClerk, setSelectedClerk] = useState("");

  const [editing, setEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    hearingDate: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await getCaseDetails(Number(id));

      setData(res);
    };

    if (id) fetchDetails();

    if (user?.role !== "CLERK") {
      const loadClerks = async () => {
        const list = await getClerks();

        setClerksList(list);
      };

      loadClerks();
    }
  }, [id]);

  useEffect(() => {
    if (data?.case) {
      setEditForm({
        title: data.case.title || "",
        description: data.case.description || "",
        status: data.case.status || "",
        hearingDate: data.case.hearingDate?.split("T")[0] || "",
      });
    }
  }, [data]);

  const handleUpdate = async () => {
    await updateCase(Number(id), {
      ...editForm,
      hearingDate: new Date(editForm.hearingDate).toISOString(),
    });

    setEditing(false);

    const refreshed = await getCaseDetails(Number(id));

    setData(refreshed);
  };

  // const handleAssign = async () => {
  //   if (!selectedClerk) return;

  //   const updated = await assignClerk(Number(id), Number(selectedClerk));

  //   setData((prev: any) => ({
  //     ...prev,
  //     case: updated,
  //   }));

  //   setSelectedClerk("");
  // };

  // const handleAssign = async () => {
  //   if (!selectedClerk) return;

  //   try {
  //     const updated = await assignClerk(Number(id), Number(selectedClerk));

  //     setData((prev: any) => ({
  //       ...prev,
  //       case: {
  //         ...prev.case,
  //         clerks: updated.clerks,
  //       },
  //     }));

  //     setSelectedClerk("");
  //   } catch (err: any) {
  //     alert(err?.response?.data?.message || "Assign failed");
  //   }
  // };

  const handleAssign = async () => {
    if (!selectedClerk) return;

    try {
      await assignClerk(Number(id), Number(selectedClerk));

      const refreshed = await getCaseDetails(Number(id));

      setData(refreshed);

      setSelectedClerk("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Assign failed");
    }
  };

  if (!data) {
    return <div className="p-8">Loading...</div>;
  }

  const caseData = data.case;

  const client = data.case.client;

  // console.log(client);

  const clerks = data.case.clerks;

  const activities = data.case.activities;

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Case Details</h1>

            <p className="text-slate-500 mt-1">
              Manage case, clerks and activity
            </p>
          </div>

          {user?.role !== "CLERK" && (
            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700"
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        {/* case info */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-5">Case Information</h2>

          {editing ? (
            <div className="grid gap-4">
              <input
                className="border rounded-xl px-4 py-3"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    title: e.target.value,
                  })
                }
              />

              <textarea
                className="border rounded-xl px-4 py-3"
                rows={4}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description: e.target.value,
                  })
                }
              />

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  className="border rounded-xl px-4 py-3"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                </select>

                <input
                  type="date"
                  className="border rounded-xl px-4 py-3"
                  value={editForm.hearingDate}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      hearingDate: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 w-fit"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">{caseData.title}</h3>

              <p className="text-slate-600">{caseData.description}</p>

              <p>
                <strong>Status:</strong> {caseData.status}
              </p>

              <p>
                <strong>Hearing:</strong>{" "}
                {new Date(caseData.hearingDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* client + clerks */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Client</h2>

            <p className="font-medium">{client.name}</p>

            <p className="text-slate-600">{client.email}</p>

            <p className="text-slate-600">{client.phone}</p>

            <p className="text-slate-600">
              Reminder before : {client.reminderBefore} mins
            </p>
          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Assigned Clerks</h2>

            {user?.user?.role !== "CLERK" && (
              <div className="flex gap-3 mb-5">
                <select
                  value={selectedClerk}
                  onChange={(e) => setSelectedClerk(e.target.value)}
                  className="border rounded-xl px-4 py-3 flex-1"
                >
                  <option value="">Select Clerk</option>

                  {clerksList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAssign}
                  className="bg-blue-600 text-white px-5 rounded-xl hover:bg-blue-700"
                >
                  Assign
                </button>
              </div>
            )}

            {clerks.length === 0 ? (
              <p className="text-slate-500">No clerks assigned</p>
            ) : (
              <div className="space-y-3">
                {clerks.map((c: any) => (
                  <div key={c.user.id} className="border rounded-xl p-3">
                    <p className="font-medium">{c.user.name}</p>

                    <p className="text-slate-500 text-sm">{c.user.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* activity */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-5">Activity Timeline</h2>

          {activities.length === 0 ? (
            <p className="text-slate-500">No activity</p>
          ) : (
            <div className="space-y-4">
              {activities.map((a: any) => (
                <div key={a.id} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium">{a.action}</p>

                  <p className="text-slate-600">{a.message}</p>

                  <p className="text-sm text-slate-400 mt-1">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
