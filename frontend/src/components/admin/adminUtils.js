export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const hasErrors = (errors) => Object.values(errors).some(Boolean);

export const validateUser = ({ name, email, password, address, role }) => ({
  name: name.trim().length < 20 || name.trim().length > 60 ? 'Name must be 20 to 60 characters long.' : '',
  email: !emailPattern.test(email) ? 'Enter a valid email address.' : '',
  password: password.length < 8 || password.length > 16 ? 'Password must be 8 to 16 characters long.' : (!/[A-Z]/.test(password) ? 'Password must contain at least one uppercase letter.' : (!/[^A-Za-z0-9]/.test(password) ? 'Password must contain at least one special character.' : '')),
  address: !address.trim() ? 'Address is required.' : (address.trim().length > 400 ? 'Address must not exceed 400 characters.' : ''),
  role: ['ADMIN', 'NORMAL_USER'].includes(role) ? '' : 'Choose an allowed role.',
});

export const validateStore = ({ name, email, address, ownerId }) => ({
  name: name.trim() ? '' : 'Store name is required.',
  email: !emailPattern.test(email) ? 'Enter a valid email address.' : '',
  address: !address.trim() ? 'Address is required.' : (address.trim().length > 400 ? 'Address must not exceed 400 characters.' : ''),
  ownerId: ownerId ? '' : 'Select a store owner.',
});

export const getApiMessage = (error) => {
  if (error.errors?.length) return 'Please correct the highlighted fields.';
  if (error.status === 401) return 'Your session has expired. Please log in again.';
  if (error.status === 403) return 'You do not have permission to perform this action.';
  if (error.status === 404) return 'The requested resource was not found.';
  if (error.status === 409) return 'A record with these details already exists.';
  if (error.status === 400) return 'Please check the entered information.';
  return 'Something went wrong. Please try again.';
};

export const getFieldErrors = (error) => (error.errors || []).reduce((all, item) => ({ ...all, [item.field]: item.message }), {});
export const formatRole = (role) => role?.replace('_', ' ') || '—';
export const formatRating = (rating) => rating === null || rating === undefined ? 'No ratings' : Number(rating).toFixed(1);
