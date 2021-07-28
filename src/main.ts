import { createApp } from "vue";
import App from "./App.vue";
import { key, store } from "./store";
import "./index.css";

const app = createApp(App);
app.use(store, key);

app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});

app.mount("#app");
