import HttClient from './axios-base'
export default {
  get: () => HttClient.get('v1/Panel/GetGroup?pageSize=10&pageNumber=1'),

}; 