import LocalStorageService from '@/utils/local-storage-service';
import { nextTick, reactive } from 'vue';
import categoryApi from "@/api/category";
import accountApi from "@/api/acoount";
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import groupApi from "@/api/group";
/////////////////////////////////
export const usePinia = defineStore('pinia', () => {
  const router = useRouter()
  const state = reactive({
    filterInputData: { categories: '', groups: '' },
    requestLoading: false,
    sideBarStatus: false,
    accountInfo: false,
    categories: false,
    groups: false,
    appWidth: null,
    notificationData: {
      textMain: 'این یک خطااست',
      textHeader: 'خطا',
      status: false,
      name: 'error',
      timer: 3000
    },
    breadCrumb: []
  })
  ///////////////////////////
  const handleSideBarStatus = () => {
    state.sideBarStatus = !state.sideBarStatus
  }
  ///////////////////////////
  const handleNotificationData = async (data) => {
    state.notificationData.status = false
    await nextTick();
    state.notificationData = data
  }
  ///////////////////////////
  const handleBreadCrumb = (data) => {
    state.breadCrumb = data
  }
  ///////////////////////////
  const handleRequestLoadingStatus = () => {
    state.requestLoading = !state.requestLoading
  }
  ///////////////////////////
  const requestGetAccountInfo = () => {
    accountApi.info()
      .then((response) => {
        state.accountInfo = response.data
      })
      .catch((error) => {
        console.log(error);
      })
  }
  ///////////////////////////
  const requestAccountLogOut = () => {
    state.requestLoading = true
    accountApi.logOut()
      .then(() => {
        LocalStorageService.removeToken();
        router.push('/login')
        state.accountInfo = false;
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        state.requestLoading = false
      })
  }
  ///////////////////////////
  const requestGetCategoryList = (search = "") => {
    categoryApi
      .get(search)
      .then((response) => {
        state.categories = response.data;
        if (response.data) {
          const filterTableData = []
          for (const category of response.data) {
            const item = {
              id: category.categoryId,
              name: category.categoryTitle,
            }
            filterTableData.push(item)
          }
          state.filterInputData.categories = filterTableData;
          state.filterInputData.categories.push({ id: 0, name: 'همه' })
          state.filterInputData.categories.sort((a, b) => a.id - b.id)
        }
      })
      .catch(() => {
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          name: "error",
          status: true,
          textHeader: "خطا",
          textMain: "لیست دسته بندی ها دریافت نشد",
        });
        state.categories.data = [];
      });
  };
  const requestGetGroupList = () => {
    groupApi
      .get()
      .then((response) => {
        state.groups = response.data;
        if (response.data) {
          const filterTableData = []
          for (const group of response.data) {
            const item = {
              id: group.groupId,
              name: group.groupTitle,
            }
            filterTableData.push(item)
          }
          state.filterInputData.groups = filterTableData;
          state.filterInputData.groups.push({ id: 0, name: 'همه' })
          state.filterInputData.groups.sort((a, b) => a.id - b.id)
        }
      })
      .catch(() => {
        pinia.handleNotificationData({
          ...pinia.state.notificationData,
          name: "error",
          status: true,
          textHeader: "خطا",
          textMain: "لیست گروه ها دریافت نشد",
        });
        state.groups.data = [];
      });
  };
  ///////////////////////////
  return { state, handleSideBarStatus, handleNotificationData, handleRequestLoadingStatus, requestGetAccountInfo, requestAccountLogOut, handleBreadCrumb, requestGetCategoryList, requestGetGroupList }
})
