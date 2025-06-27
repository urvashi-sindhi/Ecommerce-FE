import { Navigate } from "react-router-dom";

//login
import Login from "../Pages/Authentication/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import ForgetPasswordPage from "../Pages/Authentication/ForgotPassword";
import {
  ADD_PRODUCT,
  CATEGORY,
  CHANGE_PASSWORD,
  DASHBOARD,
  EDIT_PRODUCT,
  FORGOT_PASSWORD,
  LOGIN,
  PRODUCT,
  PROFILE,
} from "./apiRoutes";
import UserProfile from "../Pages/Authentication/UserProfile";
import ChangePassword from "../Pages/Authentication/ChangePassword";
import Categories from "../Pages/Category/Categories";
import Products from "../Pages/Product/index";
import AddProduct from "../Pages/Product/addProduct";
import EditProduct from "../Pages/Product/editProduct";
import ViewProduct from "../Pages/Product/viewProduct";
import UserReport from "../Pages/Report/UserReport";
import OrderReport from "../Pages/Report/OrderReport";

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
  { path: PRODUCT, component: <Products /> },
  { path: ADD_PRODUCT, component: <AddProduct /> },
  { path: `${EDIT_PRODUCT}/:id`, component: <EditProduct /> },
  { path: "/product/view/:id", component: <ViewProduct /> },
  { path: "/user-report", component: <UserReport /> },
  { path: "/report/order", component: <OrderReport /> },
];

const publicRoutes = [
  // Authentication Page
  { path: LOGIN, component: <Login /> },
  { path: FORGOT_PASSWORD, component: <ForgetPasswordPage /> },
];

export { authProtectedRoutes, publicRoutes };
