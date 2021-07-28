declare module "*.vue" {
  import { DefineComponent } from "vue";
  /* eslint-disable @typescript-eslint/ban-types */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
