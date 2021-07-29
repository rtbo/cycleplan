import { createApp } from "vue";
import "@mdi/font/css/materialdesignicons.css";
import Vue3Konva from "vue3-konva";
import App from "./App.vue";
import { key, store } from "./store";
import "./index.css";

const app = createApp(App);
app.use(Vue3Konva, { prefix: "kv" });
app.use(store, key);

app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});

app.mount("#app");
