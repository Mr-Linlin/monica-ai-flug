import Vue from 'vue'
import App from './component/App.vue'
import api from '@/api/apis'
import '../assets/css/font-icon/iconfont.css'
import '../assets/css/default.css'

Vue.config.productionTip = false

joinContent()
// injectJsInsert();
function joinContent() {
  const div = document.createElement('div')
  div.id = 'contentApp'
  document.body.appendChild(div)
}
Vue.prototype.$api = api

new Vue({
  render: (h) => h(App),
}).$mount('#contentApp')
function injectJsInsert() {
  // document.addEventListener("readystatechange", () => {
  //   const injectPath = "js/inject.js";
  //   const script = document.createElement("script");
  //   script.setAttribute("type", "text/javascript");
  //   script.src = chrome.extension.getURL(injectPath);
  //   document.head.appendChild(script);
  // });
  document.addEventListener('readystatechange', () => {
    const injectPath = 'js/inject.js'
    const script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.src = chrome.runtime.getURL(injectPath)
    document.head.appendChild(script)
  })
}
