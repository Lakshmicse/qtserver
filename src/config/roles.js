const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'onetimeTasks'],
  driver: ['getUsers', 'manageUsers', 'onetimeTasks'],
  dispatcher: ['getUsers', 'manageUsers', 'onetimeTasks'],
  superadmin: ['getUsers', 'manageUsers', 'onetimeTasks'],
  hradmin: ['getUsers', 'manageUsers', 'onetimeTasks'],
  hrreviewer: ['getUsers', 'manageUsers', 'onetimeTasks'],
  hrapprover: ['getUsers', 'manageUsers', 'onetimeTasks'],
  payrollreviewer: ['getUsers', 'manageUsers', 'onetimeTasks'],
  hrprocessor: ['getUsers', 'manageUsers', 'onetimeTasks'],
  payrolladmin: ['getUsers', 'manageUsers', 'onetimeTasks'],
  SYSTEM_SCHEDULER: ['onetimeTasks'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
