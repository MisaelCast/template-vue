<!-- src/views/ConfirmView.vue -->
<template>
  <div class="confirm-page">
    <div class="bg-glow" aria-hidden="true"></div>

    <div class="confirm-card">
      <span class="confirm-icon">📬</span>
      <h1 class="confirm-title">Revisa tu correo</h1>
      <p class="confirm-desc">
        Te enviamos un enlace de confirmación a
        <strong>{{ email }}</strong>.
        Haz clic en ese enlace para activar tu cuenta.
      </p>
      <RouterLink to="/login" class="btn-back">
        Volver al login
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const email = route.query.email ?? 'tu correo'
</script>

<style scoped>
.confirm-page {
  min-height: calc(100vh - 65px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem 1rem;
}

.bg-glow {
  position: absolute;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(200, 169, 110, 0.06) 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.confirm-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: rgba(22, 22, 26, 0.95);
  border: 1px solid rgba(200, 169, 110, 0.15);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: cardIn 0.4s ease both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.confirm-icon { font-size: 3rem; }

.confirm-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e8e4dc;
  margin: 0;
}

.confirm-desc {
  color: #6b6560;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.confirm-desc strong { color: #c8a96e; }

.btn-back {
  margin-top: 0.5rem;
  padding: 0.65rem 1.5rem;
  background: linear-gradient(135deg, #c8a96e, #a0834e);
  color: #0d0d0f;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.15s;
}
.btn-back:hover { opacity: 0.9; transform: translateY(-1px); }
</style>