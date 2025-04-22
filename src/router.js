import { createWebHashHistory, createRouter } from 'vue-router'

import Home from './views/Home.vue'
import Empresas from './views/Empresas.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/empresas', component: Empresas },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router