import React from "react";
import { Input, Label } from "reactstrap";

const BaseSelect = ({
  options,
  loading,
  loadingText,
  defaultText,
  valueKey = "id",
  labelKey = "name",
  name,
  label,
  value,
  onChange,
  onBlur,
  disabled = false,
  invalid,
  error,
  touched,
}) => {
  return (
    <div className="form-group">
      <Label className="form-label">{label}</Label>
      <Input
        type="select"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled || loading}
        invalid={invalid}
      >
        <option value="">{defaultText}</option>
        {loading ? (
          <option disabled>{loadingText}</option>
        ) : (
          options.map((option) => (
            <option key={option[valueKey]} value={option[valueKey]}>
              {option[labelKey]}
            </option>
          ))
        )}
      </Input>
      {touched && error && <div className="text-danger">{error}</div>}
    </div>
  );
};

export default BaseSelect;
