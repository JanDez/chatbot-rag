import { useState } from 'react'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

export function Image({ src, alt, ...props }: ImageProps) {
  const [error, setError] = useState(false)

  return (
    <img
      src={error ? '/fallback-image.png' : src}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  )
}
