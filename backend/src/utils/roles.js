const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  NORMAL_USER: 'NORMAL_USER',
  STORE_OWNER: 'STORE_OWNER',
});

const ROLE_VALUES = Object.freeze(Object.values(ROLES));

module.exports = { ROLES, ROLE_VALUES };
