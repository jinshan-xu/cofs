import Vue from "vue";
import ElementUI from "element-ui";
import './assets/styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/display.css';
import App from "./App.vue";
import router from "./router/index";

Vue.use(ElementUI);

const vue = new Vue({
  el: "#app",
  router,
  render: h => h(App)
});

export default vue;
