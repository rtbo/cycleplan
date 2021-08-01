import { createApp } from "vue";
import "@mdi/font/css/materialdesignicons.css";
import konvaPlugin from "./konva";
import App from "./App.vue";
import { key, store } from "./store";
import "./index.css";
import AppClickToEdit from "./components/AppClickToEdit.vue";
import AppDivider from "./components/AppDivider.vue";
import AppIconButton from "./components/AppIconButton.vue";

const app = createApp(App);
app.use(konvaPlugin);
app.use(store, key);
app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});

const appComps = {
  AppClickToEdit,
  AppDivider,
  AppIconButton,
};
Object.entries(appComps).forEach(([name, comp]) => {
  app.component(name, comp);
});

app.mount("#app");
