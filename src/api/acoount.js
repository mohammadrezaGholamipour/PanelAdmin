import HttpClient from './axios-base'
export default {
  login: (userLogin) => HttpClient.post('v1/Activations/loginadmin', userLogin),
  logOut: () => HttpClient.post('v1/Activations/logOut'),
  info: () => HttpClient.post("v1/Users/GetUserInfo"),
  edit: (user) => HttpClient.post("v1/Users/EditUser", user),
};