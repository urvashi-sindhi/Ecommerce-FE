import React from "react";
import { Input } from "reactstrap";

const BaseSelect = ({
  options,
  loading,
  loadingText,
  defaultText,
  valueKey = "id",
  labelKey = "name",
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  invalid,
  className,
}) => {
  return (
    <Input
      type="select"
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled || loading}
      invalid={invalid}
      className={className}
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
  );
};

export default BaseSelect;
