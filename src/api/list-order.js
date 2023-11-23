import HttClient from './axios-base'
export default {
  get: (queryParams) => HttClient.get('v1/ShopPanel/GetUserFactorReport', { params: queryParams }),
  statusList: () => HttClient.get('v1/ShopPanel/GetAllFactorStatuses'),
  changeStatus: (status) => HttClient.post('v1/ShopPanel/ChangeUserFactorStatus', status),
  factorBuy: (factorId) => HttClient.get(`v1/ShopPanel/GetItemFactorByFactorId?factorId=${factorId}`),
  factorPrint: (factorId) => HttClient.get(`v1/ShopPanel/PrintFactor`, { params: factorId }),
  UpdateTrackingCode: (factorIdAndTrackingCode) => HttClient.post(`v1/ShopPanel/UpdatePostalTrackingCode?factorId=${factorIdAndTrackingCode.factorId}&PostalTrackingCode=${factorIdAndTrackingCode.PostalTrackingCode}`),


}; 