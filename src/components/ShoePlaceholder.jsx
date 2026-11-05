function ShoePlaceholder({ className = '' }) {
	return (
		<svg
			className={className}
			viewBox="0 0 180 120"
			fill="none"
			role="img"
			aria-label="Imagen de zapatilla no disponible"
		>
			<path
				d="M25 75 58 70l23-21c4-4 10-2 12 3l8 17 42 13c6 2 10 8 10 14v8H25V75Z"
				stroke="currentColor"
				strokeWidth="5"
				strokeLinejoin="round"
			/>
			<path d="M25 92h128" stroke="currentColor" strokeWidth="4" />
		</svg>
	)
}

export default ShoePlaceholder
