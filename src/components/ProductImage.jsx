import { useState } from 'react'
import { resolveAssetUrl } from '../app/api.js'
import ShoePlaceholder from './ShoePlaceholder.jsx'

function ProductImage({ src, alt, className }) {
	const [failedSource, setFailedSource] = useState('')

	if (!src || failedSource === src) {
		return <span className={className} aria-hidden="true"><ShoePlaceholder /></span>
	}

	return (
		<img
			className={className}
			src={resolveAssetUrl(src)}
			alt={alt}
			onError={() => setFailedSource(src)}
		/>
	)
}

export default ProductImage
