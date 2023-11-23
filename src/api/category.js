import HttClient from './axios-base'
export default {
  get: (search) => HttClient.get(`v1/Panel/GetCategory?searchText=${search}`),
  new: (category) => HttClient.post('v1/Panel/AddCategory', category),
  edit: (category) => HttClient.post('v1/Panel/EditCategory', category),
  delete: (categoryId) => HttClient.post(`v1/Panel/DeleteCategory/${categoryId}`),
};