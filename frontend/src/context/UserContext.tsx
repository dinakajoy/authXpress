import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { IUserWithRole } from "../interfaces/user";
import PageLoader from "../components/PageLoader";

interface UserContextType {
  user: IUserWithRole | null;
  setUser: (user: IUserWithRole | null) => void;
  isAuthenticated: boolean;
  userPermissions: string[];
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUserWithRole | null>(null);
  const [permissionsMap, setPermissionsMap] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      // Verify the token by making an API call
      try {
        const currentUserRes = await axios.get(
          `${process.env.REACT_APP_API}/auth/current-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const allPermissionsRes = await axios.get(
          `${process.env.REACT_APP_API}/permissions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const allPermissions = allPermissionsRes.data.permissions;
        const map: Record<string, string> = {};
        allPermissions.forEach((perm: any) => {
          map[perm._id] = perm.name;
        });

        setUser(currentUserRes.data);
        setPermissionsMap(map);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [user]);

  if (loading) return <PageLoader />;
  const resolvedPermissions = user?.role?.permission.map((id) => permissionsMap[id]) || [];

  const value: UserContextType = {
    user,
    setUser,
    isAuthenticated: !!user,
    userPermissions: resolvedPermissions,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
