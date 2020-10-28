import Vue from 'vue'
import {
     Form,
     FormItem,
     Container,
     Header,
     Aside,
     Main,
     Button,
     Input,
     Message ,
     Menu,
     Submenu,
     MenuItem,
     Breadcrumb,
     BreadcrumbItem,
     Card,
     Row,
     Col,
     Table,
     TableColumn, 
     Switch, 
     Tooltip,
     Pagination,
     Dialog, 
     MessageBox,
     Tag,
     Tree, 
     Select,
     Option,
     Cascader,
     Alert,
     Tabs,
     TabPane

    } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Input)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm