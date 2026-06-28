// // import { useEffect, useState } from "react";
// // import { useParams, Link } from "react-router-dom";

// // import { getClientDetails } from "../api/clients";

// // const ClientDetails = () => {
// //   const { id } = useParams();

// //   const [client, setClient] = useState<any>(null);

// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchClient = async () => {
// //       try {
// //         const res = await getClientDetails(
// //           Number(id)
// //         );

// //         setClient(res.client);
// //         // console.log(res.client)
// //         // console.log(res)

// //       } catch (err) {
// //         console.log(err);

// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchClient();

// //   }, [id]);

// //   // console.log(client)

// //   if (loading) {
// //     return <h2>Loading...</h2>;
// //   }

// //   if (!client) {
// //     return <h2>Client not found</h2>;
// //   }

// //   return (
// //     <div className="p-6">

// //       <h1 className="text-3xl font-bold mb-6">
// //         Client Details
// //       </h1>

// //       {/* CLIENT INFO */}

// //       <div className="border p-4 rounded mb-8">

// //         <h2 className="text-2xl font-semibold mb-4">
// //           {client.name}
// //         </h2>

// //         <p className="mb-2">
// //           <strong>Email:</strong>{" "}
// //           {client.email}
// //         </p>

// //         <p className="mb-2">
// //           <strong>Phone:</strong>{" "}
// //           {client.phone}
// //         </p>

// //         <p className="mb-2">
// //           <strong>Preferred Mode:</strong>{" "}
// //           {client.preferredMode}
// //         </p>

// //         <p>
// //           <strong>Reminder Before:</strong>{" "}
// //           {client.reminderBefore} mins
// //         </p>

// //       </div>

// //       {/* LINKED CASES */}

// //       <div>

// //         <h2 className="text-2xl font-bold mb-4">
// //           Linked Cases
// //         </h2>

// //         {
// //           client.cases.length === 0 ? (
// //             <p>No cases linked.</p>

// //           ) : (
// //             <div className="space-y-4">

// //               {client.cases.map((caseItem: any) => (

// //                 <div
// //                   key={caseItem.id}
// //                   className="border p-4 rounded"
// //                 >
// //                   <h3 className="text-xl font-semibold">
// //                     {caseItem.title}
// //                   </h3>

// //                   <p>
// //                     Status: {caseItem.status}
// //                   </p>

// //                   <p>
// //                     Hearing:{" "}
// //                     {new Date(
// //                       caseItem.hearingDate
// //                     ).toLocaleDateString()}
// //                   </p>

// //                   <Link
// //                     to={`/cases/${caseItem.id}`}
// //                     className="text-blue-500 underline"
// //                   >
// //                     View Case
// //                   </Link>

// //                 </div>
// //               ))}
// //             </div>
// //           )
// //         }
// //       </div>
// //     </div>
// //   );
// // };

// // export default ClientDetails;

// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";

// import { getClientDetails, updateClient } from "../api/clients";

// const ClientDetails = () => {
//   const { id } = useParams();

//   const [client, setClient] = useState<any>(null);

//   const [loading, setLoading] = useState(true);

//   const [editing, setEditing] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     preferredMode: "CALL",
//     reminderBefore: 30,
//     // address: "",
//   });

//   useEffect(() => {
//     const fetchClient = async () => {
//       try {
//         const res = await getClientDetails(Number(id));

//         setClient(res.client);

//         setForm({
//           name: res.client.name || "",
//           email: res.client.email || "",
//           phone: res.client.phone || "",
//           preferredMode: res.client.preferredMode || "CALL",
//           reminderBefore: res.client.reminderBefore || 30,
//           // address:
//           //   res.client.address || "",
//         });
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClient();
//   }, [id]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleUpdate = async () => {
//     try {
//       const updated = await updateClient(Number(id), form);

//       setClient(updated.client || updated);

//       setEditing(false);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   if (loading) {
//     return <div className="p-8">Loading...</div>;
//   }

//   if (!client) {
//     return <div className="p-8">Client not found</div>;
//   }

//   console.log(client);
//   return (
//     <div className="p-8 bg-slate-50 min-h-screen">
//       {/* HEADER */}

//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">Client Details</h1>

//           <p className="text-slate-500 mt-1">
//             View and manage client information
//           </p>
//         </div>

//         {!editing && (
//           <button
//             onClick={() => setEditing(true)}
//             className="bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-slate-800 transition"
//           >
//             Edit Client
//           </button>
//         )}
//       </div>

//       {/* CLIENT CARD */}

//       <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
//         {editing ? (
//           <div className="grid md:grid-cols-2 gap-5">
//             <input
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Name"
//               className="border rounded-xl p-3"
//             />

//             <input
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Email"
//               className="border rounded-xl p-3"
//             />

//             <input
//               name="phone"
//               value={form.phone}
//               onChange={handleChange}
//               placeholder="Phone"
//               className="border rounded-xl p-3"
//             />

//             {/* <input
//               name="address"
//               value={form.address}
//               onChange={
//                 handleChange
//               }
//               placeholder="Address"
//               className="border rounded-xl p-3"
//             /> */}

//             <select
//               name="preferredMode"
//               value={form.preferredMode}
//               onChange={handleChange}
//               className="border rounded-xl p-3"
//             >
//               <option value="CALL">CALL</option>

//               <option value="EMAIL">EMAIL</option>

//               <option value="SMS">SMS</option>
//             </select>

//             <input
//               type="number"
//               name="reminderBefore"
//               value={form.reminderBefore}
//               onChange={handleChange}
//               className="border rounded-xl p-3"
//             />

//             <div className="flex gap-3 col-span-2 mt-3">
//               <button
//                 onClick={handleUpdate}
//                 className="bg-green-600 text-white px-5 py-2 rounded-xl"
//               >
//                 Save
//               </button>

//               <button
//                 onClick={() => setEditing(false)}
//                 className="border px-5 py-2 rounded-xl"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <h2 className="text-2xl font-semibold mb-5">{client.name}</h2>

//             <div className="grid md:grid-cols-2 gap-y-4 text-slate-700">
//               <p>
//                 <strong>Email:</strong> {client.email}
//               </p>

//               <p>
//                 <strong>Phone:</strong> {client.phone}
//               </p>

//               <p>
//                 <strong>Preferred Mode:</strong> {client.preferredMode}
//               </p>

//               <p>
//                 <strong>Reminder:</strong> {client.reminderBefore} mins
//               </p>

//               {/* <p className="md:col-span-2">
//                 <strong>
//                   Address:
//                 </strong>{" "}
//                 {client.address}
//               </p> */}
//             </div>
//           </>
//         )}
//       </div>

//       {/* CASES */}

//       <div>
//         <h2 className="text-2xl font-bold mb-5 text-slate-900">Linked Cases</h2>

//         {client.cases.length === 0 ? (
//           <div className="bg-white rounded-2xl border p-6 text-slate-500">
//             No linked cases.
//           </div>
//         ) : (
//           <div className="grid gap-4">
//             {client.cases.map((caseItem: any) => (
//               <div
//                 key={caseItem.id}
//                 className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition"
//               >
//                 <h3 className="text-xl font-semibold mb-2">{caseItem.title}</h3>

//                 <p className="text-slate-600">Status: {caseItem.status}</p>

//                 <p className="text-slate-600 mb-3">
//                   Hearing: {new Date(caseItem.hearingDate).toLocaleDateString()}
//                 </p>

//                 <Link
//                   to={`/cases/${caseItem.id}`}
//                   className="text-blue-600 font-medium hover:underline"
//                 >
//                   View Case →
//                 </Link>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClientDetails;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getClientDetails, updateClient } from "../api/clients";

const ClientDetails = () => {
  const { id } = useParams();

  const [client, setClient] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredMode: "CALL",
    reminderBefore: 30,
    // address: "",
  });

  // FETCH CLIENT
  const fetchClient = async () => {
    try {
      const res = await getClientDetails(Number(id));

      const data = res.client || res;

      console.log("Fetched Client Data:", data);

      setClient(data);

      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        preferredMode: data.preferredMode || "CALL",
        reminderBefore: data.reminderBefore || 30,
        // address: data.address || "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  // const handleUpdate = async () => {
  //   try {
  //     await updateClient(Number(id), form);

  //     await fetchClient();

  //     setEditing(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };


  const handleUpdate = async () => {
    try {
      const updated = await updateClient(Number(id), form);

      console.log("Updated Client Response in Component:", updated);

      setClient(updated.client || updated);

      setEditing(false);
    } catch (err) {
       console.log(err.response?.data);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!client) {
    return <div className="p-8">Client not found</div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Client Details</h1>

          <p className="text-slate-500 mt-1">
            View and manage client information
          </p>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-slate-800"
          >
            Edit Client
          </button>
        )}
      </div>

      {/* CARD */}

      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
        {editing ? (
          <div className="grid md:grid-cols-2 gap-5">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-xl p-3"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border rounded-xl p-3"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border rounded-xl p-3"
            />

            {/* <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border rounded-xl p-3"
            /> */}

            <select
              name="preferredMode"
              value={form.preferredMode}
              onChange={handleChange}
              className="border rounded-xl p-3"
            >
              <option value="CALL">CALL</option>

              <option value="EMAIL">EMAIL</option>
            </select>

            <input
              type="number"
              name="reminderBefore"
              value={form.reminderBefore}
              onChange={handleChange}
              className="border rounded-xl p-3"
            />

            <div className="flex gap-3 col-span-2 mt-3">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-5 py-2 rounded-xl"
              >
                Save
              </button>

              <button
                onClick={() => setEditing(false)}
                className="border px-5 py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-5">{client.name}</h2>

            <div className="grid md:grid-cols-2 gap-y-4 text-slate-700">
              <p>
                <strong>Email:</strong> {client.email}
              </p>

              <p>
                <strong>Phone:</strong> {client.phone}
              </p>

              <p>
                <strong>Preferred Mode:</strong> {client.preferredMode}
              </p>

              <p>
                <strong>Reminder:</strong> {client.reminderBefore} mins
              </p>

              {/* <p className="md:col-span-2">
                <strong>Address:</strong> {client.address}
              </p> */}
            </div>
          </>
        )}
      </div>

      {/* CASES */}

      <div>
        <h2 className="text-2xl font-bold mb-5">Linked Cases</h2>

        {client.cases?.length === 0 ? (
          <div className="bg-white rounded-2xl border p-6 text-slate-500">
            No linked cases.
          </div>
        ) : (
          <div className="grid gap-4">
            {client.cases?.map((caseItem: any) => (
              <div
                key={caseItem.id}
                className="bg-white rounded-2xl border shadow-sm p-5"
              >
                <h3 className="text-xl font-semibold mb-2">{caseItem.title}</h3>

                <p className="text-slate-600">Status: {caseItem.status}</p>

                <p className="text-slate-600 mb-3">
                  Hearing: {new Date(caseItem.hearingDate).toLocaleDateString()}
                </p>

                <Link
                  to={`/cases/${caseItem.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Case →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
