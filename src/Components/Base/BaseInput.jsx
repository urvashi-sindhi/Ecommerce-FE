import React, { useState } from "react";
import {
  FormFeedback,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BaseInput = ({
  autoComplete,
  className = "form-control",
  defaultValue,
  disabled,
  error,
  fullWidth,
  name,
  onChange,
  placeholder,
  label,
  readOnly,
  required,
  type = "text",
  value,
  tooltip,
  tooltipIcon,
  tooltipIconColor,
  tooltipText,
  accept,
  append,
  handleBlur,
  prepend,
  touched,
  maxLength,
  invalid,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyInput = (event) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
      ".",
    ];
    if (type === "number" && ["e", "E", "+", "-"].includes(event.key)) {
      event.preventDefault();
    }
    if (type === "number" && event.code === "Space") {
      event.preventDefault();
    }
    if (type === "email" && event.code === "Space") {
      event.preventDefault();
    }
    if (
      type === "number" &&
      !allowedKeys.includes(event.key) &&
      !event.key.match(/^[0-9]$/)
    ) {
      event.preventDefault();
    }

    if (
      type === "number" &&
      maxLength &&
      value?.toString().length >= maxLength
    ) {
      const isEditing = allowedKeys.includes(event.key);
      if (!isEditing) {
        event.preventDefault();
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isInvalid = invalid || (error && touched);

  return (
    <div className={`text-start ${fullWidth ? "w-100" : ""}`}>
      {label && (
        <>
          <Label htmlFor={name} className="form-label">
            {label}
            {required && <span className="text-danger">*</span>}
          </Label>
          {tooltip && (
            <i
              className={`mdi mdi-${tooltipIcon} ms-1 text-${tooltipIconColor} cursor-pointer tooltip-container`}
            >
              <span className="tooltip-text bottom-5 mt-4">{tooltipText}</span>
            </i>
          )}
        </>
      )}
      <InputGroup>
        {prepend && <InputGroupText>{prepend}</InputGroupText>}
        <Input
          id={name}
          name={name}
          className={`${className} shadow-none`}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          disabled={disabled}
          invalid={isInvalid}
          placeholder={placeholder}
          accept={accept}
          onKeyDown={handleKeyInput}
          readOnly={readOnly}
          onBlur={onBlur || handleBlur}
          maxLength={type !== "number" ? maxLength : undefined}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          onChange={onChange}
        />
        {append && (
          <InputGroupText>
            <span className="input-group-text">{append}</span>
          </InputGroupText>
        )}
        {type === "password" && (
          <InputGroupText
            onClick={handleClickShowPassword}
            style={{ cursor: "pointer" }}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </InputGroupText>
        )}
      </InputGroup>
      {isInvalid && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};


export default BaseInput;
