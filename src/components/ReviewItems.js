import React, { useEffect, useState } from "react"
import { Row, Col } from "react-bootstrap"
import Link from "next/link"
import Image from "./Image"
import { getProductById, getImagesByProductId } from "../api/ProductAPI"

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

const ReviewItems = ({ review, products }) => {
  const [productDetails, setProductDetails] = useState({}) // State to store product details

  useEffect(() => {
    // Fetch details for each product
    const fetchProductDetails = async () => {
      for (let item of products) {
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
  }, [products])

  return (
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
        {products.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}`}
            className="cart-item"
          >
            <Row className="d-flex align-items-center text-start text-md-center">
              <Col xs="12" md={review ? 6 : 5}>
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
                          {productDetails[item.productId]?.name || "Loading..."}
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
                <Row className="align-items-center">
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
                        {item.quantity}
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
                          productDetails[item.productId]?.price * item.quantity
                        ) || "Loading..."}
                      </Col>
                      {/* END PRICE TOTAL */}
                    </Row>
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

export default ReviewItems
