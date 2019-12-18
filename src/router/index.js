import Vue from "vue";
import VueRouter from "vue-router";
import Header from 'src/pages/cofs-header/index'

Vue.use(VueRouter);

export const routes = [{
  path: '/',
  component: Header
}];

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
