import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IUserWithRole } from "../interfaces/user";
import { fetchUsers } from "../utils";
import { SquarePen, Trash2 } from "lucide-react";
import UserModal from "./UserModal";
import DeleteModal from "./DeleteModal";
import { useUser } from "../context/UserContext";

const Users = () => {
  const { userPermissions } = useUser();
  const [user, setUser] = useState<IUserWithRole | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const {
    data: users,
    isLoading: loadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const closeSidebar = () => {
    setUser(null);
    setShowSidebar(false);
  };

  const hasPermission = (permName: string) =>
    userPermissions.includes(permName);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Users</h2>
        </div>

        {loadingUsers ? <p>Loading...</p> : null}
        {usersError && (
          <p className="w-full bg-red-50 text-red-700 p-2 rounded-lg font-semibold my-2">
            {usersError?.message}
          </p>
        )}
        {users && (
          <table className="w-full border-collapse border border-gray-50 text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user: IUserWithRole) => (
                  <tr key={user._id}>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email || "-"}</td>
                    <td className="p-2">{user.role ? user.role.label : "-"}</td>
                    <td className="p-2">
                      <div className="flex justify-center items-center gap-4">
                        {hasPermission("Edit user") && (
                          <span className="text-blue-600 hover:text-blue-800 transition duration-300 cursor-pointer">
                            <SquarePen
                              size={20}
                              onClick={() => {
                                setUser(user);
                                setShowSidebar(true);
                              }}
                            />
                          </span>
                        )}
                        {hasPermission("Delete user") && (
                          <span className="text-red-600 hover:text-red-800 transition duration-300 cursor-pointer">
                            <Trash2
                              size={20}
                              onClick={() => {
                                setUser(user);
                                setDeleteModal(true);
                              }}
                            />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {showSidebar && <UserModal closeSidebar={closeSidebar} user={user} />}
      {showDeleteModal && (
        <DeleteModal
          type="user"
          data={user}
          onClose={() => setDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Users;
