import React from "react";
import { Label, Input } from "reactstrap";

const BaseRadio = ({
  name,
  label,
  options = [],
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
  touched,
}) => {
  return (
    <div className="form-group">
      <Label className="form-label">{label}</Label>
      <div className="d-flex gap-2">
        {options.map((option) => (
          <div className="form-check" key={option.value}>
            <Input
              type="radio"
              name={name}
              id={`${name}${
                option.value.charAt(0).toUpperCase() + option.value.slice(1)
              }`}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
            />
            <Label
              className="form-check-label"
              htmlFor={`${name}${
                option.value.charAt(0).toUpperCase() + option.value.slice(1)
              }`}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      {touched && error && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default BaseRadio;
