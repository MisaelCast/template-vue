// src/composables/useAuth.js
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";

const _user = ref(null);
const _session = ref(null);
const _role = ref(null);

//función para obtener el rol del usuario desde la tabla "profiles"
async function fetchRole(userId) {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  _role.value = data?.role ?? "user";
}

//inicializar el estado de autenticación al cargar la aplicación
async function init() {
  const { data } = await supabase.auth.getSession();
  _session.value = data.session;
  _user.value = data.session?.user ?? null;

  if (_user.value) await fetchRole(_user.value.id);

  supabase.auth.onAuthStateChange(async (event, session) => {
    _session.value = session;
    _user.value = session?.user ?? null;

    if (_user.value) {
      fetchRole(_user.value.id);
    } else {
      _role.value = null;
    }
  });
}

//composable para manejar la autenticación y autorización de usuarios
export function useAuth() {
  const isAuthenticated = computed(() => !!_session.value);
  const user = computed(() => _user.value);
  const role = computed(() => _role.value);
  const isAdmin = computed(() => _role.value === "admin");

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
    _role.value = null;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  //función para iniciar sesión con Google usando OAuth
  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    if (error) throw error;
  }

  // Enviar el correo de recuperación
  async function sendPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Redirige a esta URL cuando el usuario haga clic en el correo
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) throw error;
  }

  // Actualizar la contraseña (se usa cuando el usuario ya regresó del correo)
  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  return {
    user,
    isAuthenticated,
    //se manda el rol para mostrar u ocultar ciertas partes de la UI según el rol del usuario
    role,
    isAdmin,
    login,
    register,
    logout,
    init,
    loginWithGoogle,
    sendPasswordReset,
    updatePassword,
  };
}

export { init };
