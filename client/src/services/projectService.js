import API from "./api";

export const getProjects = async () => {
  const res = await API.get("/projects");
  return res.data;
};