import Role from "../components/Role";
import Permission from "../components/Permission";

function UserRoleAndPermissions() {
  return (
    <>
      <h1 className="bg-gray-300 text-gray-800 text-2xl font-bold mb-8 text-center p-4">
        RBAC Management
      </h1>
      <div className="p-6">
        <Permission />
        <div className="my-12" />
        <Role />
      </div>
    </>
  );
}

export default UserRoleAndPermissions;
