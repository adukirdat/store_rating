const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validatePassword = (password) => {
  if (password.length < 8 || password.length > 16) return 'Password must be 8 to 16 characters long.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character.';
  return '';
};

export const validateLogin = ({ email, password }) => ({
  email: !email.trim() ? 'Email is required.' : (!emailPattern.test(email) ? 'Enter a valid email address.' : ''),
  password: password ? '' : 'Password is required.',
});

export const validateSignup = ({ name, email, password, address }) => ({
  name: name.trim().length < 20 || name.trim().length > 60 ? 'Name must be 20 to 60 characters long.' : '',
  email: !email.trim() ? 'Email is required.' : (!emailPattern.test(email) ? 'Enter a valid email address.' : ''),
  password: validatePassword(password),
  address: !address.trim() ? 'Address is required.' : (address.trim().length > 400 ? 'Address must not exceed 400 characters.' : ''),
});

export const validatePasswordUpdate = ({ currentPassword, newPassword }) => ({
  currentPassword: currentPassword ? '' : 'Current password is required.',
  newPassword: validatePassword(newPassword),
});

export const hasErrors = (errors) => Object.values(errors).some(Boolean);

export const getApiErrors = (error, context) => {
  const fields = (error.errors || []).reduce((result, item) => ({ ...result, [item.field]: item.message }), {});
  if (Object.keys(fields).length) return { fields, message: 'Please correct the highlighted fields.' };
  if (error.status === 409) return { fields, message: 'An account with this email already exists.' };
  if (error.status === 401 && context === 'login') return { fields, message: 'Invalid email or password.' };
  if (error.status === 401 && context === 'password') return { fields, message: 'Current password is incorrect.' };
  if ([400, 403, 404].includes(error.status)) return { fields, message: 'We could not complete that request. Please check your details and try again.' };
  return { fields, message: 'Something went wrong. Please try again.' };
};
