import { createApp } from 'vue';
import router from './router'
import Home from './views/Home.vue';

createApp(Home)
.use(router)
.mount('#app');