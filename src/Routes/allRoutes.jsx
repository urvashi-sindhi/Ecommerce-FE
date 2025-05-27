import { Navigate } from "react-router-dom";

//login
import Login from "../Pages/Authentication/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import { DASHBOARD, LOGIN } from "../Api/ApiRoutes";

const authProtectedRoutes = [
  { path: DASHBOARD, component: <Dashboard /> },
  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: <Navigate to="/login" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: LOGIN, component: <Login /> },
];

export { authProtectedRoutes, publicRoutes };
