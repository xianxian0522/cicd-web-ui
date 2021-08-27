import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {
  Avatar, Breadcrumb,
  Button, Col, Collapse,
  ConfigProvider, Descriptions,
  Dropdown,
  Form,
  Input,
  Layout,
  Menu,
  Modal, Popconfirm, Row,
  Select, Spin, Switch,
  Table, Tooltip
} from "ant-design-vue";
import HeaderComponent from 'menu-header-component/dist/menu-header-component.common.js'
import 'menu-header-component/dist/menu-header-component.css'
import TaskFlow from 'task-flow-ui/dist/task-flow-ui.umd.js'
import 'task-flow-ui/dist/task-flow-ui.css'

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
app.use(Breadcrumb)
app.use(Descriptions)
app.use(Col)
app.use(Row)
app.use(Collapse)
app.use(Switch)
app.use(Spin)
app.use(Popconfirm)
app.use(Tooltip)

app.use(HeaderComponent)
app.use(TaskFlow)

app.mount("#app");
