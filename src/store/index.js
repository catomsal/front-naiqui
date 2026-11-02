// Importa la función configureStore para crear la tienda Redux
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import favoriteReducer from './slices/favoriteSlice';
import authReducer from './slices/authSlice';

// este es el store donde va a estar toda la info global que necesitan todos los componentes de la app
// Crea el store global, agrupa todos los reducers en un solo objeto
export const store = configureStore({
  reducer: {
    cart: cartReducer,        // Gestiona el estado del carrito
    favorite: favoriteReducer, // Gestiona el estado de favoritos
    auth: authReducer,        // Gestiona el estado de autenticación y token
  },
});
