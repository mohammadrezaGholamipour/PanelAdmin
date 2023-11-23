import HttClient from './axios-base'
export default {
  get: (queryParams) => HttClient.get('v1/ShopPanel/GetStoreReport', { params: queryParams }),
}; 