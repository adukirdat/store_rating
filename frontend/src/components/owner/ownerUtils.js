export const formatAverageRating = (rating) => rating === null || rating === undefined ? 'Not rated yet' : `${Number(rating).toFixed(1)} / 5`;

export const getOwnerApiMessage = (error) => {
  if (error.status === 401) return 'Your session has expired. Please log in again.';
  if (error.status === 403) return 'You do not have permission to access this page.';
  if (error.status === 404) return 'No store is assigned to your account.';
  return 'Something went wrong. Please try again.';
};
