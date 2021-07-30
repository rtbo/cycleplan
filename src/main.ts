import { createApp } from "vue";
import "@mdi/font/css/materialdesignicons.css";
import konvaPlugin from "./konva";
import App from "./App.vue";
import { key, store } from "./store";
import "./index.css";

const app = createApp(App);
app.use(konvaPlugin);
app.use(store, key);

app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});

app.mount("#app");
