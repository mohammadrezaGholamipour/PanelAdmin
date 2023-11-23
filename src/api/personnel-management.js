import HttClient from './axios-base'
export default {
  get: (queryParams) => HttClient.get('v1/Panel/GetPersonel', { params: queryParams }),
  delete: (personnelId) => HttClient.post('v1/Panel/DeletePersonnel', personnelId),
  new: (personnel) => HttClient.post('v1/Panel/SavePersonnel', personnel),
  edit: (personnel) => HttClient.post('v1/Panel/EditPersonnel', personnel),
  getById: (queryParams) => HttClient.get('v1/Panel/GetPersonelById', { params: queryParams }),
  getRolesById: (personnelId) => HttClient.get(`v1/Panel/GetRoles?userId=${personnelId}`),
  addRole: (roleId, personnelId) => HttClient.post(`v1/Panel/AddRoleToUser?roleId=${roleId}&userId=${personnelId}`),
  deleteRole: (roleId, personnelId) => HttClient.post(`v1/Panel/DeleteUserRole?roleId=${roleId}&userId=${personnelId}`),
}; 