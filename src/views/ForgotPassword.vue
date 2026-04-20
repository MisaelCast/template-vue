<template>
  <div class="login-page">
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-glow" aria-hidden="true"></div>

    <div class="login-card">
      <div class="card-header">
        <span class="card-icon">📬</span>
        <h1 class="card-title">Recuperar acceso</h1>
        <p class="card-subtitle">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <Transition name="alert">
        <div v-if="errorMsg" class="alert-error" role="alert">
          <span>⚠</span> {{ errorMsg }}
        </div>
      </Transition>

      <Transition name="alert">
        <div
          v-if="successMsg"
          class="alert-success"
          role="alert"
          style="
            background: rgba(111, 207, 151, 0.1);
            border: 1px solid rgba(111, 207, 151, 0.3);
            color: #6fcf97;
            border-radius: 8px;
            padding: 0.65rem 1rem;
            font-size: 0.88rem;
            margin-bottom: 1.25rem;
          "
        >
          <span>✓</span> {{ successMsg }}
        </div>
      </Transition>

      <form
        v-if="!successMsg"
        class="login-form"
        @submit.prevent="handleSendReset"
        novalidate
      >
        <div class="field">
          <label for="email" class="field-label">Correo electrónico</label>
          <div class="field-input-wrap">
            <span class="field-icon">✉</span>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              class="field-input"
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>
        </div>

        <button type="submit" class="btn-submit" :disabled="isLoading">
          <span v-if="!isLoading">Enviar enlace →</span>
          <span v-else class="spinner"></span>
        </button>

        <p class="switch-link">
          ¿Recordaste tu contraseña?
          <RouterLink to="/login">Inicia sesión</RouterLink>
        </p>
      </form>

      <div v-else style="text-align: center; margin-top: 1rem">
        <RouterLink
          to="/login"
          class="switch-link a"
          style="color: #c8a96e; text-decoration: none"
          >Volver al login</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";

const { sendPasswordReset } = useAuth();

const email = ref("");
const isLoading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

async function handleSendReset() {
  if (!email.value) {
    errorMsg.value = "Ingresa tu correo.";
    return;
  }

  isLoading.value = true;
  errorMsg.value = "";
  try {
    await sendPasswordReset(email.value);
    successMsg.value =
      "Revisa tu bandeja de entrada. Te hemos enviado las instrucciones.";
  } catch (error) {
    errorMsg.value = error.message;
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
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
.switch-link {
  text-align: center;
  font-size: 0.85rem;
  color: #5a5550;
}
</style>
