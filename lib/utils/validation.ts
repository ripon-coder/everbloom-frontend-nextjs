// Validation utilities
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateField = (value: string, rules: ValidationRule): string | null => {
  if (rules.required && !validateRequired(value)) {
    return rules.message || 'This field is required';
  }

  if (rules.minLength && value.length < rules.minLength) {
    return rules.message || `Minimum length is ${rules.minLength} characters`;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return rules.message || `Maximum length is ${rules.maxLength} characters`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message || 'Invalid format';
  }

  return null;
};

export const validateForm = (data: any, rules: { [key: string]: ValidationRule }): FormErrors => {
  const errors: FormErrors = {};

  Object.keys(rules).forEach(field => {
    const error = validateField(data[field] || '', rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};