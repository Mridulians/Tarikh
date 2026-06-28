// import { useEffect, useState } from "react";
// import { getClients } from "../api/clients";
// import { Link } from "react-router-dom";
// import CreateClientForm from "../components/CreateClientForm";

// type Client = {
//   id: number;
//   name: string;
//   email?: string;
//   phone: string;
// };

// const Clients = () => {
//   const [clients, setClients] = useState<Client[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const data = await getClients();
//         setClients(data);
//       } catch (err) {
//         console.error("Failed to fetch clients");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClients();
//   }, []);

//   const handleAddClient = (client: any) => {
//     setClients((prev) => [client, ...prev]);
//   };

//   if (loading) return <div>Loading clients...</div>;

//   return (
//     <div style={{ padding: "40px" }}>
//       <CreateClientForm onSuccess={handleAddClient} />
//       <h2>Clients</h2>

//       {clients.length === 0 ? (
//         <p>No clients found</p>
//       ) : (
//         <ul>
//           {clients.map((client) => (
//             <li key={client.id}>
//               <Link to={`/clients/${client.id}`}>
//                 <strong>{client.name}</strong> - {client.phone}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Clients;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClients } from "../api/clients";
import { useAuth } from "../hooks/useAuth";

import CreateClientForm from "../components/CreateClientForm";

const Clients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<any>({});

  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const data = await getClients();

      setClients(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleClientCreated = (newClient: any) => {
    setClients((prev) => [newClient, ...prev]);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-[var(--bg)] min-h-screen">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)]">Clients</h1>

        <p className="text-gray-500 mt-1">Manage all your clients</p>
      </div>

      {/* CREATE FORM */}

      {user?.user?.role === "LAWYER" && (
        <div className="mb-8">
          <CreateClientForm onSuccess={handleClientCreated} />
        </div>
      )}

      {/* CLIENT LIST */}

      <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Clients</h2>
        </div>

        <div className="divide-y">
          {clients.length === 0 ? (
            <div className="p-6 text-gray-500">No clients found</div>
          ) : (
            clients.map((client) => (
              <div
                key={client.id}
                onClick={() => navigate(`/clients/${client.id}`)}
                className="p-6 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{client.name}</h3>

                    <p className="text-gray-500 mt-1">{client.email}</p>

                    <p className="text-sm text-gray-400 mt-1">{client.phone}</p>
                  </div>

                  <div className="text-sm text-gray-400">#{client.id}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
