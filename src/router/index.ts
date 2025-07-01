import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: 'user',
          name: 'user',
          component: () => import('../views/users/UsuariosView.vue'),
          beforeEnter: (to, from, next) => {
            const authStore = useAuthStore()

            if (authStore.isAdmin) {
              next()
            } else {
              next({ name: 'unauthorized' })
            }
          },
        },
        {
          path: '',
          redirect: { name: 'home' },
        },
      ],
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const isLogin = to.name === 'login'
  const isPublic = isLogin

  if (!isPublic && !token) {
    // Se não estiver autenticado e tentar acessar rota protegida, redireciona para login
    next({ name: 'login' })
  } else if (isLogin && token) {
    // Se já estiver autenticado e tentar acessar login, redireciona para home
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
