import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SquarePen, Trash2 } from "lucide-react";
import {
  IRole,
  IPermission,
  IRoleWithPermission,
} from "../interfaces/roles-permissions";
import { fetchPermissions, fetchRoles } from "../utils";
import RoleModal from "./RoleModal";
import DeleteModal from "./DeleteModal";
import { useUser } from "../context/UserContext";

const Role = () => {
  const { userPermissions } = useUser();
  const [role, setRole] = useState<IRoleWithPermission | null>(null);
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

  const {
    data: userRoles,
    isLoading: loadingRoles,
    error: roleError,
  } = useQuery({
    queryKey: ["userRoles"],
    queryFn: fetchRoles,
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
    setRole(null);
    setShowSidebar(false);
  };

  const hasPermission = (permName: string) =>
    userPermissions.includes(permName);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Roles</h2>
          <button
            onClick={() => setShowSidebar(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Role
          </button>
        </div>
        {loadingPermissions || loadingRoles ? <p>Loading...</p> : null}
        {(permissionError || roleError) && (
          <p className="w-full bg-red-50 text-red-700 p-2 rounded-lg font-semibold my-2">
            {permissionError?.message || roleError?.message}
          </p>
        )}
        <table className="w-full border-collapse border border-gray-50 text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">Label</th>
              <th className="p-2">Description</th>
              <th className="p-2">Permissions</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userRoles &&
              permissions &&
              userRoles.map((role: IRoleWithPermission) => (
                <tr key={role._id}>
                  <td className="p-2">{role.label}</td>
                  <td className="p-2">{role.description || "-"}</td>
                  <td className="p-2">
                    {role.permission && role.permission.length > 0
                      ? role.permission
                          .map((perm: IPermission) => perm.name)
                          .join(", ")
                      : "-"}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center items-center gap-4">
                      {hasPermission("Edit role") && (
                        <span className="text-blue-600 hover:text-blue-800 transition duration-300 cursor-pointer">
                          <SquarePen
                            size={20}
                            onClick={() => {
                              setRole(role);
                              setShowSidebar(true);
                            }}
                          />
                        </span>
                      )}
                      {hasPermission("Delete role") && (
                        <span className="text-red-600 hover:text-red-800 transition duration-300 cursor-pointer">
                          <Trash2
                            size={20}
                            onClick={() => {
                              setRole(role);
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
      </div>

      {showSidebar && (
        <RoleModal
          closeSidebar={closeSidebar}
          role={role}
          permissions={permissions}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          type="userrole"
          data={role}
          onClose={() => setDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Role;
