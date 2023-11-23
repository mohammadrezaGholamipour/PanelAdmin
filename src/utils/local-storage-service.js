const LocalStorageService = {
  getToken: () => {
    return window.localStorage.getItem("tokenPanel");
  },
  ///////////////////////////////////////////////
  setToken: (token) => {
    window.localStorage.setItem("tokenPanel", token);
  },
  ///////////////////////////////////////////////
  removeToken: () => {
    window.localStorage.removeItem('tokenPanel');
  },
};
export default LocalStorageService;
