import HttClient from './axios-base'
export default {
  get: (queryParams) => HttClient.get('v1/Panel/GetTagAdmin', { params: queryParams }),
  delete: (tagId) => HttClient.post('v1/Panel/DeleteTag', tagId),
  new: (tag) => HttClient.post('v1/Panel/SaveTagforItem', tag),
  edit: (tag) => HttClient.post('v1/Panel/EditTag', tag),
}; 