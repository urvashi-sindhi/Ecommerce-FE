import { Navigate } from "react-router-dom";

//login
import Login from "../Pages/Authentication/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import ForgetPasswordPage from "../Pages/Authentication/ForgotPassword";
import {
  CATEGORY,
  CHANGE_PASSWORD,
  DASHBOARD,
  FORGOT_PASSWORD,
  LOGIN,
  PROFILE,
} from "./apiRoutes";
import UserProfile from "../Pages/Authentication/UserProfile";
import ChangePassword from "../Pages/Authentication/ChangePassword";
import Categories from "../Pages/Category/Categories";

const authProtectedRoutes = [
  { path: DASHBOARD, component: <Dashboard /> },
  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: <Navigate to={LOGIN} />,
  },
  { path: "*", component: <Navigate to={DASHBOARD} /> },
  { path: PROFILE, component: <UserProfile /> },
  { path: CHANGE_PASSWORD, component: <ChangePassword /> },
  { path: CATEGORY, component: <Categories /> },
];

const publicRoutes = [
  // Authentication Page
  { path: LOGIN, component: <Login /> },
  { path: FORGOT_PASSWORD, component: <ForgetPasswordPage /> },
];

export { authProtectedRoutes, publicRoutes };
