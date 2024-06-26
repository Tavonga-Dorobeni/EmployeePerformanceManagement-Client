import "animate.css";
import "flatpickr/dist/flatpickr.css";
import "simplebar-vue/dist/simplebar-vue.js";
import "simplebar-vue/dist/simplebar.min.css";
import "simplebar/dist/simplebar.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { createApp, h } from "vue";
// import { h } from "vue";
import VueFlatPickr from "vue-flatpickr-component";
import VueGoodTablePlugin from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import VueSweetalert2 from "vue-sweetalert2";
import VueTippy from "vue-tippy";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueApexCharts from "vue3-apexcharts";
import VueClickAway from "vue3-click-away";
import App from "./App.vue";
import "./assets/scss/auth.scss";
import "./assets/scss/tailwind.scss";
import router from "./router";
import store from "./store";
import VCalendar from "v-calendar";
import "v-calendar/dist/style.css";
import {emitter} from './mitt';
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import VueSocketIOExt from 'vue-socket.io-extended';
import io from "socket.io-client";

const socket = io('http://localhost:8080');
// const socket = io('https://medicalinsurancefraudprevention-server.onrender.com');

// window.emitter = emitter;

if (localStorage.users === undefined) {
  let users = [
    {
      name: "example",
      email: "example@gmail.com",
      password: "example",
    },
  ];
  localStorage.setItem("users", JSON.stringify(users));
}

// check localStorage theme for dark light bordered
if (localStorage.theme === "dark") {
  document.body.classList.add("dark");
  store.state.theme = "dark";
  store.state.isDark = true;
} else {
  document.body.classList.add("light");
  store.state.theme = "light";
  store.state.isDark = false;
}
if (localStorage.semiDark === "true") {
  document.body.classList.add("semi-dark");
  store.state.semidark = true;
  store.state.semiDarkTheme = "semi-dark";
} else {
  document.body.classList.add("semi-light");
  store.state.semidark = false;
  store.state.semiDarkTheme = "semi-light";
}
// check loacl storege for menuLayout
if (localStorage.menuLayout === "horizontal") {
  store.state.menuLayout = "horizontal";
} else {
  store.state.menuLayout = "vertical";
}

// check skin  for localstorage
if (localStorage.skin === "bordered") {
  store.state.skin = "bordered";
  document.body.classList.add("skin--bordered");
} else {
  store.state.skin = "default";
  document.body.classList.add("skin--default");
}

// const h = new h();
// vue use
const app = createApp({
  mounted () {
    if(this.$store.state.auth.status.loggedIn){
      Promise.all([
        this.$store.dispatch('getAllEmployees'),
        this.$store.dispatch('getAllSites'),
        this.$store.dispatch('getAllSkills'),
        this.$store.dispatch('getAllTasks'),
        this.$store.dispatch('getAllTaskActivities'),
        this.$store.dispatch('getAllusers'),
        this.$store.dispatch('getAllMessages'),
      ]).finally(() => {
        this.$root.$emit("Initialised")
      })
    }
  },
  render: () => h(App)
});
  app.use(store)
  app.use(VueSweetalert2)
  app.use(Toast, {
    toastClassName: "dashcode-toast",
    bodyClassName: "dashcode-toast-body",
  })
  app.use(router)
  app.use(VueClickAway)
  app.use(VueTippy)
  app.use(VueFlatPickr)
  app.use(VueGoodTablePlugin)
  app.use(VueApexCharts)
  app.use(VCalendar)
  app.use(VueSocketIOExt, socket);
  app.config.globalProperties.$emitter = emitter
  app.mount("#app");
