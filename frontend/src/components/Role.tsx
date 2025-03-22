import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { SquarePen, Trash2 } from "lucide-react";
import { IRole, IPermission } from "../interfaces/roles-permissions";
import { fetchPermissions, fetchRoles } from "../utils";

const apiUrl = process.env.REACT_APP_API;
const validationSchema = Yup.object({
  label: Yup.string().required("Label is required"),
  description: Yup.string().required("Description is required"),
  permission: Yup.array().min(1, "At least one permission is required"),
});

const Role = () => {
  const queryClient = useQueryClient();

  const [role, setRole] = useState<IRole | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
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

  const roleMutation = useMutation<{ message: string }, Error, IRole>({
    mutationFn: async (newRole) => {
      if (role) {
        const { data } = await axios.put(
          `${apiUrl}/user-role/${role._id}`,
          newRole,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        return data.newRole;
      } else {
        const { data } = await axios.post(`${apiUrl}/user-role`, newRole, {
          headers: { "Content-Type": "application/json" },
        });
        return data.newRole;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles"] });
    },
    onError: () => {
      setError("Error saving role");
    },
  });

  const initialValues = {
    label: role?.label || "",
    description: role?.description || "",
    permission: role?.permission || [],
  };

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
              userRoles.map((role: IRole) => (
                <tr key={role._id}>
                  <td className="p-2">{role.label}</td>
                  <td className="p-2">{role.description || "-"}</td>
                  <td className="p-2">
                    {role.permission.length > 0
                      ? role.permission
                          .map((permId) => {
                            const foundPerm = permissions.find(
                              (p: IPermission) => p._id === permId
                            );
                            return foundPerm ? foundPerm.name : permId;
                          })
                          .join(", ")
                      : "-"}
                  </td>
                  <td className="p-2">
                    <div className="flex justify-center items-center gap-4">
                      <span className="text-blue-600 hover:text-blue-800 transition duration-300 cursor-pointer">
                        <SquarePen
                          size={20}
                          onClick={() => {
                            setRole(role);
                            setShowSidebar(true);
                          }}
                        />
                      </span>
                      {/* <span className="text-red-600 hover:text-red-800 transition duration-300 cursor-pointer">
                        <Trash2
                          size={20}
                          onClick={() => {
                            setRole(role);
                            setShowSidebar(true);
                          }}
                        />
                      </span> */}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showSidebar && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 flex justify-end bg-black bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={closeSidebar}
          >
            <motion.div
              className="w-[50vw] bg-white p-6 shadow-lg h-full"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-3">
                {role ? "Edit " : "Create "} Role
              </h3>

              {error && (
                <p className="bg-red-50 text-red-700 my-4 p-2 rounded-lg font-semibold">
                  {error}
                </p>
              )}
              {message && (
                <div className="text-center font-bold mt-1 bg-green-200 text-green-700 text-sm p-4 rounded-lg">
                  <p>{message}</p>
                </div>
              )}

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  roleMutation.mutate(values, {
                    onSuccess: () => {
                      resetForm();
                      setMessage("Successful request");
                    },
                    onError: (err) => {
                      setError(err.message);
                    },
                  });
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="text-left">
                      <label className="block text-sm font-medium mb-2">
                        Label
                      </label>
                      <Field
                        type="text"
                        name="label"
                        placeholder="Enter role label"
                        className="w-full border p-2 rounded-md"
                      />
                      <ErrorMessage
                        name="label"
                        component="p"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="text-left">
                      <label className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <Field
                        type="text"
                        name="description"
                        placeholder="Enter role description"
                        className="w-full border p-2 rounded-md"
                      />
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="text-left">
                      <label className="block text-sm font-medium mb-2">
                        Permissions (select multiple)
                      </label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded-md">
                        {permissions.map((perm: IPermission) => (
                          <label
                            key={perm._id}
                            className="flex items-center space-x-2"
                          >
                            <Field
                              type="checkbox"
                              name="permission"
                              value={perm._id}
                              className="h-4 w-4"
                            />
                            <span className="text-sm">{perm.name}</span>
                          </label>
                        ))}
                      </div>
                      <ErrorMessage
                        name="permission"
                        component="p"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        type="button"
                        onClick={closeSidebar}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-white">
                              Submitting...
                            </span>
                          </div>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Role;
