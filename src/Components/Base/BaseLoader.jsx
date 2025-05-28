import React from "react";
import { Spinner } from "reactstrap";

const Loader = ({ size = "sm", className = "" }) => {
  return <Spinner size={size} className={className} />;
};

export default Loader;
