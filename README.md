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
