import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white border-b px-6 flex items-center justify-between">

      <div>
        <h2 className="text-xl font-semibold text-underline text-red-600">
          Welcome Back
        </h2>

        <p className="text-sm text-gray-500">
          Manage your legal cases efficiently
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="text-right">
          <p className="font-semibold">
            {user?.name}
          </p>

          <p className="text-sm text-gray-500">
            {user?.role}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {user?.name?.charAt(0)}
        </div>

      </div>
    </div>
  );
};

export default Navbar;