// maneja el estado de los productos favoritos usando Redux Toolkit, similar a como lo harías con useContext pero con la ventaja de tener un store global y acciones predefinidas para modificar el estado de forma más estructurada y escalable.
// reemplaza al FavoriteContext o FavoriteProvider que usarías con useContext para manejar los favoritos

import { createSlice } from '@reduxjs/toolkit';

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState: {
        items: [] // Array para almacenar los productos favoritos
    },
    reducers: {
        // opcional: toggleFavorite agrega o elimina un producto de favoritos dependiendo de si ya está o no en el array items. Es una función más cómoda para usar en la UI, por ejemplo, para un botón de "Agregar/Eliminar de favoritos" que cambia su estado al hacer clic.
        toggleFavorite: (state, action) => {
            const product = action.payload;
            const index = state.items.findIndex(item => item.id === product.id);

            if (index >= 0) {
                // Si ya existe, lo eliminamos
                state.items.splice(index, 1);
            } else {
                // Si no existe, lo agregamos
                state.items.push(product);
            }
        },
        // action.payload = { id: 1, nombre: 'Producto A', precio: 100 } // El producto que enviaste
        addFavorite: (state, action) => {
            state.items.push(action.payload);
        },

        // action.payload = id del producto que quieres eliminar
        removeFavorite: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },

        // Vacía el array items, eliminando todos los productos favoritos
        clearFavorites: (state) => {
            state.items = [];
        }
    }
});

export const { addFavorite, removeFavorite, clearFavorites, toggleFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
