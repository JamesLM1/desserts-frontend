interface ProductImageProps {
    src: string
    alt: string
    className?: string
    thumbnail?: boolean
}

export default function ProductImage({ src, alt, className = '', thumbnail = false }: ProductImageProps) {
    const image = <img src={thumbnail ? src.replace('-desktop.jpg', '-thumbnail.jpg') : src.replace('-desktop.jpg', '-mobile.jpg')}
        alt={alt} className={className} loading={thumbnail ? 'eager' : 'lazy'}
        onError={(event) => {
            const target = event.currentTarget
            if (!target.src.endsWith('/image-placeholder.svg')) target.src = '/assets/images/image-placeholder.svg'
        }} />
    if (thumbnail) return image
    return <picture className="block">
        <source media="(min-width: 1024px)" srcSet={src} />
        <source media="(min-width: 640px)" srcSet={src.replace('-desktop.jpg', '-tablet.jpg')} />
        {image}
    </picture>
}
