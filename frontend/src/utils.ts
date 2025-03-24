import axios from "axios";

const apiUrl = process.env.REACT_APP_API;

export const fetchPermissions = async () => {
  const { data } = await axios.get(`${apiUrl}/permissions`);
  return data.permissions;
};

export const fetchRoles = async () => {
  const { data } = await axios.get(`${apiUrl}/user-role`);
  return data.userRoles;
};

export const fetchUsers = async () => {
  const { data } = await axios.get(`${apiUrl}/users`);
  return data.users;
};