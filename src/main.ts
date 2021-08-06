import { createApp } from "vue";
import "@mdi/font/css/materialdesignicons.css";
import App from "./App.vue";
import "./index.css";
import AppButton from "./components/AppButton.vue";
import AppClickToEdit from "./components/AppClickToEdit.vue";
import AppDivider from "./components/AppDivider.vue";
import AppIconButton from "./components/AppIconButton.vue";
import AppInput from "./components/AppInput.vue";
import AppSlideInPanel from "./components/AppSlideInPanel.vue";
import AppToggleButton from "./components/AppToggleButton.vue";
import { key, store } from "./store";

const app = createApp(App);
app.use(store, key);
app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});

const appComps = {
  AppButton,
  AppClickToEdit,
  AppDivider,
  AppIconButton,
  AppInput,
  AppSlideInPanel,
  AppToggleButton,
};
Object.entries(appComps).forEach(([name, comp]) => {
  app.component(name, comp);
});

app.mount("#app");
