const roleRoutes = {
  ADMIN: '/admin',
  NORMAL_USER: '/user',
  STORE_OWNER: '/owner',
};

export const getRoleHome = (role) => roleRoutes[role] || '/app';
