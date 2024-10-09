import React, { useState, useEffect, useRef, useContext } from "react"
import {
  Button,
  Modal,
  Row,
  Col,
  Form,
  InputGroup,
  CloseButton,
  Badge,
} from "react-bootstrap"
import { Swiper, SwiperSlide } from "swiper/react"
import { CartContext } from "./CartContext"
import { addCartItem } from "../hooks/UseCart"
import { addWishlistItem } from "../hooks/UseWishlist"
import { WishlistContext } from "./WishlistContext"
import Stars from "./Stars"
import Link from "next/link"
import SelectBox from "./SelectBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import { faHeart } from "@fortawesome/free-regular-svg-icons"
import Image from "./Image"
import "swiper/css"
import moment from "moment"
import { getImagesByProductId, getFeedbackByProductId } from "../api/ProductAPI" // Import API

const ModalQuickView = ({ isOpen, toggle, product }) => {
  const swiperRef = useRef(null)
  const [quantity, setQuantity] = useState("1")
  const [currentIndex, updateCurrentIndex] = useState(0)
  const [cartItems, dispatch] = useContext(CartContext)
  const [wishlistItems, wishlistDispatch] = useContext(WishlistContext)
  const [images, setImages] = useState([])
  const [feedbacks, setFeedbacks] = useState([]) // State for feedbacks

  const isFresh = product.createdAt
    ? moment().diff(moment(product.createdAt), "days") < 7
    : false

  const isSale = product.salePrice !== 0
  const isSoldOut = product.quantity <= 0

  useEffect(() => {
    const fetchImages = async () => {
      if (product && product.id) {
        const images = await getImagesByProductId(product.id)
        setImages(images)
      }
    }

    const fetchFeedbacks = async () => {
      if (product && product.id) {
        const feedbackData = await getFeedbackByProductId(product.id) // Gọi API để lấy feedback
        setFeedbacks(feedbackData)
      }
    }

    fetchImages()
    fetchFeedbacks() // Gọi hàm fetchFeedbacks
  }, [product])

  const addToCart = (e) => {
    e.preventDefault()
    addCartItem(product, quantity)
    dispatch({ type: "add", payload: product, quantity })
  }

  const addToWishlist = (e) => {
    e.preventDefault()
    addWishlistItem(product)
    wishlistDispatch({ type: "add", payload: product })
  }

  const slideTo = (index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index + 1)
      updateCurrentIndex(index)
    }
  }

  const params = {
    on: {
      slideChange: () => {
        const newIndex = swiperRef.current.swiper.realIndex
        updateCurrentIndex(newIndex)
      },
    },
  }

  const sizes = [
    { value: "value_0", label: "Small" },
    { value: "value_1", label: "Medium" },
    { value: "value_2", label: "Large" },
  ]

  const [activeType, setActiveType] = useState("material_0_modal")

  // Tính điểm trung bình và số lượng phản hồi
  const averageRating =
    feedbacks.length > 0
      ? parseFloat(
          (
            feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) /
            feedbacks.length
          ).toFixed(1)
        )
      : 0
  const reviewCount = feedbacks.length

  return (
    <Modal show={isOpen} onHide={toggle} size="xl">
      <CloseButton
        className="btn-close-absolute btn-close-rotate"
        onClick={toggle}
      />
      <Modal.Body className="quickview-body">
        <Row>
          <Col lg="6">
            <div className="detail-carousel">
              {isSale && <Badge className="product-badge">Sale</Badge>}
              {isFresh && (
                <Badge bg="secondary" className="product-badge">
                  New
                </Badge>
              )}
              {isSoldOut && (
                <Badge className="product-badge" bg="dark">
                  Sold Out
                </Badge>
              )}
              <Swiper {...params} loop ref={swiperRef}>
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      className="img-fluid"
                      src={image.url}
                      alt={image.alt || "Product image"}
                      width={538}
                      height={538}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-thumbs">
                {images.map((image, index) => (
                  <button
                    key={image.url}
                    onClick={() => slideTo(index)}
                    className={`swiper-thumb-item detail-thumb-item mb-3 ${
                      currentIndex === index ? "active" : ""
                    }`}
                  >
                    <Image
                      className="img-fluid"
                      src={image.url}
                      alt={image.alt || "Thumbnail"}
                      width={82}
                      height={82}
                    />
                  </button>
                ))}
              </div>
            </div>
          </Col>
          <Col lg="6" className="p-lg-5">
            <h2 className="mb-4 mt-4 mt-lg-1">{product.name}</h2>
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between mb-4">
              <ul className="list-inline mb-2 mb-sm-0">
                <li className="list-inline-item h4 fw-light mb-0">
                  {isSale
                    ? `${(product.salePrice ?? 0)
                        .toLocaleString("it-IT")
                        .replace(/,/g, ".")}đ`
                    : `${(product.price ?? 0)
                        .toLocaleString("it-IT")
                        .replace(/,/g, ".")}đ`}
                </li>
                {isSale && (
                  <li className="list-inline-item text-muted fw-light">
                    <del>
                      {(product.price ?? 0)
                        .toLocaleString("it-IT")
                        .replace(/,/g, ".")}
                      đ
                    </del>
                  </li>
                )}
              </ul>

              <div className="d-flex align-items-center text-sm">
                {feedbacks.length > 0 && (
                  <>
                    <Stars
                      stars={parseFloat(
                        (
                          feedbacks.reduce(
                            (acc, feedback) => acc + feedback.rating,
                            0
                          ) / feedbacks.length
                        ).toFixed(1)
                      )}
                      className="me-2 mb-0"
                      secondColor="gray-300"
                    />
                    <span className="text-muted text-uppercase">
                      (
                      {(
                        feedbacks.reduce(
                          (acc, feedback) => acc + feedback.rating,
                          0
                        ) / feedbacks.length
                      ).toFixed(1)}
                      )
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="mb-4 text-muted">
              {product.description || "No description available"}
            </p>

            <Form>
              <Row>
                <Col sm="6" lg="12" className="detail-option mb-4">
                  <h6 className="detail-option-heading">
                    Kích thước <span>(yêu cầu)</span>
                  </h6>
                  <SelectBox options={sizes} />
                </Col>

                <Col sm="6" lg="12" className="detail-option mb-5">
                  <h6 className="detail-option-heading">
                    Màu sắc <span>(yêu cầu)</span>
                  </h6>
                  <Button
                    as="label"
                    variant="outline-primary"
                    className={`detail-option-btn-label me-1 ${
                      activeType === "material_0_modal" ? "active" : ""
                    }`}
                    size="sm"
                    htmlFor="material_0_modal"
                  >
                    Hoodie
                    <Form.Control
                      className="input-invisible"
                      type="radio"
                      name="material"
                      value="value_0"
                      id="material_0_modal"
                      onChange={() => setActiveType("material_0_modal")}
                      required
                    />
                  </Button>
                  <Button
                    as="label"
                    variant="outline-primary"
                    className={`detail-option-btn-label ${
                      activeType === "material_1_modal" ? "active" : ""
                    }`}
                    size="sm"
                    htmlFor="material_1_modal"
                  >
                    College
                    <Form.Control
                      className="input-invisible"
                      type="radio"
                      name="material"
                      value="value_1"
                      id="material_1_modal"
                      onChange={() => setActiveType("material_1_modal")}
                      required
                    />
                  </Button>
                </Col>
              </Row>

              <InputGroup className="w-100 mb-4">
                <Form.Control
                  size="lg"
                  className="detail-quantity"
                  name="items"
                  type="number"
                  value={quantity > 0 ? quantity : ""}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Button
                  variant="dark"
                  onClick={addToCart}
                  className="flex-grow-1"
                >
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="me-2 flex-grow-1"
                  />
                  Thêm vào giỏ hàng
                </Button>
              </InputGroup>

              <Row className="mb-4">
                <Col xs="6">
                  <a href="#" onClick={addToWishlist}>
                    <FontAwesomeIcon icon={faHeart} className="me-2" />
                    Yêu thích
                  </a>
                </Col>
              </Row>
              <ul className="list-unstyled">
                <li>
                  <strong>Danh mục:</strong>{" "}
                  <Link
                    href={
                      product.category
                        ? `/${product.category[1]}`
                        : "/category-full"
                    }
                  >
                    <a onClick={toggle} className="text-muted">
                      {product.category ? product.category[0] : "Jeans"}
                    </a>
                  </Link>
                </li>
                <li>
                  <strong>Tính năng nỗi bật:</strong>{" "}
                  <a className="text-muted" href="#">
                    Leisure
                  </a>
                  ,{" "}
                  <a className="text-muted" href="#">
                    Elegant
                  </a>
                </li>
              </ul>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default ModalQuickView
