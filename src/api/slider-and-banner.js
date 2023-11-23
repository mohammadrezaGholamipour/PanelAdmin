import HttClient from './axios-base'
export default {
  get: (queryParams) => HttClient.get('v1/Panel/GetAds', { params: queryParams }),
  getActionById: (actionsId) => HttClient.get(`v1/Panel/GetActionAppById?id=${actionsId}`),
  addAction: (title, type) => HttClient.post(`v1/Panel/AddActionApp?title=${title}&type=${type}`),
  editAction: (title, actionsId) => HttClient.post(`v1/Panel/EditActionApp?id=${actionsId}&title=${title}`),
  adsTypes: () => HttClient.get('v1/Panel/GetAdsTypes'),
  adsPages: () => HttClient.get('v1/Panel/GetAdsPages'),
  getAction: () => HttClient.get('v1/Panel/GetActionAppTypes'),
  delete: (itemId) => HttClient.post('v1/Panel/DeleteAds', itemId),
  new: (item) => HttClient.post('v1/Panel/AddAds', item),
  edit: (item) => HttClient.post('v1/Panel/EditAds', item),

}; 