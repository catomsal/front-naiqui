import { useState } from 'react'
import { CartContext } from './cartContext.js'

export function CartProvider({ children }) {
	const [items, setItems] = useState([])

	function addItem(product) {
		setItems((prev) => {
			const existing = prev.find((item) => item.id === product.id)
			if (existing) {
				return prev.map((item) =>
					item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item,
				)
			}
			return [...prev, { ...product, cantidad: 1 }]
		})
	}

	function removeItem(id) {
		setItems((prev) => prev.filter((item) => item.id !== id))
	}

	function clear() {
		setItems([])
	}

	return (
		<CartContext.Provider value={{ items, addItem, removeItem, clear }}>
			{children}
		</CartContext.Provider>
	)
}
