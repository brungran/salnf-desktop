import { createWebHashHistory, createRouter } from 'vue-router'

import Home from './frontend/views/Home.vue'
import Empresas from './frontend/views/Empresas.vue'

const routes = [
    { path: '/home', component: Home },
    { path: '/empresas', component: Empresas },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router