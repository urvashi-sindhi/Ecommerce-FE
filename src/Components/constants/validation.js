export const validationMessages = {
  required: (fieldName) =>
    `${
      fieldName?.charAt(0).toUpperCase() + fieldName?.slice(1).toLowerCase()
    } is required.`,
  format: (fieldName) => ` ${fieldName} should be in correct format.`,
  passwordLength: (fieldName, minLength) =>
    `${fieldName} should be at least ${minLength} characters.`,
  passwordComplexity: (fieldName) =>
    `${fieldName} should be an uppercase lowercase number and special characters.`,
  passwordsMatch: (fieldName, confirmFieldName) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } and ${confirmFieldName.toLowerCase()} should be same.`,
  maxLength: (fieldName, maxLength) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } should be maximum ${maxLength} digits.`,
  minLength: (fieldName, minLength) =>
    `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1).toLowerCase()
    } should be minimum ${minLength} digits.`,
  otpFormat: (fieldName) => `${fieldName} should be in number digit.`,
};

export const InputPlaceHolder = (fieldName) => {
  return `Enter ${fieldName?.toLowerCase()}`;
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}(?![^.\s])/;
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
export const otpRegex = /^\d{6}$/;
export const otpTypeRegex = /^\d{0,6}$/;
