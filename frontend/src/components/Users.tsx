import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { IUser } from "../interfaces/user";
import { fetchRoles, fetchUsers } from "../utils";
import { SquarePen, Trash2 } from "lucide-react";
import { IRole } from "../interfaces/roles-permissions";

const apiUrl = process.env.REACT_APP_API;
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  email: Yup.string().required("Email is required"),
});

const Users = () => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<IUser | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const {
    data: userRoles,
    isLoading: loadingRoles,
    error: roleError,
  } = useQuery({
    queryKey: ["userRoles"],
    queryFn: fetchRoles,
  });

  const {
    data: users,
    isLoading: loadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const userMutation = useMutation<{ message: string }, Error, IUser>({
    mutationFn: async (newUser) => {
      const { data } = await axios.put(
        `${apiUrl}/users/${user?._id}`,
        newUser,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return data.newUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      setError("Error saving role");
    },
  });

  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
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
    setUser(null);
    setShowSidebar(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Users</h2>
        </div>

        {loadingUsers || loadingRoles ? <p>Loading...</p> : null}
        {(usersError || roleError) && (
          <p className="w-full bg-red-50 text-red-700 p-2 rounded-lg font-semibold my-2">
            {usersError?.message || roleError?.message}
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
                users.map((user: IUser) => (
                  <tr key={user._id}>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email || "-"}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">
                      <div className="flex justify-center items-center gap-4">
                        <span className="text-blue-600 hover:text-blue-800 transition duration-300 cursor-pointer">
                          <SquarePen
                            size={20}
                            onClick={() => {
                              setUser(user);
                              setShowSidebar(true);
                            }}
                          />
                        </span>
                        {/* <span className="text-red-600 hover:text-red-800 transition duration-300 cursor-pointer">
                          <Trash2
                            size={20}
                            onClick={() => {
                              setUser(user);
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
              <h3 className="text-xl font-bold mb-3">Edit User</h3>

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
                  userMutation.mutate(values, {
                    onSuccess: () => {
                      resetForm();
                      setMessage("User updated");
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
                        placeholder="Enter user name"
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
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        className="w-full border p-2 rounded-md"
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div className="text-left my-4">
                      <label className="block text-sm font-medium mb-2">
                        Role
                      </label>
                      <Field
                        as="select"
                        name="role"
                        className="w-full border p-2 rounded-md mb-2"
                      >
                        <option value="" disabled>
                          Assign role
                        </option>
                        {userRoles &&
                          userRoles.map((role: IRole) => (
                            <option key={role._id} value={role._id}>
                              {role.label}
                            </option>
                          ))}
                      </Field>
                      <ErrorMessage
                        name="role"
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

export default Users;
