import React, { useEffect, useState } from "react"
import { Row, Col, Badge } from "react-bootstrap"
import { WishlistContext } from "../components/WishlistContext"
import { removeWishlistItem } from "../hooks/UseWishlist"
import Image from "./Image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { getProductById, getImagesByProductId } from "../api/ProductAPI"
import Link from "next/link" // Sử dụng Link của Next.js để chuyển trang

const WishlistItems = ({ customer }) => {
  const [wishlistItems, dispatch] = React.useContext(WishlistContext) // Wishlist context
  const [products, setProducts] = useState([]) // State để lưu danh sách sản phẩm
  const [loading, setLoading] = useState(true) // State để theo dõi trạng thái loading khi gọi API

  // Lấy thông tin chi tiết sản phẩm và hình ảnh
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true)
      try {
        const productData = await Promise.all(
          wishlistItems.map(async (item) => {
            const product = await getProductById(item) // Lấy thông tin sản phẩm
            const images = await getImagesByProductId(item) // Lấy hình ảnh sản phẩm
            // Lấy hình ảnh thumbnail nếu có
            const thumbnail =
              images.find((image) => image.thumbnail) || images[0]
            return {
              ...product,
              images: thumbnail ? thumbnail.url : images[0]?.url,
            }
          })
        )
        setProducts(productData) // Lưu dữ liệu sản phẩm vào state
      } catch (error) {
        console.error("Error fetching product data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [wishlistItems])

  // Xử lý xóa sản phẩm khỏi wishlist
  const removeFromWishlist = (e, product) => {
    e.preventDefault()
    dispatch({ type: "remove", payload: product.id })
    removeWishlistItem(product)
  }

  // Hàm định dạng giá tiền
  const formatCurrency = (value) => {
    return (
      value
        .toLocaleString("it-IT") // Định dạng tiền theo chuẩn Việt Nam
        .replace(/,/g, ".") + "đ"
    ) // Thay dấu phẩy thành dấu chấm và thêm "đ"
  }

  // Hiển thị loading nếu đang fetch dữ liệu
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="wishlist">
      <div className="wishlist-body">
        {products.map((item, index) => (
          <div key={item.id} className="wishlist-item mb-4">
            <Row className="d-flex align-items-center text-start text-md-center">
              <Col xs="12" md="5">
                {/* MOBILE REMOVE BUTTON */}
                <a
                  className="wishlist-remove close mt-3 d-md-none"
                  href="#"
                  onClick={(e) => removeFromWishlist(e, item)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </a>
                {/* END MOBILE REMOVE BUTTON */}

                <div className="d-flex align-items-center">
                  {/* PRODUCT IMAGE */}
                  <Link href={`/product/${item.id}`}>
                    <a>
                      <Image
                        className="wishlist-item-img"
                        src={item.images}
                        alt={item.name}
                        width={80}
                        height={103}
                      />
                    </a>
                  </Link>
                  {/* END PRODUCT IMAGE */}

                  <div className="wishlist-title text-start ms-3">
                    {/* PRODUCT TITLE */}
                    <Link href={`/product/${item.id}`}>
                      <a className="text-dark link-animated">
                        <strong>{item.name}</strong>
                      </a>
                    </Link>
                    <br />
                    {/* END PRODUCT TITLE */}

                    {/* MOVING PRICE AND PROMO BELOW TITLE */}
                    <div className="product-price mt-2">
                      {item.salePrice > 0 ? (
                        <>
                          <span className="text-danger">
                            {formatCurrency(item.salePrice)}
                          </span>
                          <span className="text-muted"> - Đang khuyến mãi</span>
                        </>
                      ) : (
                        <span>{formatCurrency(item.price)}</span>
                      )}
                    </div>
                    {/* END PRICE AND PROMO */}
                  </div>
                </div>
              </Col>

              <Col xs="12" md="7" className="mt-4 mt-md-0">
                <Row className="align-items-center">
                  <Col md="2">
                    <Row>
                      {/* PRODUCT STATUS */}
                      <Col xs="6" className="text-muted d-md-none">
                        Status
                      </Col>
                      <Col xs="6" md="12" className="text-end text-md-start">
                        <Badge
                          bg={item.quantity > 0 ? "primary" : "danger"}
                          className="p-lg-2"
                        >
                          {item.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                        </Badge>
                      </Col>
                      {/* END PRODUCT STATUS */}
                    </Row>
                  </Col>

                  {/* Xem Chi Tiết */}
                  <Col
                    md="4"
                    className={customer ? "d-none d-md-block text-center" : ""}
                  >
                    <Link href={`/product/${item.id}`}>
                      <a className="btn btn-outline-dark mt-4 mt-md-0">
                        Xem chi tiết
                      </a>
                    </Link>
                  </Col>
                  {/* END Xem Chi Tiết */}

                  <Col xs="2" className="d-none d-md-block text-center">
                    {/* REMOVE BUTTON */}
                    <a
                      className="wishlist-remove text-muted"
                      href="#"
                      onClick={(e) => removeFromWishlist(e, item)}
                    >
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="w-3rem h-3rem svg-icon-light"
                      />
                    </a>
                    {/* END REMOVE BUTTON */}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishlistItems
