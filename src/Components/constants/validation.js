export const validationMessages = {
  required: (fieldName) =>
    `${
      fieldName?.charAt(0).toUpperCase() + fieldName?.slice(1).toLowerCase()
    } is required.`,
  format: (fieldName) => ` ${fieldName} should be in correct format.`,
};

export const InputPlaceHolder = (fieldName) => {
  return `Enter ${fieldName?.toLowerCase()}`;
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}(?![^.\s])/;
