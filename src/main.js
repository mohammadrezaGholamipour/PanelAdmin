import VueTransitions from '@morev/vue-transitions';
import dialog from '@/components/dialog.vue'
import './utils/convert-persian-number';
import '@morev/vue-transitions/styles';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import '@/assets/css/index.css';
import router from './router';
import App from './App.vue';
///////////////////////////
const app = createApp(App)
/////////////////////////
app.component('Dialog', dialog);
app.use(VueTransitions)
app.use(createPinia())
app.use(router)
/////////////////
app.mount('#app')
