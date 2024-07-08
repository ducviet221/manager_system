import axios from "axios";
export interface IInfoBodyModel {
  id?: string;
  cif?: string;
  time?: string;
  deliveryroom?: string;
  affairsofficer?: string;
  recive?: string;
  status?: string;
  note?: string;
}
export const getListInfo = async () => {
  const data = await axios.get("/info/getListInfo");
  return data;
};

export const createInfo = async (data: IInfoBodyModel) => {
  return await axios.post("/info/createInfo", data);
};

export const getInfoById = async (id: string) => {
  const data = await axios.get("/info/getInfoDetail/" + id);
  return data;
};

export const completeInfo = async (id: string) => {
  const { data } = await axios.get("/info/completeInfo/" + id);
  return data;
};

export const updateInfo = async (value: IInfoBodyModel) => {
  const { data } = await axios.put("/info/updateInfo", value);
  return data;
};

export const deleteInfoById = async (id: string) => {
  const { data } = await axios.get("/info/deleteInfo/" + id);
  return data;
};
