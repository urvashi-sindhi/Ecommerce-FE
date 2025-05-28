import { Navigate } from "react-router-dom";

//login
import Login from "../Pages/Authentication/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import ForgetPasswordPage from "../Pages/Authentication/ForgotPassword";
import { DASHBOARD, FORGOT_PASSWORD, LOGIN } from "./commonRoutes";

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
  { path: FORGOT_PASSWORD, component: <ForgetPasswordPage /> },
];

export { authProtectedRoutes, publicRoutes };
