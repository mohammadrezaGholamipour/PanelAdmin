import HttClient from './axios-base'
export default {
  get: () => HttClient.get('v1/Panel/GetRoles'),
  delete: (roleId) => HttClient.post(`v1/Panel/DeleteRole?id=${roleId}`),
  new: (role) => HttClient.post(`v1/Panel/AddRole?roleTitle=${role.roleTitle}&key=${role.key}`),
  getRolePermissionsById: (roleId) => HttClient.get(`v1/Panel/GetRolePermissionsByRoleId?roleId=${roleId}`),
  editRolePermission: (data) => HttClient.post(`v1/Panel/EditRolePermission`, data),

}; 