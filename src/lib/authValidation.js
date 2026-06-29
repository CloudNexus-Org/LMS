const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

export function validateName(value) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "Name is required";
  return "";
}

export function validateEmail(value) {
  const raw = value ?? "";

  if (!raw.trim()) return "Email is required";
  if (/\s/.test(raw)) return "Email cannot contain spaces";
  if (!raw.includes("@")) return "Email must contain @";

  const trimmed = raw.trim();
  if (!EMAIL_REGEX.test(trimmed)) {
    return "Please enter a valid email address (e.g. user@gmail.com)";
  }

  return "";
}

export function validatePassword(value) {
  if (value == null || value.length === 0) return "Password is required";
  if (/^\s+$/.test(value)) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters long.";
  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (confirmPassword == null || confirmPassword.length === 0) {
    return "Please confirm your password";
  }
  if (confirmPassword !== password) return "Passwords do not match.";
  return "";
}

export function trimSignupValues(formData) {
  return {
    name: formData.name.trim(),
    email: formData.email.trim(),
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  };
}

export function trimLoginValues(formData) {
  return {
    email: formData.email.trim(),
    password: formData.password,
  };
}

export function trimForgotPasswordValues(formData) {
  return {
    email: formData.email.trim(),
  };
}

export function validateSignupForm(formData) {
  const values = trimSignupValues(formData);
  const errors = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: validateConfirmPassword(
      values.password,
      values.confirmPassword
    ),
  };

  return collectValidationResult(errors);
}

export function validateLoginForm(formData) {
  const values = trimLoginValues(formData);
  const errors = {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };

  return collectValidationResult(errors);
}

export function validateSignupField(name, formData) {
  const values = trimSignupValues(formData);

  switch (name) {
    case "name":
      return validateName(values.name);
    case "email":
      return validateEmail(values.email);
    case "password":
      return validatePassword(values.password);
    case "confirmPassword":
      return validateConfirmPassword(values.password, values.confirmPassword);
    default:
      return "";
  }
}

export function validateLoginField(name, formData) {
  const values = trimLoginValues(formData);

  switch (name) {
    case "email":
      return validateEmail(values.email);
    case "password":
      return validatePassword(values.password);
    default:
      return "";
  }
}

export function validateForgotPasswordForm(formData) {
  const values = trimForgotPasswordValues(formData);
  const errors = {
    email: validateEmail(values.email),
  };

  return collectValidationResult(errors);
}

export function validateForgotPasswordField(name, formData) {
  const values = trimForgotPasswordValues(formData);

  switch (name) {
    case "email":
      return validateEmail(values.email);
    default:
      return "";
  }
}

export function validateOtp(digits) {
  const code = Array.isArray(digits) ? digits.join("") : String(digits ?? "");

  if (!code) return "Please enter the 4-digit code";
  if (code.length < 4) return "Please enter all 4 digits";
  if (!/^\d{4}$/.test(code)) return "OTP must contain only numbers";

  return "";
}

export function validateOtpForm(otp) {
  return collectValidationResult({ otp: validateOtp(otp) });
}

function collectValidationResult(errors) {
  const activeErrors = Object.fromEntries(
    Object.entries(errors).filter(([, message]) => Boolean(message))
  );

  return {
    errors: activeErrors,
    isValid: Object.keys(activeErrors).length === 0,
  };
}
