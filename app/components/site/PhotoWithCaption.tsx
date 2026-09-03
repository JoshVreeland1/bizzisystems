import Image from 'next/image'

/**
 * Real photography, sized and cropped on purpose, with the caption doing the
 * work a floating badge would otherwise do badly.
 */
export default function PhotoWithCaption({
  src,
  alt,
  caption,
  aspect = 'aspect-[3/2]',
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  objectPosition,
  className = '',
  frame = true,
}: {
  src: string
  alt: string
  caption?: string
  aspect?: string
  priority?: boolean
  sizes?: string
  objectPosition?: string
  className?: string
  frame?: boolean
}) {
  return (
    <figure className={`m-0 ${className}`}>
      <div
        className={`relative w-full overflow-hidden ${aspect} ${
          frame ? 'rounded-md border border-line bg-surface' : ''
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 border-l-2 border-line-strong pl-3 text-[13px] leading-relaxed text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
