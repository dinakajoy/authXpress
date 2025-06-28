import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const apiUrl = process.env.REACT_APP_API;

const types = {
  userrole: "user-role",
  user: "users",
  permission: "permissions",
};

const DeleteModal = ({
  onClose,
  type,
  data,
}: {
  onClose: () => void;
  type: string;
  data: any;
}) => {
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function getTypeValue(type: string) {
    if (type in types) {
      return types[type as keyof typeof types];
    }
    return undefined;
  }
  const t = getTypeValue(type);

  const deleteMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${apiUrl}/${t}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [t] });
    },
    onError: () => {
      setError(`Error deleting ${type}`);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(data._id, {
      onSuccess: () => {
        setMessage(`${type} delete`.toUpperCase());
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error, onClose]);

  // permissions | user-role | users

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl z-10">
        <div className="flex justify-between items-center border-b pb-3">
          {type && <h2 className="text-xl font-semibold">Delete {type}</h2>}
          <button
            onClick={onClose}
            className="cursor-pointer bg-gray-300 text-gray-800 hover:bg-gray-400 py-1 px-2"
          >
            &times;
          </button>
        </div>
        <div className="py-4 my-4">
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
          <p className="text-gray-800 text-lg mb-4 font-medium">
            Are you sure you want to delete{" "}
            {(type === "user" || type === "permission"
              ? data.name
              : data.label
            ).toUpperCase()}
            ?
          </p>

          <div className="flex justify-between mt-8">
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
