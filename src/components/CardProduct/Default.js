import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "react-bootstrap"
import Stars from "../Stars"
import Icon from "../Icon"
import Image from "../Image"
import moment from "moment"
import { getImagesByProductId } from "../../api/ProductAPI"

const CardProductDefault = ({
  product,
  masonry,
  addToCart,
  addToWishlist,
  setQuickView,
}) => {
  const [thumbnailImages, setThumbnailImages] = useState([])

  // Tính toán xem sản phẩm có mới không
  const isFresh = product.createdAt
    ? moment().diff(moment(product.createdAt), "days") < 7
    : false

  // Kiểm tra xem sản phẩm có đang giảm giá không
  const isSale = product.salePrice !== 0

  // Kiểm tra xem sản phẩm đã hết hàng chưa
  const isSoldOut = product.quantity <= 0

  // Lấy hình ảnh thumbnail (tối đa 2 hình)
  useEffect(() => {
    const fetchImages = async () => {
      if (product && product.id) {
        try {
          const images = await getImagesByProductId(product.id)
          // Lọc hình ảnh thumbnail (tối đa 2 hình)
          const filteredImages = images
            .filter((img) => img.thumbnail)
            .slice(0, 2)
          setThumbnailImages(filteredImages)
        } catch (error) {
          console.error("Error fetching images:", error)
        }
      }
    }

    fetchImages()
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
            New
          </Badge>
        )}
        {isSale && (
          <Badge bg="primary" className="product-badge">
            Sale
          </Badge>
        )}
        {isSoldOut && (
          <Badge bg="dark" className="product-badge">
            Sold Out
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
            onClick={(e) => {
              e.preventDefault()
              setQuickView((prev) => !prev)
            }}
          >
            <Icon
              className="text-hover-primary svg-icon-heavy d-sm-none"
              icon="retail-bag-1"
            />
            <span className="d-none d-sm-inline">Thêm vào giỏ hàng</span>
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
          {isSale
            ? `${(product.salePrice ?? 0)
                .toLocaleString("it-IT")
                .replace(/,/g, ".")}đ`
            : `${(product.price ?? 0)
                .toLocaleString("it-IT")
                .replace(/,/g, ".")}đ`}
        </span>
        <Stars
          stars={5}
          className="product-stars text-xs"
        />
      </div>
    </div>
  )
}

export default CardProductDefault
