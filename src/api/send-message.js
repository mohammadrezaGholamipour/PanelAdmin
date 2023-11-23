import HttClient from './axios-base'
export default {
  get: (queryParams) => HttClient.get('v1/Panel/GetPushMessage', { params: queryParams }),
  getAction: () => HttClient.get('v1/Panel/GetActionAppTypes'),
  getActionById: (actionsId) => HttClient.get(`v1/Panel/GetActionAppById?id=${actionsId}`),
  addAction: (title, type) => HttClient.post(`v1/Panel/AddActionApp?title=${title}&type=${type}`),
  editAction: (title, actionsId) => HttClient.post(`v1/Panel/EditActionApp?id=${actionsId}&title=${title}`),
  getMesseageById: (queryParams) => HttClient.get('v1/Panel/GetPushMessageById', { params: queryParams }),
  newMessage: (message) => HttClient.post('v1/Panel/SavePushMessage', message),
  editMessage: (message) => HttClient.post('v1/Panel/EditPushMessage', message),
  sendMessage: (messageId) => HttClient.post('v1/Panel/SendPushMessage', messageId),
}; 