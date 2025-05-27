import React from "react";
import PropTypes from "prop-types";
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
      {loader ? "Loading..." : label || children}
      {endIcon && <span className="ms-2">{endIcon}</span>}
    </Button>
  );
};

BaseButton.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "info",
    "warning",
    "link",
    "light",
  ]),
  label: PropTypes.string,
  type: PropTypes.oneOf(["button", "reset", "submit"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  loader: PropTypes.bool,
  children: PropTypes.node,
};

export default BaseButton;
