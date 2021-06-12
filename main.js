import Vue from "vue";
import App from "./App";
import store from "./store";
import plugin from "./js_sdk/uni-admin/plugin";
import "ant-design-vue/dist/antd.css";

import Antd from "ant-design-vue";
Vue.config.productionTip = false;
Vue.use(Antd);
Vue.use(plugin);

App.mpType = "app";

const app = new Vue({
  store,
  ...App,
});
app.$mount();
