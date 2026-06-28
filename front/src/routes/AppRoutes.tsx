// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import Dashboard from "../pages/Dashboard";
// import Clients from "../pages/Clients";
// import CaseDetails from "../pages/CaseDetails";
// import Cases from "../pages/Cases";
// import ClientDetails from "../pages/ClientDetails";
// import ProtectedRoute from "./ProtectedRoute";

// const AppRoutes = () => {
//   const { user, loading } = useAuth();

//   // 🚨 important: block render until auth loads
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route
//           path="/login"
//           element={!user ? <Login /> : <Navigate to="/" />}
//         />
//         <Route
//           path="/register"
//           element={!user ? <Register /> : <Navigate to="/" />}
//         />

//         {/* Protected */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/clients"
//           element={
//             <ProtectedRoute>
//               <Clients />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/cases/:id"
//           element={
//             <ProtectedRoute>
//               <CaseDetails />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/cases"
//           element={
//             <ProtectedRoute>
//               <Cases />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/clients/:id"
//           element={
//             <ProtectedRoute>
//               <ClientDetails />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default AppRoutes;



// New AppRoutes with MainLayout and nested routes

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import Clients from "../pages/Clients";
import ClientDetails from "../pages/ClientDetails";

import Cases from "../pages/Cases";
import CaseDetails from "../pages/CaseDetails";

import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../components/layout/MainLayout";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        {/* PROTECTED ROUTES */}

        <Route element={<ProtectedRoute />}>
          {/* MAIN LAYOUT */}

          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />

            <Route path="/clients" element={<Clients />} />

            <Route path="/clients/:id" element={<ClientDetails />} />

            <Route path="/cases" element={<Cases />} />

            <Route path="/cases/:id" element={<CaseDetails />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
