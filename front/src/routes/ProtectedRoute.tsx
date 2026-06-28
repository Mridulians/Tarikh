// import { Navigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { user } = useAuth();

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;



// New ProtectedRoute using Outlet for nested routes

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
