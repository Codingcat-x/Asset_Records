import Vue from 'vue'
import {
  Button,
  Input,
  Select,
  Option,
  Message,
  MessageBox,
  Loading,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  RadioGroup,
  RadioButton,
  Menu,
  MenuItemGroup,
  MenuItem,
  Submenu
} from 'element-ui'

// 按需注册组件
const components = [
  Button, Input, Select, Option, Container,
  Header, Aside, Main, Footer,
  RadioButton, RadioGroup, Menu, MenuItemGroup, MenuItem,
  Submenu
]

components.forEach(comp => Vue.use(comp))
Vue.use(Loading.directive)

// 挂载到 Vue 原型上，便于在组件中通过 this.$message / this.$msgbox 调用
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$confirm = MessageBox.confirm
