export const normalizeApiError = (error) => {
  const response = error?.response;

  return {
    status: response?.status || 500,
    message: response?.data?.message || error?.message || 'Something went wrong. Please try again.',
    errors: response?.data?.errors || [],
  };
};
