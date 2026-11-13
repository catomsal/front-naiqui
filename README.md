# Naiqui

Frontend de la tienda de zapatillas Naiqui, construido con React, Vite y Redux Toolkit.
Consume la API del backend Spring Boot que vive en el repositorio hermano.

## Desarrollo local

```bash
npm ci
npm run dev
```

El frontend usa `http://localhost:8080/api` por defecto. Para apuntarlo a otra
instancia, definí `VITE_API_URL` con la URL base de la API.

El catálogo incluye filtros por género y categoría, una sección de ofertas con
precio anterior y descuento, y productos para niños. El precio vigente es el
que se usa en carrito y checkout.

En modo desarrollo, la pantalla de ingreso ofrece accesos de un click para los
roles Usuario, Vendedor y Administrador. Usan las cuentas de prueba precargadas
por el backend (clave `1234`); estos accesos no aparecen en el build de producción.

Para levantar frontend, backend y base de datos juntos, seguí las instrucciones
del README del repositorio del backend.

## Verificación

```bash
npm run build
npm run lint
```

## Estructura del proyecto

```text
src/
├── app/          # api.js (cliente fetch con CSRF y cookies) y format.js (formato de precios)
├── components/   # componentes reutilizables y rutas protegidas
├── context/      # useAuth: hook que envuelve el estado de autenticación de Redux
├── pages/        # una pantalla por ruta (Catálogo, Detalle, Carrito, Checkout, Pedidos, etc.)
├── store/        # store de Redux Toolkit
│   └── slices/   # authSlice, cartSlice y favoriteSlice
├── App.jsx       # definición de rutas
└── main.jsx      # punto de entrada: Provider de Redux y BrowserRouter
```

## Estado global y sesión

El estado compartido se maneja con **Redux Toolkit**. El store tiene tres slices:

- `auth`: usuario logueado, estado de carga y errores.
- `cart`: ítems del carrito, sincronizados con el backend.
- `favorite`: productos favoritos del usuario.

Las llamadas a la API se hacen con `createAsyncThunk` dentro de cada slice, de modo que los estados
`pending`, `fulfilled` y `rejected` se manejan en un solo lugar.

El JWT viaja en una **cookie HttpOnly** que gestiona el backend; el front no lo guarda ni lo lee.
Como el store vive en memoria, al recargar la página `App.jsx` despacha `restoreSession`, que consulta
`GET /api/me` para recuperar al usuario.

## Rutas protegidas

- `ProtectedRoute`: exige usuario logueado.
- `AdminRoute`, `StaffRoute` y `CustomerRoute`: exigen un rol determinado y se anidan dentro de `ProtectedRoute`.