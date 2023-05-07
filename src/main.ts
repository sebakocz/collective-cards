import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLazyLoad from 'vue3-lazyload'
import './style.css'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(VueLazyLoad, {
    loading:
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" %3E%3Crect width="200" height="160" fill="%23525048" /%3E%3C/svg%3E',
})
app.use(pinia)
app.mount('#app')
