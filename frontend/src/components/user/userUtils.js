export const formatRating = (rating) => rating === null || rating === undefined ? 'Not rated' : `${Number(rating).toFixed(1)} / 5`;

export const getUserApiMessage = (error) => {
  if (error.errors?.length || error.status === 400) return 'Please choose a whole-number rating from 1 to 5.';
  if (error.status === 401) return 'Your session has expired. Please log in again.';
  if (error.status === 403) return 'You do not have permission to access this page.';
  if (error.status === 404) return 'The store was not found.';
  return 'Something went wrong. Please try again.';
};
