import React from "react";
import { Button, Spinner } from "reactstrap";

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
      {loader && <Spinner size="sm" className="me-2" />}
      {startIcon && <span className="me-2">{startIcon}</span>}
      {loader ? loader : label || children}
      {endIcon && <span className="ms-2">{endIcon}</span>}
    </Button>
  );
};

export default BaseButton;
