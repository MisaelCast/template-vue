/* // src/composables/useAuth.js
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";

const _user = ref(null);
const _session = ref(null);

// Inicializa la sesión al cargar la app
async function init() {
  const { data } = await supabase.auth.getSession();
  _session.value = data.session;
  _user.value = data.session?.user ?? null;

  // Escucha cambios de sesión en tiempo real
  supabase.auth.onAuthStateChange((event, session) => {
    _session.value = session;
    _user.value = session?.user ?? null;
  });
}

export function useAuth() {
  const isAuthenticated = computed(() => !!_session.value);

  const user = computed(() => _user.value);

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
    return data;
  }

  async function logout() {
    // Limpiamos el estado local primero para que el guard no redirija de vuelta
    _session.value = null;
    _user.value = null;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    init,
  };
} */
// src/composables/useAuth.js
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";

const _user = ref(null);
const _session = ref(null);

async function init() {
  const { data } = await supabase.auth.getSession();
  _session.value = data.session;
  _user.value = data.session?.user ?? null;

  supabase.auth.onAuthStateChange((event, session) => {
    _session.value = session;
    _user.value = session?.user ?? null;
  });
}

export function useAuth() {
  const isAuthenticated = computed(() => !!_session.value);
  const user = computed(() => _user.value);

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  }

  async function logout() {
    _session.value = null;
    _user.value = null;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Nueva función para iniciar sesión con Google
  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    if (error) throw error;
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    init,
    loginWithGoogle,
  };
}

export { init };
