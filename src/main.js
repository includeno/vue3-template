import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import Antd from 'ant-design-vue';
import './theme/index.less'

const app = createApp(App)
app.use(router)
app.use(Antd)
app.mount('#app')
