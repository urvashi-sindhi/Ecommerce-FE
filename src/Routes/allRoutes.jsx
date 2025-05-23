import { Navigate } from "react-router-dom";

//login
import Login from "../Pages/Authentication/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/login", component: <Login /> },
];

export { authProtectedRoutes, publicRoutes };
