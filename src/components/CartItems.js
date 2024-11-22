import React, { useContext, useEffect, useState } from "react"
import { CartContext } from "../components/CartContext"
import { Row, Col, Button, Form } from "react-bootstrap"
import { removeCartItem, addCartItem, updateCartItem } from "../hooks/UseCart"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import Image from "./Image"
import { getProductById, getImagesByProductId } from "../api/ProductAPI"
import { getProductQuantity } from "../api/ProductVariantAPI"

// Hàm định dạng tiền
const formatCurrency = (amount) => {
  if (amount == null) {
    return "Loading..." // Hoặc bất kỳ chuỗi nào bạn muốn
  }
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "VND",
  })
}

const CartItems = ({ review, className }) => {
  const [cartItems, dispatch] = useContext(CartContext) // Cart context
  const [productDetails, setProductDetails] = useState({}) // State to store product details

  useEffect(() => {
    // Fetch details for each item in the cart
    const fetchProductDetails = async () => {
      for (let item of cartItems) {
        try {
          const productData = await getProductById(item.productId)
          const images = await getImagesByProductId(item.productId)
          const thumbnailImage =
            images.find((image) => image.thumbnail) || images[0] // Prefer thumbnail image

          setProductDetails((prevDetails) => ({
            ...prevDetails,
            [item.productId]: {
              name: productData.name,
              price:
                productData.salePrice !== 0
                  ? productData.salePrice
                  : productData.price,
              image: thumbnailImage ? thumbnailImage.url : null,
            },
          }))
        } catch (error) {
          console.error("Error fetching product details:", error)
        }
      }
    }

    fetchProductDetails()
  }, [cartItems])

  const decreaseQuantity = (product) => {
    if (product.quantity > 1) {
      const newQuantity = product.quantity - 1
      updateCartQuantity(product, newQuantity)
    }
  }

  const increaseQuantity = (product) => {
    const newQuantity = product.quantity + 1
    updateCartQuantity(product, newQuantity)
  }

  const removeFromCart = (e, product) => {
    e.preventDefault()
    dispatch({ type: "remove", payload: product })
    removeCartItem(product)
  }

  const onQuantityChange = (e, product) => {
    const value = parseInt(e.target.value, 10)
    if (value >= 1) {
      updateCartQuantity(product, value)
    }
  }

  const updateCartQuantity = async (product, newQuantity) => {
    const cartData = {
      productId: product.productId,
      size: product.size || null,
      color: product.color || null,
      quantity: newQuantity,
    }

    try {
      const response = await getProductQuantity(
        product.productId,
        product.color,
        product.size
      )

      if (response.success) {
        const availableQuantity = response.data // Số lượng có sẵn từ API

        if (availableQuantity >= newQuantity) {
          // Nếu đủ số lượng, cập nhật giỏ hàng
          updateCartItem(cartData)
          dispatch({ type: "update", payload: cartData })
        } else {
          // Nếu không đủ số lượng, hiển thị thông báo lỗi
          alert(`Chỉ còn ${availableQuantity} sản phẩm trong kho!`)

          // Cập nhật lại số lượng sản phẩm trong giỏ hàng
          updateCartItem({ ...product, quantity: availableQuantity })
          dispatch({
            type: "update",
            payload: { ...product, quantity: availableQuantity },
          })
        }
      } else {
        // Trường hợp API trả về không tìm thấy sản phẩm
        alert("Không tìm thấy sản phẩm này!")
      }
    } catch (error) {
      console.error("Lỗi khi gọi API lấy số lượng sản phẩm:", error)
      alert("Đã xảy ra lỗi, vui lòng thử lại sau.")
    }
  }

  return (
    <div className={`cart ${className ? className : ""}`}>
      <div className={review ? "cart-wrapper" : ""}>
        {review && (
          <div className="d-none d-md-block cart-header">
            <Row>
              <Col xs="6">Item</Col>
              <Col xs="2" className="text-center">
                Price
              </Col>
              <Col xs="2" className="text-end">
                Quantity
              </Col>
              <Col xs="2" className="text-end">
                Total
              </Col>
            </Row>
          </div>
        )}
        <div className="cart-body">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="cart-item"
            >
              <Row className="d-flex align-items-center text-start text-md-center">
                <Col xs="12" md={review ? 6 : 5}>
                  {/* MOBILE REMOVE FROM CART BUTTON */}
                  <a
                    className="cart-remove close mt-3 d-md-none"
                    href="#"
                    onClick={(e) => removeFromCart(e, item)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </a>
                  {/* END MOBILE REMOVE FROM CART BUTTON */}
                  <div className="d-flex align-items-center">
                    {/* PRODUCT IMAGE */}
                    <Link href={`/product/${item.productId}`}>
                      <a>
                        <Image
                          className="cart-item-img"
                          src={
                            productDetails[item.productId]?.image ||
                            "https://res.cloudinary.com/doo4qviqi/image/upload/v1732206099/gqnshi59fakw12ddtae1.jpg"
                          }
                          alt={item.name}
                          width={80}
                          height={103}
                        />
                      </a>
                    </Link>
                    {/* END PRODUCT IMAGE */}
                    <div className="cart-title text-start">
                      {/* PRODUCT TITLE */}
                      <Link href={`/product/${item.productId}`}>
                        <a className="text-dark link-animated">
                          <strong>
                            {productDetails[item.productId]?.name ||
                              "Loading..."}
                          </strong>
                        </a>
                      </Link>
                      <br />
                      {/* END PRODUCT TITLE */}
                      {/* Màu sắc và kích thước */}
                      <div className="cart-item-attributes mt-2">
                        {item.color && (
                          <div className="cart-item-color">
                            <strong>Color: </strong> {item.color}
                          </div>
                        )}
                        {item.size && (
                          <div className="cart-item-size">
                            <strong>Size: </strong> {item.size}
                          </div>
                        )}
                      </div>
                      {/* END Màu sắc và kích thước */}
                    </div>
                  </div>
                </Col>
                <Col xs="12" md={review ? 6 : 7} className="mt-4 mt-md-0">
                  <Row className={`align-items-center ${review ? "me-0" : ""}`}>
                    <Col md={review ? 4 : 3}>
                      {/* PRODUCT PRICE */}
                      <Row>
                        <Col xs="6" className="d-md-none text-muted">
                          Price per item
                        </Col>
                        <Col xs="6" md="12" className="text-end text-md-center">
                          {formatCurrency(
                            productDetails[item.productId]?.price
                          ) || "Loading..."}
                        </Col>
                      </Row>
                      {/* END PRODUCT PRICE */}
                    </Col>
                    <Col md="4">
                      <Row className="align-items-center">
                        {/* PRODUCT QUANTITY */}
                        <Col xs="7" sm="9" className="text-muted d-md-none">
                          Quantity
                        </Col>
                        <Col xs="5" sm="3" md="12">
                          {review ? (
                            item.quantity
                          ) : (
                            <div className="d-flex align-items-center">
                              <Button
                                variant="items"
                                className="items-decrease"
                                onClick={() => decreaseQuantity(item)}
                              >
                                -
                              </Button>
                              <Form.Control
                                className="text-center border-0 border-md input-items"
                                value={item.quantity}
                                onChange={(e) => onQuantityChange(e, item)}
                                type="text"
                              />
                              <Button
                                variant="items"
                                className="items-increase"
                                onClick={() => increaseQuantity(item)}
                              >
                                +
                              </Button>
                            </div>
                          )}
                        </Col>
                        {/* END PRODUCT QUANTITY */}
                      </Row>
                    </Col>
                    <Col md={review ? 4 : 3}>
                      <Row>
                        {/* PRICE TOTAL */}
                        <Col xs="6" className="d-md-none text-muted">
                          Total price
                        </Col>
                        <Col xs="6" md="12" className="text-end text-md-center">
                          {formatCurrency(
                            productDetails[item.productId]?.price *
                              item.quantity
                          ) || "Loading..."}
                        </Col>
                        {/* END PRICE TOTAL */}
                      </Row>
                    </Col>
                    {!review && (
                      <Col xs="2" className="d-none d-md-block text-center">
                        {/* REMOVE FROM CART BUTTON */}
                        <a
                          className="cart-remove text-muted"
                          href="#"
                          onClick={(e) => removeFromCart(e, item)}
                        >
                          <FontAwesomeIcon icon={faTimes} size="lg" />
                        </a>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CartItems
