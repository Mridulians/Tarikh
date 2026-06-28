import { useEffect, useState } from "react";

import { createCase } from "../api/cases";
import { getClients } from "../api/clients";

const CreateCaseForm = ({ onSuccess }: any) => {
  const [clients, setClients] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientId: "",
    hearingDate: "",
    courtName: "",
    caseNumber: "",
    priority: "MEDIUM",
    status: "OPEN",
  });

  const fetchClients = async () => {
    try {
      const data = await getClients();

      setClients(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        clientId: Number(formData.clientId),
        hearingDate: new Date(formData.hearingDate).toISOString(),
      };

      console.log(payload);

      const newCase = await createCase(payload);

      onSuccess(newCase);

      setFormData({
        title: "",
        description: "",
        clientId: "",
        hearingDate: "",
        courtName: "",
        caseNumber: "",
        priority: "MEDIUM",
        status: "OPEN",
      });
    } catch (err: any) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-6">Create New Case</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <input
          type="text"
          placeholder="Case Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
            })
          }
          className="border rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
          className="border rounded-xl px-4 py-3"
          required
        />

        <select
          value={formData.clientId}
          onChange={(e) =>
            setFormData({
              ...formData,
              clientId: e.target.value,
            })
          }
          className="border rounded-xl px-4 py-3"
          required
        >
          <option value="">Select Client</option>

          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={formData.hearingDate}
          onChange={(e) =>
            setFormData({
              ...formData,
              hearingDate: e.target.value,
            })
          }
          className="border rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="Court Name"
          value={formData.courtName}
          onChange={(e) =>
            setFormData({
              ...formData,
              courtName: e.target.value,
            })
          }
          className="border rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="Case Number"
          value={formData.caseNumber}
          onChange={(e) =>
            setFormData({
              ...formData,
              caseNumber: e.target.value,
            })
          }
          className="border rounded-xl px-4 py-3"
          required
        />

        <select
          value={formData.priority}
          onChange={(e) =>
            setFormData({
              ...formData,
              priority: e.target.value,
            })
          }
          className="border rounded-xl px-4 py-3"
        >
          <option value="LOW">LOW</option>

          <option value="MEDIUM">MEDIUM</option>

          <option value="HIGH">HIGH</option>
        </select>

        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value,
            })
          }
          className="border rounded-xl px-4 py-3"
        >
          <option value="OPEN">OPEN</option>

          <option value="CLOSED">CLOSED</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 font-medium"
        >
          Create Case
        </button>
      </form>
    </div>
  );
};

export default CreateCaseForm;
