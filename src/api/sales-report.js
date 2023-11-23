import HttClient from './axios-base'
export default {
  get: (queryParams) => HttClient.get('v1/ShopPanel/GetSalesReport', { params: queryParams }),
  itemType: () => HttClient.get('v1/ShopPanel/GetItemType'),
}; 