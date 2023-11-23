import HttClient from './axios-base'
export default {
  get: (queryParams) => HttClient.get('v1/ShopPanel/GetMostBuyedUsers', { params: queryParams }),
}; 