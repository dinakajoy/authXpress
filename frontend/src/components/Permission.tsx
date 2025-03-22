import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { SquarePen, Trash2 } from "lucide-react";
import { IPermission } from "../interfaces/roles-permissions";
import { PermissionGroup } from "../constants";
import { fetchPermissions } from "../utils";

const apiUrl = process.env.REACT_APP_API;
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  group: Yup.mixed()
    .oneOf(Object.values(PermissionGroup), "Invalid group selection")
    .required("Group is required"),
});

const Permission = () => {
  const queryClient = useQueryClient();

  const [permission, setPermission] = useState<IPermission | null>(null);
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

  const permissionMutation = useMutation<
    { message: string },
    Error,
    IPermission
  >({
    mutationFn: async (newPermission) => {
      if (permission) {
        const { data } = await axios.put(
          `${apiUrl}/permissions/${permission._id}`,
          newPermission,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        return data.newPermission;
      } else {
        const { data } = await axios.post(
          `${apiUrl}/permissions`,
          newPermission,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        return data.newPermission;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: () => {
      setError("Error saving permission");
    },
  });

  const initialValues = {
    name: permission?.name || "",
    description: permission?.description || "",
    group: permission?.group || "",
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
    setPermission(null);
    setShowSidebar(false);
  };

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
                        <span className="text-blue-600 hover:text-blue-800 transition duration-300 cursor-pointer">
                          <SquarePen
                            size={20}
                            onClick={() => {
                              setPermission(permission);
                              setShowSidebar(true);
                            }}
                          />
                        </span>
                        {/* <span className="text-red-600 hover:text-red-800 transition duration-300 cursor-pointer">
                          <Trash2
                            size={20}
                            onClick={() => {
                              setPermission(permission);
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
        )}
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
                {permission ? "Edit " : "Create "} Permission
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
                  permissionMutation.mutate((values), {
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
                        Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        placeholder="Enter permission name"
                        className="w-full border p-2 rounded-md"
                      />
                      <ErrorMessage
                        name="name"
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
                        placeholder="Enter permission description"
                        className="w-full border p-2 rounded-md"
                      />
                      <ErrorMessage
                        name="description"
                        component="p"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="text-left my-4">
                      <label className="block text-sm font-medium mb-2">
                        Group
                      </label>
                      <Field
                        as="select"
                        name="group"
                        className="w-full border p-2 rounded-md mb-2"
                      >
                        <option value="" disabled>
                          Select a permission group
                        </option>
                        {Object.entries(PermissionGroup[0]).map(
                          ([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          )
                        )}
                      </Field>
                      <ErrorMessage
                        name="group"
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

export default Permission;
