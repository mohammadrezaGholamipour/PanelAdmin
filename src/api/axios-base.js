import localStorageService from '@/utils/local-storage-service'
import axios from 'axios';
/////////////////////////
const HttpClient = axios.create({
  baseURL: 'http://fadakmedia.hamrahefadak.ir/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});
///////////////////////////////////
HttpClient.interceptors.request.use(
  (config) => {
    config.headers['authorization'] = `Bearer ${localStorageService.getToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
///////////////////////////////////
HttpClient.interceptors.response.use(
  (response) => {
    if (
      response.headers['content-type'] ===
      'application/octet-stream;charset=UTF-8'
    ) {
      return response.data || null;
    }
    return response.data || null;
  },
  ////////////////////
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.log(error.code);
    }
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "Bad Request",
          //   textMain: "سرور نمی‌تواند یا نمی‌خواهد درخواست را پردازش کند، زیرا به نظر می‌رسد خطای مشتری است."
          // });
          break;
        case 401:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error",
          //   status: true,
          //   textHeader: "غیر مجاز",
          //   textMain: "درخواست فاقد اعتبارنامه معتبر احراز هویت برای منبع هدف است."
          // });
          localStorageService.removeToken();
          break;
        case 403:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error",
          //   status: true,
          //   textHeader: "Forbidden",
          //   textMain: "مشتری حق دسترسی به محتوا را ندارد."
          // });
          break;
        case 404:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "یافت نشد",
          //   textMain: "سرور نمی تواند منبع درخواستی را پیدا کند."
          // });
          break;
        case 405:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "روش مجاز نیست",
          //   textMain: "روش درخواست توسط سرور شناخته شده است اما غیر فعال شده است و نمی توان از آن استفاده کرد."
          // });
          break;
        case 408:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "مهلت زمانی درخواست",
          //   textMain: "سرور در مدت زمانی که آماده انتظار بود، پیام درخواست  کاملی را دریافت نکرد."
          // });
          break;
        case 411:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "طول مورد نیاز",
          //   textMain: "سرور از پذیرش درخواست بدون هدر Content-Length تعریف شده خودداری می کند."
          // });
          break;
        case 413:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "Payload Too Large",
          //   textMain: "موجودیت درخواست بزرگتر از محدودیت های تعریف شده توسط سرور است."
          // });
          break;
        case 414:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "URI Too Long",
          //   textMain: "URI ارائه شده برای سرور برای پردازش بیش از حد طولانی بود"
          // });
          break;
        case 415:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "نوع رسانه پشتیبانی نشده",
          //   textMain: "موجودیت درخواست دارای یک نوع رسانه است که سرور یا منبع آن را پشتیبانی نمی کند."
          // });
          break;
        case 500:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "خطای سرور داخلی",
          //   textMain: "سرور با یک وضعیت غیرمنتظره مواجه شده است که مانع از انجام درخواست شد."
          // });
          break;
        case 501:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "اجرا نشد",
          //   textMain: "سرور از عملکرد مورد نیاز برای انجام درخواست پشتیبانی نمی کند."
          // });
          break;
        case 502:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "Bad Gateway",
          //   textMain: "سرور به عنوان یک دروازه یا پروکسی عمل می کرد و یک پاسخ نامعتبر از سرور بالادستی دریافت کرد."
          // });
          break;
        case 503:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "سرور در دسترس نیست",
          //   textMain: "سرور در حال حاضر به دلیل اضافه بار موقت یا نگهداری برنامه ریزی شده قادر به رسیدگی به درخواست نیست."
          // });
          break;
        case 504:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "زمان پایان دروازه",
          //   textMain: "سرور به عنوان یک دروازه یا پروکسی عمل می کرد و پاسخی به موقع از سرور بالادست دریافت نکرد."
          // });
          break;
        case 505:
          // usePinia().setNotification({
          //   ...usePinia().state.notificationData,
          //   name: "error", status: true,
          //   textHeader: "نسخه HTTP پشتیبانی نمی شود",
          //   textMain: "سرور از نسخه اصلی HTTP که در پیام درخواست استفاده شده است، پشتیبانی نمی کند یا از آن امتناع می کند."
          // });
          break;
        default:
          console.log(`http client status : ${error.response.status}`);
      }
    }
    return Promise.reject(error);
  }
);
export default HttpClient;
