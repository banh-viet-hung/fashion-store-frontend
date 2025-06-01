import React from "react"
import Image from "next/image"

const CustomImage = (props) => {
  // Use regular img tag for external server URLs or in static production
  if (process.env.production_type === "static" ||
    (props.src && typeof props.src === 'string' && props.src.startsWith('http://localhost:8080'))) {
    return (
      <img
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        className={props.className}
      />
    )
  } else {
    return <Image {...props} />
  }
}
export default CustomImage
