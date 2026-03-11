// src/composables/useAuth.js
import { ref, computed } from 'vue'

// Estado GLOBAL compartido (fuera del composable)
const _user = ref(null)
const _token = ref(localStorage.getItem('auth_token') || null)

export function useAuth() {
  const isAuthenticated = computed(() => !!_token.value)

  const user = computed(() => _user.value)

  function login(userData, token) {
    _user.value = userData
    _token.value = token
    localStorage.setItem('auth_token', token)
  }

  function logout() {
    _user.value = null
    _token.value = null
    localStorage.removeItem('auth_token')
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
}
