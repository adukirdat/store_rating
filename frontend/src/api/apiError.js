const TIMEOUT_MESSAGE = 'The request took too long. Please try again.';
const RATE_LIMIT_MESSAGE = 'Too many authentication attempts. Please try again later.';

export const shouldClearSessionOnUnauthorized = (error, normalizedError) => !(
  error.config?.method === 'patch'
  && error.config?.url === '/auth/update-password'
  && normalizedError.status === 401
  && normalizedError.message === 'Current password is incorrect.'
);

export const normalizeApiError = (error) => {
  const response = error?.response;

  if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') {
    return { status: 408, message: TIMEOUT_MESSAGE, errors: [] };
  }

  if (response?.status === 429) {
    return {
      status: 429,
      message: response.data?.message || RATE_LIMIT_MESSAGE,
      errors: response.data?.errors || [],
    };
  }

  return {
    status: response?.status || 500,
    message: response?.data?.message || 'Something went wrong. Please try again.',
    errors: response?.data?.errors || [],
  };
};

export const getResilienceApiMessage = (error) => (
  error.status === 408 || error.status === 429 ? error.message : null
);
