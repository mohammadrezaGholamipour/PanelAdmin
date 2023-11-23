import HttClient from './axios-base'
export default {
  get: (queryParams) => HttClient.get('v1/Panel/GetComment', { params: queryParams }),
  ActiveDeactiveComment: (commentId) => HttClient.post(`v1/Panel/ActiveDeactiveComment?commentId=${commentId}`),
  deleteComment: (commentId) => HttClient.post(`v1/Panel/DeleteDeactiveComment?commentId=${commentId}`),
  newAdminComment: (comment) => HttClient.post('v1/Panel/AddComment', comment),
}; 