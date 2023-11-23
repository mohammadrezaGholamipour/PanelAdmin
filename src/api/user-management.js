import HttClient from './axios-base'
export default {
  get: (queryParams) => HttClient.get('v1/Panel/GetUser', { params: queryParams }),
  getUserFactors: (queryParams) => HttClient.get('v1/ShopPanel/GetUserFactors', { params: queryParams }),
  getUserAddressList: (queryParams) => HttClient.get('v1/ShopPanel/GetUserAddressList', { params: queryParams }),
  getUserWalletList: (queryParams) => HttClient.get('v1/ShopPanel/GetUserWalletList', { params: queryParams }),
  getUserScores: (queryParams) => HttClient.get('v1/ShopPanel/GetUserScores', { params: queryParams }),
  delete: (userId) => HttClient.post('v1/Panel/RemoveUser', userId),
};