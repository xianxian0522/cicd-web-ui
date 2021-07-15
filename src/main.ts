import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {Avatar, ConfigProvider, Dropdown, Layout, Menu} from "ant-design-vue";

const app = createApp(App)

app.use(router)

app.use(ConfigProvider)
app.use(Layout)
app.use(Menu)
app.use(Avatar)
app.use(Dropdown)

app.mount("#app");
