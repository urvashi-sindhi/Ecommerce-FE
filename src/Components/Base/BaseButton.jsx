import React from "react";
import { Button } from "reactstrap";
import Loader from "./BaseLoader";
import BaseLoader from "./BaseLoader";

const BaseButton = ({
  color = "primary",
  label,
  type = "button",
  onClick,
  disabled,
  className,
  startIcon,
  endIcon,
  size,
  loader,
  children,
}) => {
  return (
    <Button
      color={color}
      type={type}
      onClick={onClick}
      disabled={disabled || loader}
      className={className}
      size={size}
    >
      {loader && <BaseLoader size="sm" className="me-2" />}
      {startIcon && <span className="me-2">{startIcon}</span>}
      {loader ? loader : label || children}
      {endIcon && <span className="ms-2">{endIcon}</span>}
    </Button>
  );
};

export default BaseButton;
