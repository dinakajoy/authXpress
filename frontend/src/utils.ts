import axios from "axios";

const apiUrl = process.env.REACT_APP_API;
const token = localStorage.getItem("token");

export const fetchPermissions = async () => {
  const { data } = await axios.get(`${apiUrl}/permissions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.permissions;
};

export const fetchRoles = async () => {
  const { data } = await axios.get(`${apiUrl}/user-role`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.userRoles;
};

export const fetchUsers = async () => {
  const { data } = await axios.get(`${apiUrl}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.users;
};
