import instance from "./axios";

export const getClients = async () => {
  const res = await instance.get("/clients");
  return res.data.clients;
};

export const createClient = async (data: {
  name: string;
  email?: string;
  phone: string;
  preferredMode: string;
  reminderBefore: number;
}) => {
  const res = await instance.post("/clients", data);
  return res.data.client;
};

export const getClientDetails = async (
  id: number
) => {
  const res = await instance.get(`/clients/${id}`);
 

  // console.log(res.data);
  return res.data;
};



export const updateClient =
  async (
    id: number,
    payload: any
  ) => {
    const res =
      await instance.put(
        `/clients/${id}`,
        payload
      );
      
      console.log("Updated Client Response:", res.data);
    return res.data;
  };

export const deleteClient =
  async (id: number) => {
    const res =
      await instance.delete(
        `/clients/${id}`
      );

    return res.data;
  };