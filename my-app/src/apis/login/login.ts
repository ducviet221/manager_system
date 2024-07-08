import axios from "axios";
axios.defaults.baseURL = "https://localhost:7015/api/";

export const login = async (value: any) => {
  const { data } = await axios.post("user/login", value);
  return data;
};

export const createUser = async (value: any) => {
  const data = await axios.post("user/createuser", value);
  return data;
};
