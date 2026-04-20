<template>
  <div class="login-page">
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-glow" aria-hidden="true"></div>

    <div class="login-card">
      <div class="card-header">
        <span class="card-icon">🔐</span>
        <h1 class="card-title">Nueva contraseña</h1>
        <p class="card-subtitle">Escribe tu nueva contraseña segura</p>
      </div>

      <Transition name="alert">
        <div v-if="errorMsg" class="alert-error" role="alert">
          <span>⚠</span> {{ errorMsg }}
        </div>
      </Transition>

      <form
        class="login-form"
        @submit.prevent="handleUpdatePassword"
        novalidate
      >
        <div class="field" :class="{ 'field--error': errors.password }">
          <label for="password" class="field-label">Nueva Contraseña</label>
          <div class="field-input-wrap">
            <span class="field-icon">🔑</span>
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              placeholder="Mínimo 6 caracteres"
              @blur="validatePassword"
              @input="
                validatePassword();
                validateConfirm();
              "
              :disabled="!isTokenValid"
            />
            <button
              type="button"
              class="field-toggle"
              @click="showPassword = !showPassword"
              :disabled="!isTokenValid"
            >
              {{ showPassword ? "🙈" : "👁" }}
            </button>
          </div>

          <div v-if="form.password" class="strength-bar">
            <div
              v-for="n in 4"
              :key="n"
              class="strength-segment"
              :class="{ active: n <= passwordStrength.score }"
              :style="
                n <= passwordStrength.score
                  ? { background: passwordStrength.color }
                  : {}
              "
            ></div>
            <span
              class="strength-label"
              :style="{ color: passwordStrength.color }"
            >
              {{ passwordStrength.label }}
            </span>
          </div>
          <span v-if="errors.password" class="field-error">{{
            errors.password
          }}</span>
        </div>

        <div class="field" :class="{ 'field--error': errors.confirm }">
          <label for="confirm" class="field-label">Confirmar contraseña</label>
          <div class="field-input-wrap">
            <span class="field-icon">🔒</span>
            <input
              id="confirm"
              v-model="form.confirm"
              :type="showConfirm ? 'text' : 'password'"
              class="field-input"
              placeholder="Repite tu contraseña"
              @blur="validateConfirm"
              @input="validateConfirm"
              :disabled="!isTokenValid"
            />
            <button
              type="button"
              class="field-toggle"
              @click="showConfirm = !showConfirm"
              :disabled="!isTokenValid"
            >
              {{ showConfirm ? "🙈" : "👁" }}
            </button>
          </div>
          <span v-if="errors.confirm" class="field-error">{{
            errors.confirm
          }}</span>
        </div>

        <button
          type="submit"
          class="btn-submit"
          :disabled="isLoading || !isTokenValid"
        >
          <span v-if="!isLoading">Guardar e iniciar sesión →</span>
          <span v-else class="spinner"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
// Importamos logout para poder cerrar la sesión tras guardar
const { updatePassword, logout } = useAuth();

const form = reactive({ password: "", confirm: "" });
const errors = reactive({ password: "", confirm: "" });

const showPassword = ref(false);
const showConfirm = ref(false);
const isLoading = ref(false);
const errorMsg = ref("");
const isTokenValid = ref(true); // Controla si el link sirve

// Revisar si la URL trae un error de Supabase (como link expirado)
onMounted(() => {
  const hash = window.location.hash;
  if (hash && hash.includes("error=")) {
    isTokenValid.value = false;
    // Extraemos el mensaje de error de la URL
    const params = new URLSearchParams(hash.substring(1));
    const desc = params.get("error_description");

    if (desc && desc.includes("expired")) {
      errorMsg.value =
        "El enlace ha expirado o ya fue usado. Por favor, solicita uno nuevo.";
    } else {
      errorMsg.value = "Enlace inválido. Vuelve a solicitar la recuperación.";
    }
  }
});

// Lógica de fuerza de contraseña (Reutilizada del registro)
const passwordStrength = computed(() => {
  const p = form.password;
  let score = 0;
  if (p.length >= 6) score++;
  if (p.length >= 10) score++;
  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;

  const levels = [
    { score: 0, label: "", color: "#3a3530" },
    { score: 1, label: "Débil", color: "#e07070" },
    { score: 2, label: "Regular", color: "#e8c46e" },
    { score: 3, label: "Buena", color: "#6eb4e8" },
    { score: 4, label: "Fuerte", color: "#6fcf97" },
  ];
  return levels[score];
});

// Validaciones
function validatePassword() {
  errors.password = !form.password
    ? "La contraseña es obligatoria."
    : form.password.length < 6
      ? "Mínimo 6 caracteres."
      : "";
}

function validateConfirm() {
  errors.confirm = !form.confirm
    ? "Confirma tu contraseña."
    : form.confirm !== form.password
      ? "Las contraseñas no coinciden."
      : "";
}

function isFormValid() {
  validatePassword();
  validateConfirm();
  return !errors.password && !errors.confirm;
}

async function handleUpdatePassword() {
  if (!isFormValid()) return;

  isLoading.value = true;
  errorMsg.value = "";

  try {
    console.log("1. Intentando guardar la contraseña en Supabase...");
    await updatePassword(form.password);

    console.log(
      "2. Contraseña actualizada. Intentando cerrar sesión temporal...",
    );
    try {
      await logout();
    } catch (logoutErr) {
      // Si falla el logout (a veces pasa porque Supabase te cierra la sesión
      // automáticamente al cambiar la contraseña), lo ignoramos y seguimos.
      console.warn("Aviso al cerrar sesión:", logoutErr.message);
    }

    console.log("3. Redirigiendo al login de forma forzada...");
    // Usamos window.location.href en vez de router.push para forzar
    // a que se limpie el hash (#access_token...) de la barra de direcciones.
    window.location.href = "/login";
  } catch (error) {
    console.error("Error crítico capturado:", error);

    // Interceptamos el falso error de Supabase
    if (error?.message?.includes("Lock broken")) {
      console.warn("Supabase lock error ignorado. Redirigiendo al login...");
      window.location.href = "/login";
    } else {
      errorMsg.value =
        error?.message || "Ocurrió un error inesperado al guardar.";
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Estilos generales (los mismos que Login/Registro) */
.login-page {
  min-height: calc(100vh - 65px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 1rem;
}
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(200, 169, 110, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(200, 169, 110, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}
.bg-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(200, 169, 110, 0.08) 0%,
    transparent 70%
  );
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.login-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: rgba(22, 22, 26, 0.95);
  border: 1px solid rgba(200, 169, 110, 0.15);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03),
    0 24px 48px rgba(0, 0, 0, 0.5);
  animation: cardIn 0.4s ease both;
}
@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.card-header {
  text-align: center;
  margin-bottom: 1.75rem;
}
.card-icon {
  display: block;
  font-size: 2rem;
  color: #c8a96e;
  margin-bottom: 0.75rem;
}
.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #e8e4dc, #c8a96e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.4rem;
}
.card-subtitle {
  color: #6b6560;
  font-size: 0.88rem;
  margin: 0;
}
.alert-error {
  background: rgba(224, 112, 112, 0.1);
  border: 1px solid rgba(224, 112, 112, 0.3);
  color: #e07070;
  border-radius: 8px;
  padding: 0.65rem 1rem;
  font-size: 0.88rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #9a938c;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.field-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.field-icon {
  position: absolute;
  left: 0.85rem;
  font-size: 0.9rem;
  pointer-events: none;
  opacity: 0.5;
}
.field-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.65rem 2.75rem 0.65rem 2.5rem;
  color: #e8e4dc;
  font-size: 0.95rem;
  font-family: inherit;
  transition:
    border-color 0.2s,
    background 0.2s;
  outline: none;
  box-sizing: border-box;
}
.field-input:focus {
  border-color: rgba(200, 169, 110, 0.5);
  background: rgba(200, 169, 110, 0.04);
}
.field-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.field--error .field-input {
  border-color: rgba(224, 112, 112, 0.5);
}
.field-error {
  font-size: 0.8rem;
  color: #e07070;
}
.field-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 0;
}
.field-toggle:hover:not(:disabled) {
  opacity: 1;
}
.field-toggle:disabled {
  cursor: not-allowed;
}
.btn-submit {
  margin-top: 0.5rem;
  padding: 0.8rem;
  background: linear-gradient(135deg, #c8a96e, #a0834e);
  color: #0d0d0f;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.15s;
}
.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(13, 13, 15, 0.3);
  border-top-color: #0d0d0f;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Estilos de la barra de fuerza */
.strength-bar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.4rem;
}
.strength-segment {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  transition: background 0.3s;
}
.strength-label {
  font-size: 0.75rem;
  color: #4a4540;
  white-space: nowrap;
}
</style>
