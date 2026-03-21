# VueAuth — Autenticación con Vue 3 + Supabase

Proyecto de práctica para aprender autenticación completa con Vue 3, Vue Router y Supabase.

## Tecnologías

- Vue 3 (Composition API)
- Vue Router 4
- Supabase (auth con email/password y Google OAuth)
- Pinia
- Vite

## Funcionalidades

- Login con email y contraseña
- Login con Google
- Registro de usuarios
- Rutas protegidas con Navigation Guards
- Cierre de sesión
- Persistencia de sesión

## Instalación

```bash
npm install
```

Crea un archivo `.env` en la raíz con tus credenciales de Supabase:

```
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

```bash
npm run dev
```

## Créditos

- Diseño y template original por [Xenia](https://github.com/xenyens)
- Implementación de autenticación con Supabase por [Misael Castillo](https://github.com/MisaelCast)
