import { createApp } from 'vue';
import router from './router'
import App from './frontend/App.vue';

createApp(App)
.use(router)
.mount('#app');