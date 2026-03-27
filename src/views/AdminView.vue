<!-- src/views/AdminView.vue -->
<template>
  <div class="admin">
    <!-- HEADER -->
    <section class="welcome-section">
      <div class="welcome-text">
        <p class="welcome-label">Panel de administración</p>
        <h1 class="welcome-title">
          Bienvenido, <span class="highlight">{{ displayName }}</span>
        </h1>
        <p class="welcome-sub">{{ currentDate }} — Acceso total al sistema.</p>
      </div>
      <div class="admin-badge">
        <span class="badge-icon">🛡️</span>
        <span class="badge-text">Administrador</span>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats-grid">
      <div
        v-for="(stat, i) in stats"
        :key="stat.label"
        class="stat-card"
        :style="{ animationDelay: `${i * 0.08}s` }"
      >
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- BODY -->
    <div class="admin-body">
      <!-- USUARIOS RECIENTES -->
      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Usuarios recientes</h2>
          <span class="panel-badge">{{ users.length }} registros</span>
        </div>
        <ul class="user-list">
          <li v-for="(u, i) in users" :key="i" class="user-item">
            <div class="user-avatar">{{ u.name[0] }}</div>
            <div class="user-info">
              <span class="user-name">{{ u.name }}</span>
              <span class="user-email">{{ u.email }}</span>
            </div>
            <span class="user-role" :class="`role--${u.role}`">{{
              u.role
            }}</span>
          </li>
        </ul>
      </section>

      <!-- INFO DEL SISTEMA -->
      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Sistema</h2>
        </div>
        <div class="session-info">
          <div class="session-row">
            <span class="session-key">Tu rol</span>
            <span class="session-val status-admin">● Admin</span>
          </div>
          <div class="session-row">
            <span class="session-key">Email</span>
            <span class="session-val">{{ user?.email }}</span>
          </div>
          <div class="session-row">
            <span class="session-key">ID</span>
            <span class="session-val token-val"
              >{{ user?.id?.slice(0, 8) }}...</span
            >
          </div>
          <div class="session-row">
            <span class="session-key">Estado</span>
            <span class="session-val status-active">● Activo</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuth } from "@/composables/useAuth";

const { user } = useAuth();

const currentDate = computed(() =>
  new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);

const displayName = computed(
  () => user.value?.user_metadata?.full_name ?? user.value?.email ?? "Admin",
);

const stats = [
  { icon: "👥", label: "Usuarios totales", value: "24" },
  { icon: "🛡️", label: "Admins", value: "2" },
  { icon: "🔐", label: "Sesiones activas", value: "8" },
  { icon: "⚠️", label: "Alertas", value: "1" },
];

const users = [
  { name: "Misael Castillo", email: "xmisael33456@gmail.com", role: "admin" },
  { name: "Ana García", email: "ana@ejemplo.com", role: "user" },
  { name: "Luis Pérez", email: "luis@ejemplo.com", role: "user" },
  { name: "Xenia López", email: "xenia@ejemplo.com", role: "user" },
];
</script>

<style scoped>
.admin {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  animation: fadeIn 0.4s ease both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.75rem 2rem;
  background: rgba(22, 22, 26, 0.8);
  border: 1px solid rgba(176, 140, 232, 0.15);
  border-radius: 16px;
}

.welcome-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #b08ce8;
  margin: 0 0 0.35rem;
}

.welcome-title {
  font-size: 1.85rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #e8e4dc;
  margin: 0 0 0.35rem;
}

.highlight {
  background: linear-gradient(135deg, #b08ce8, #d4b8f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-sub {
  color: #5a5550;
  font-size: 0.875rem;
  margin: 0;
  text-transform: capitalize;
}

.admin-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(176, 140, 232, 0.08);
  border: 1px solid rgba(176, 140, 232, 0.25);
  border-radius: 999px;
  font-size: 0.82rem;
  color: #b08ce8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(22, 22, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  animation: slideUp 0.4s ease both;
  transition:
    border-color 0.2s,
    transform 0.2s;
}

.stat-card:hover {
  border-color: rgba(176, 140, 232, 0.2);
  transform: translateY(-2px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #e8e4dc;
  letter-spacing: -0.02em;
  line-height: 1;
}

.stat-label {
  font-size: 0.78rem;
  color: #5a5550;
  margin-top: 0.2rem;
}

.admin-body {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1rem;
}

@media (max-width: 768px) {
  .admin-body {
    grid-template-columns: 1fr;
  }
}

.panel {
  background: rgba(22, 22, 26, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 1.5rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.panel-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e8e4dc;
  margin: 0;
}

.panel-badge {
  font-size: 0.75rem;
  color: #b08ce8;
  background: rgba(176, 140, 232, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(200, 169, 110, 0.1);
  border: 1px solid rgba(200, 169, 110, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #c8a96e;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.15rem;
}

.user-name {
  font-size: 0.875rem;
  color: #c8c2ba;
  font-weight: 500;
}
.user-email {
  font-size: 0.75rem;
  color: #4a4540;
}

.user-role {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.role--admin {
  color: #b08ce8;
  background: rgba(176, 140, 232, 0.1);
  border: 1px solid rgba(176, 140, 232, 0.2);
}

.role--user {
  color: #6fcf97;
  background: rgba(111, 207, 151, 0.1);
  border: 1px solid rgba(111, 207, 151, 0.2);
}

.session-info {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.session-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.875rem;
}

.session-key {
  color: #5a5550;
}
.session-val {
  color: #c8c2ba;
  font-weight: 500;
}
.token-val {
  font-family: monospace;
  font-size: 0.8rem;
  color: #c8a96e;
}
.status-active {
  color: #6fcf97 !important;
  font-size: 0.82rem;
}
.status-admin {
  color: #b08ce8 !important;
  font-size: 0.82rem;
}
</style>
