import Vue from 'vue'
import App from './components/App.vue'
// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import api from "@/api/apis";

Vue.prototype.$api = api;

// Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
