import React, { useEffect, useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { LOGIN } from "./apiRoutes";

const AuthProtected = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setAuthorization(token);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={{ pathname: LOGIN, state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = (props) => {
  const token = localStorage.getItem("user");

  return (
    <Route
      {...props}
      render={(routeProps) => {
        if (!token) {
          return (
            <Navigate
              to={{ pathname: LOGIN, state: { from: routeProps.location } }}
            />
          );
        }
        return <props.component {...routeProps} />;
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
