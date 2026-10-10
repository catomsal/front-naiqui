import { useContext } from 'react'
import { CartContext } from './cartContext.js'

export function useCart() {
	return useContext(CartContext)
}
