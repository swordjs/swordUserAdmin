import Vue from 'vue';
import App from './App';
import store from './store';
import plugin from './js_sdk/uni-admin/plugin';
import 'ant-design-vue/dist/antd.css';
import dayjs from 'dayjs';

import Antd from 'ant-design-vue';
Vue.config.productionTip = false;
Vue.use(Antd);
Vue.use(plugin);

// 过滤器
Vue.filter('formatTime', (value) => {
  return dayjs(value).format('YYYY-MM-DD HH:mm');
});

App.mpType = 'app';

const app = new Vue({
  store,
  ...App
});
app.$mount();
