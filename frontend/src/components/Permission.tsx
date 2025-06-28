import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SquarePen, Trash2 } from "lucide-react";
import PermissionModal from "./PermissionModal";
import { IPermission } from "../interfaces/roles-permissions";
import { fetchPermissions } from "../utils";
import DeleteModal from "./DeleteModal";
import { useUser } from "../context/UserContext";

const Permission = () => {
  const { userPermissions } = useUser();
  const [permission, setPermission] = useState<IPermission | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const {
    data: permissions,
    isLoading: loadingPermissions,
    error: permissionError,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
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
    setPermission(null);
    setShowSidebar(false);
  };

  const hasPermission = (permName: string) =>
    userPermissions.includes(permName);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Permissions</h2>
          <button
            onClick={() => setShowSidebar(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Permission
          </button>
        </div>

        {loadingPermissions ? <p>Loading...</p> : null}
        {permissionError && (
          <p className="w-full bg-red-50 text-red-700 p-2 rounded-lg font-semibold my-2">
            {permissionError?.message}
          </p>
        )}
        {permissions && (
          <table className="w-full border-collapse border border-gray-50 text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">Group</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {permissions &&
                permissions.map((permission: IPermission) => (
                  <tr key={permission._id}>
                    <td className="p-2">{permission.name}</td>
                    <td className="p-2">{permission.description || "-"}</td>
                    <td className="p-2">{permission.group}</td>
                    <td className="p-2">
                      <div className="flex justify-center items-center gap-4">
                        {hasPermission("Edit permission") && (
                          <span className="text-blue-600 hover:text-blue-800 transition duration-300 cursor-pointer">
                            <SquarePen
                              size={20}
                              onClick={() => {
                                setPermission(permission);
                                setShowSidebar(true);
                              }}
                            />
                          </span>
                        )}
                        {hasPermission("Delete permission") && (
                          <span className="text-red-600 hover:text-red-800 transition duration-300 cursor-pointer">
                            <Trash2
                              size={20}
                              onClick={() => {
                                setPermission(permission);
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

      {showSidebar && (
        <PermissionModal closeSidebar={closeSidebar} permission={permission} />
      )}
      {showDeleteModal && (
        <DeleteModal
          type="permission"
          data={permission}
          onClose={() => setDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Permission;
