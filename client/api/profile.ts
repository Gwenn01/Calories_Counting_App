import { api } from "./client";

// get the totals logs
export const fetchProfile = async () => {
  const res = await api.get("api/profile-details/");
  return res.data;
};

export const editProfile = async (data: any) => {
  const res = await api.put("/api/profile-details/", data);
  return res.data;
};
