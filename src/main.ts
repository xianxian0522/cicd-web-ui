import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Select,
  Table
} from "ant-design-vue";

const app = createApp(App)

app.use(router)

app.use(ConfigProvider)
app.use(Layout)
app.use(Menu)
app.use(Avatar)
app.use(Dropdown)
app.use(Button)
app.use(Select)
app.use(Table)
app.use(Input)
app.use(Form)
app.use(Modal)

app.mount("#app");
