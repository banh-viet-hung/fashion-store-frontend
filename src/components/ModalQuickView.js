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
import { addWishlistItem, removeWishlistItem } from "../hooks/UseWishlist"
import { WishlistContext } from "./WishlistContext"
import Stars from "./Stars"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import { faHeart, faKissWinkHeart } from "@fortawesome/free-regular-svg-icons"
import Image from "./Image"
import "swiper/css"
import moment from "moment"
import {
  getImagesByProductId,
  getFeedbackByProductId,
  getSizesByProductId,
  getColorsByProductId,
} from "../api/ProductAPI" // Import API
import { getProductQuantity } from "../api/ProductVariantAPI" // Import API
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { addCartItem } from "../hooks/UseCart"
import { toast } from "react-toastify"

// Định nghĩa schema validate với Yup, bỏ qua trường quantity
const quickViewSchema = (sizes, colors) =>
  yup.object().shape({
    size:
      sizes.length > 0
        ? yup.string().required("Vui lòng chọn kích thước")
        : yup.string().notRequired(), // Validate size nếu có sizes
    color:
      colors.length > 0
        ? yup.string().required("Vui lòng chọn màu sắc")
        : yup.string().notRequired(), // Validate color nếu có colors
    // Không cần validate quantity nữa
  })

const ModalQuickView = ({ isOpen, toggle, product }) => {
  const swiperRef = useRef(null)
  const [quantity, setQuantity] = useState("1")
  const [currentIndex, updateCurrentIndex] = useState(0)
  const [cartItems, dispatch] = useContext(CartContext)
  const [wishlistItems, wishlistDispatch] = useContext(WishlistContext)
  const [images, setImages] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [sizes, setSizes] = useState([]) // State to store size options
  const [colors, setColors] = useState([]) // State to store color options
  const [activeSize, setActiveSize] = useState(null) // State to store selected size
  const [activeColor, setActiveColor] = useState(null) // State to store selected color

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(quickViewSchema(sizes, colors)), // Schema dynamic based on available sizes and colors
  })

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
        const feedbackData = await getFeedbackByProductId(product.id)
        setFeedbacks(feedbackData)
      }
    }

    const fetchSizes = async () => {
      if (product && product.id) {
        const sizeData = await getSizesByProductId(product.id)
        setSizes(sizeData)
      }
    }

    const fetchColors = async () => {
      if (product && product.id) {
        const colorData = await getColorsByProductId(product.id)
        setColors(colorData)
      }
    }

    fetchImages()
    fetchFeedbacks()
    fetchSizes()
    fetchColors()
  }, [product])

  const addToCart = async (data) => {
    const cartData = {
      productId: product.id, // Always include product ID
      size: activeSize || null, // Set to null if no size selected
      color: activeColor || null, // Set to null if no color selected
      quantity: quantity || 1, // Đảm bảo quantity có giá trị
    }

    try {
      // Gọi API để lấy số lượng sản phẩm
      const response = await getProductQuantity(
        product.id,
        activeColor,
        activeSize
      )

      // Kiểm tra số lượng sản phẩm từ API response
      if (response.success) {
        const availableQuantity = response.data // Số lượng có sẵn từ API

        if (availableQuantity >= quantity) {
          // Nếu số lượng sản phẩm đủ, tiếp tục thêm vào giỏ hàng
          console.log("Sản phẩm có sẵn đủ số lượng:", availableQuantity)

          // Thêm sản phẩm vào giỏ hàng
          addCartItem(cartData)
          dispatch({ type: "add", payload: cartData })

          toast.success("Đã thêm sản phẩm vào giỏ hàng!")
        } else {
          toast.error("Sản phẩm không đủ số lượng!")
          setQuantity(availableQuantity) // Set quantity to available quantity
        }
      } else {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.")
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.")
    }
  }

  // Kiểm tra xem sản phẩm có trong wishlist không
  const isInWishlist = wishlistItems.some((item) => item === product.id)

  const addToWishlist = (e) => {
    e.preventDefault()
    addWishlistItem(product)
    wishlistDispatch({ type: "add", payload: product.id })
  }

  const removeFromWishlist = (e) => {
    e.preventDefault()
    removeWishlistItem(product)
    wishlistDispatch({ type: "remove", payload: product.id })
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

  // Calculate average rating and review count
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
                    className={`swiper-thumb-item detail-thumb-item mb-3 ${currentIndex === index ? "active" : ""
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
                      stars={averageRating}
                      className="me-2 mb-0"
                      secondColor="gray-300"
                    />
                    <span className="text-muted text-uppercase">
                      ({averageRating})
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="mb-4 text-muted">
              {product.description || "No description available"}
            </p>

            <Form onSubmit={handleSubmit(addToCart)}>
              {/* Size Selection */}
              {sizes.length > 0 && (
                <Row>
                  <Col sm="6" lg="12" className="detail-option mb-4">
                    <h6 className="detail-option-heading">
                      Kích thước <span>(Bắt buộc)</span>
                    </h6>
                    {sizes.map((size) => (
                      <Button
                        key={size.id}
                        variant="outline-primary"
                        className={`detail-option-btn-label me-1 ${activeSize === size.name ? "active" : ""
                          }`}
                        size="sm"
                        onClick={() => {
                          setActiveSize(size.name)
                          setValue("size", size.name) // Set size value in form
                        }}
                      >
                        {size.name}
                      </Button>
                    ))}
                    {errors.size && (
                      <p className="text-danger">{errors.size.message}</p>
                    )}
                  </Col>
                </Row>
              )}

              {/* Color Selection (Radio button version) */}
              {colors.length > 0 && (
                <Row>
                  <Col sm="6" lg="12" className="detail-option mb-4">
                    <h6 className="detail-option-heading">
                      Màu sắc <span>(Bắt buộc)</span>
                    </h6>
                    <ul className="list-inline mb-0 colours-wrapper">
                      {colors.map((color) => (
                        <li key={color.id} className="list-inline-item">
                          <Form.Check
                            type="radio"
                            name="color"
                            id={color.id}
                            label={
                              <span
                                className={`btn-colour ${activeColor === color.name ? "active" : ""
                                  }`}
                                style={{ backgroundColor: color.code.trim() }}
                              />
                            }
                            checked={activeColor === color.name}
                            onChange={() => {
                              setActiveColor(color.name)
                              setValue("color", color.name) // Set color value in form
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                    {errors.color && (
                      <p className="text-danger">{errors.color.message}</p>
                    )}
                  </Col>
                </Row>
              )}

              <InputGroup className="w-100 mb-4">
                <Form.Control
                  size="lg"
                  name="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
                <Button variant="dark" type="submit" className="flex-grow-1">
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="me-2 flex-grow-1"
                  />
                  Thêm vào giỏ hàng
                </Button>
              </InputGroup>

              <Row className="mb-4">
                <Col xs="6">
                  {!isInWishlist ? (
                    <a href="#" onClick={addToWishlist}>
                      <FontAwesomeIcon icon={faHeart} className="me-2" />
                      Yêu thích
                    </a>
                  ) : (
                    <a href="#" onClick={removeFromWishlist}>
                      <FontAwesomeIcon
                        icon={faKissWinkHeart}
                        className="me-2"
                      />
                      Hông thích nữa
                    </a>
                  )}
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
