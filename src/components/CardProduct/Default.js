import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "react-bootstrap"
import Stars from "../Stars"
import Icon from "../Icon"
import Image from "../Image"
import moment from "moment"

const CardProductDefault = ({
  product,
  masonry,
  addToCart,
  addToWishlist,
  setQuickView,
}) => {
  const [thumbnailImages, setThumbnailImages] = useState([])

  // Calculate if the product is fresh
  const isFresh = product.createdAt
    ? moment().diff(moment(product.createdAt), "days") < 7
    : false

  // Check if the product is on sale
  const isSale = product.salePrice !== 0

  // Check if the product is sold out
  const isSoldOut = product.quantity <= 0

  // Get thumbnail images (maximum 2)
  useEffect(() => {
    const imagesLink = product._links.images.href

    // Fetch images from API
    fetch(imagesLink)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((imageData) => {
        // Handle the image data received
        const images = imageData._embedded.image

        // Filter for thumbnail images (maximum 2)
        const filteredImages = images.filter((img) => img.thumbnail).slice(0, 2)
        setThumbnailImages(filteredImages)
      })
      .catch((error) => console.error("Error fetching images:", error))
  }, [product])

  return (
    <div
      className={`product product-type-0`}
      data-aos="zoom-in"
      data-aos-delay="0"
    >
      <div className="product-image mb-md-3">
        {isFresh && (
          <Badge bg="secondary" className="product-badge">
            Fresh
          </Badge>
        )}
        {isSale && (
          <Badge bg="primary" className="product-badge">
            Sale
          </Badge>
        )}
        {isSoldOut && (
          <Badge bg="dark" className="product-badge">
            Sold out
          </Badge>
        )}
        <Link href={`/product/${product.id}`}>
          <a>
            {masonry ? (
              thumbnailImages.length > 0 && (
                <span className="masonry-image">
                  <Image
                    src={thumbnailImages[0].url}
                    alt={thumbnailImages[0].altText || "Product Image"}
                    layout="fill"
                    sizes="(max-width: 992px) 50vw, (max-width: 1049px) 33vw, 300px"
                  />
                </span>
              )
            ) : thumbnailImages.length > 1 ? (
              <div className="product-swap-image">
                <Image
                  className="img-fluid product-swap-image-front"
                  src={thumbnailImages[0].url}
                  alt={thumbnailImages[0].altText || "Product Image"}
                  layout="responsive"
                  width={408}
                  height={523}
                />
                <span className="position-absolute overflow-hidden top-0 start-0 end-0 bottom-0">
                  <Image
                    className="img-fluid"
                    src={thumbnailImages[1].url}
                    alt={thumbnailImages[1].altText || "Product Image"}
                    layout="responsive"
                    width={408}
                    height={523}
                  />
                </span>
              </div>
            ) : (
              thumbnailImages.length > 0 && (
                <Image
                  className="img-fluid"
                  src={thumbnailImages[0].url}
                  alt={thumbnailImages[0].altText || "Product Image"}
                  layout="responsive"
                  width={408}
                  height={523}
                />
              )
            )}
          </a>
        </Link>
        <div className="product-hover-overlay">
          <a
            className="text-dark text-sm"
            aria-label="add to cart"
            href="#"
            onClick={(e) => addToCart(e, product)}
          >
            <Icon
              className="text-hover-primary svg-icon-heavy d-sm-none"
              icon="retail-bag-1"
            />
            <span className="d-none d-sm-inline">Add to cart</span>
          </a>
          <div>
            <a
              className="text-dark text-hover-primary me-2"
              href="#"
              onClick={(e) => addToWishlist(e, product)}
              aria-label="add to wishlist"
            >
              <Icon className="svg-icon-heavy" icon="heart-1" />
            </a>
            <a
              className="text-dark text-hover-primary text-decoration-none"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setQuickView((prev) => !prev)
              }}
              aria-label="open quickview"
            >
              <Icon className="svg-icon-heavy" icon="expand-1" />
            </a>
          </div>
        </div>
      </div>
      <div className="position-relative">
        <h3 className="text-base mb-1">
          <Link href={`/product/${product.id}`}>
            <a className="text-dark">{product.name}</a>
          </Link>
        </h3>
        <span className="text-gray-500 text-sm">
          {isSale ? `${product.salePrice} VNĐ` : `${product.price} VNĐ`}
        </span>
        <Stars
          stars={product.averageRating}
          className="product-stars text-xs"
        />
      </div>
    </div>
  )
}

export default CardProductDefault
