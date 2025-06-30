import axios from "axios";

const apiUrl = process.env.REACT_APP_API;

export const fetchPermissions = async () => {
  const { data } = await axios.get(`${apiUrl}/permissions`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data.permissions;
};

export const fetchRoles = async () => {
  const { data } = await axios.get(`${apiUrl}/user-role`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data.userRoles;
};

export const fetchUsers = async () => {
  const { data } = await axios.get(`${apiUrl}/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data.users;
};
