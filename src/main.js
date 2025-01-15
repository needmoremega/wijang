import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import AlertPopup from './components/AlertPopup.vue'

const app = createApp(App)
app.component('KonfirmasiPopup', AlertPopup)

app.use(router)
app.mount('#app')
