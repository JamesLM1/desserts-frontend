import { useState } from 'react'
import { productImages } from '../data/productImages'

interface ProductImageProps {
    src: string
    alt: string
    className?: string
    thumbnail?: boolean
}

export default function ProductImage({ src, alt, className = '', thumbnail = false }: ProductImageProps) {
    const [failedSource, setFailedSource] = useState<string | null>(null)
    const failed = failedSource === src
    const hasVariants = productImages.some((image) => image.value === src)
    const image = <img src={failed ? '/assets/images/image-placeholder.svg'
        : !hasVariants ? src : thumbnail ? src.replace('-desktop.jpg', '-thumbnail.jpg') : src.replace('-desktop.jpg', '-mobile.jpg')}
        alt={alt} className={className} loading={thumbnail ? 'eager' : 'lazy'}
        onError={() => { if (!failed) setFailedSource(src) }} />
    if (thumbnail || failed || !hasVariants) return image
    return <picture className="block">
        <source media="(min-width: 1024px)" srcSet={src} />
        <source media="(min-width: 640px)" srcSet={src.replace('-desktop.jpg', '-tablet.jpg')} />
        {image}
    </picture>
}
