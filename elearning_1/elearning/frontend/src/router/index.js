import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import AdminApprovalsView from '../views/AdminApprovalsView.vue'
import CoursesListView from '../views/courses/CoursesListView.vue'
import CourseManageView from '../views/courses/CourseManageView.vue'
import CatalogueView from '../views/etudiant/CatalogueView.vue'
import ApprendreView from '../views/etudiant/ApprendreView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/dashboard', component: DashboardView, meta: { auth: true } },
    { path: '/admin/approbations', component: AdminApprovalsView, meta: { auth: true, admin: true } },
    // Gestion des cours : réservée aux formateurs APPROUVÉS (ou admin)
    { path: '/cours', component: CoursesListView, meta: { auth: true, formateurActif: true } },
    { path: '/cours/:id', component: CourseManageView, meta: { auth: true, formateurActif: true } },
    // Espace étudiant : catalogue et consultation des cours suivis
    { path: '/catalogue', component: CatalogueView, meta: { auth: true, etudiant: true } },
    { path: '/apprendre/:id', component: ApprendreView, meta: { auth: true, etudiant: true } },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.isLoggedIn) return '/login'
  if (to.meta.admin && !auth.isAdmin) return '/dashboard'
  // formateurActif = formateur approuvé ou admin
  if (to.meta.formateurActif && !(auth.isAdmin || (auth.isFormateur && auth.isApproved))) return '/dashboard'
  // espace étudiant réservé au rôle étudiant
  if (to.meta.etudiant && !auth.isEtudiant) return '/dashboard'
  if ((to.path === '/login' || to.path === '/register') && auth.isLoggedIn) return '/dashboard'
})

export default router
