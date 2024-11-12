import React, { useContext, useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Alert,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap"
import InnerImageZoom from "react-inner-image-zoom"
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css"
import {
  getProductsWithPagination,
  getProductById,
  getImagesByProductId,
  getFeedbackByProductId,
  getSizesByProductId,
  getColorsByProductId,
} from "../../api/ProductAPI"
import { getUserByFeedbackId } from "../../api/FeedbackAPI"
import Icon from "../../components/Icon"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import Stars from "../../components/Stars"
import ProductBottomTabs from "../../components/ProductBottomTabs"
import ProductBottomProducts from "../../components/ProductBottomProducts"
import Link from "next/link"
import { CartContext } from "../../components/CartContext"
import { addCartItem } from "../../hooks/UseCart"
import { addWishlistItem } from "../../hooks/UseWishlist"
import { WishlistContext } from "../../components/WishlistContext"
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import { faHeart } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useWindowSize from "../../hooks/UseWindowSize"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

// Static Generation (SSG) - Paths and Props fetching
export async function getStaticPaths() {
  const productsData = await getProductsWithPagination(0, 1000)
  const paths = productsData._embedded.product.map((product) => ({
    params: { id: product.id.toString() },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const productData = await getProductById(params.id)
  return {
    props: {
      title: productData.name,
      productData,
    },
  }
}

const ProductPage = ({ productData }) => {
  const [lightBoxOpen, setLightBoxOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [alert, setAlert] = useState(true)
  const [cartItems, dispatch] = useContext(CartContext)
  const [wishlistItems, wishlistDispatch] = useContext(WishlistContext)
  const [quantity, setQuantity] = useState("1")
  const [images, setImages] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [activeSize, setActiveSize] = useState(null)
  const [activeColor, setActiveColor] = useState(null)
  const [category, setCategory] = useState(null) // Danh mục sản phẩm
  const [features, setFeatures] = useState([]) // Tính năng nổi bật
  const size = useWindowSize()

  // Fetch Product Images
  useEffect(() => {
    const fetchImages = async () => {
      if (productData && productData.id) {
        const imagesData = await getImagesByProductId(productData.id)
        setImages(imagesData)
      }
    }
    fetchImages()
  }, [productData])

  // Fetch Feedbacks with User Data
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbackData = await getFeedbackByProductId(productData.id)
        const feedbacksWithUser = await Promise.all(
          feedbackData.map(async (feedback) => {
            const userResponse = await getUserByFeedbackId(feedback.id)
            return {
              id: feedback.id,
              rating: feedback.rating,
              comment: feedback.comment,
              createdAt: feedback.createdAt,
              user: userResponse,
            }
          })
        )
        setFeedbacks(feedbacksWithUser)
      } catch (error) {
        console.error("Error fetching feedbacks:", error)
      }
    }
    fetchFeedbacks()
  }, [productData.id])

  // Fetch Sizes and Colors
  useEffect(() => {
    const fetchSizesAndColors = async () => {
      const sizesData = await getSizesByProductId(productData.id)
      setSizes(sizesData)

      const colorsData = await getColorsByProductId(productData.id)
      setColors(colorsData)

      // Giả sử sản phẩm có thuộc tính category và features
      setCategory(productData.category || "Chưa có danh mục")
      setFeatures(productData.features || ["Chưa có tính năng nổi bật"])
    }
    fetchSizesAndColors()
  }, [productData])

  // Form Validation Schema
  const schema = yup.object().shape({
    size:
      sizes.length > 0
        ? yup.string().required("Vui lòng chọn kích thước")
        : yup.string(),
    color:
      colors.length > 0
        ? yup.string().required("Vui lòng chọn màu sắc")
        : yup.string(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  // Handle Image Click for Lightbox
  const onClick = (e, index) => {
    e.preventDefault()
    if (size.width > 1200) {
      setActiveImage(index)
      setLightBoxOpen(!lightBoxOpen)
    }
  }

  // Add Product to Cart
  const addToCart = (e, product) => {
    // e.preventDefault()

    // Xây dựng đối tượng cartData
    const cartData = {
      productId: productData.id, // ID của sản phẩm
      size: activeSize || null, // Kích thước, null nếu không chọn
      color: activeColor || null, // Màu sắc, null nếu không chọn
      quantity: quantity || 1, // Số lượng, mặc định là 1 nếu không có giá trị
    }

    // In ra thông tin cartData
    console.log("Dữ liệu giỏ hàng:", cartData)

    // Cập nhật giỏ hàng (bạn có thể sử dụng context hoặc redux tùy vào cách bạn quản lý state)
    // addCartItem(product, quantity) // Gọi hàm để thêm vào giỏ hàng
    // dispatch({ type: "add", payload: product, quantity: quantity }) // Cập nhật vào giỏ hàng thông qua dispatch
  }

  // Add Product to Wishlist
  const addToWishlist = (e, product) => {
    e.preventDefault()
    addWishlistItem(product)
    wishlistDispatch({ type: "add", payload: product })
  }

  // Handle Quantity Change
  const onChange = (e) => {
    const value = e.target.value
    setQuantity(value)
  }

  // Get Thumbnail Image (First Image if no Thumbnail)
  const thumbnailImage =
    images.find((image) => image.thumbnail) || images[0] || null

  return (
    <React.Fragment>
      <section>
        <Container fluid className="px-xl-7 pt-5 pb-3 pb-lg-6">
          <div className="d-block" id="addToCartAlert">
            <Alert
              variant="success"
              className="mb-4 mb-lg-5 opacity-10"
              role="alert"
              show={alert}
              onClose={() => setAlert(false)}
              closeVariant="white"
              dismissible
            >
              <div className="d-flex align-items-center pe-3">
                <Icon
                  icon="checked-circle-1"
                  className="d-none d-sm-block w-3rem h-3rem svg-icon-light flex-shrink-0 me-3"
                />
                <p className="mb-0">
                  {productData.name} đã được thêm vào giỏ hàng.
                  <br className="d-inline-block d-lg-none" />
                  <Link href="/cart">
                    <a className="text-reset text-decoration-underline ms-lg-3">
                      Xem giỏ hàng
                    </a>
                  </Link>
                </p>
              </div>
            </Alert>
          </div>

          {/* Breadcrumb */}
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            </Link>
            <Link href="/category" passHref>
              <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>{productData.name}</Breadcrumb.Item>
          </Breadcrumb>

          <Row>
            {/* Product Images */}
            <Col
              lg="6"
              xl="7"
              className="pt-4 order-2 order-lg-1 photoswipe-gallery"
            >
              {images.map((image, index) => (
                <a
                  key={index}
                  onClick={(e) => onClick(e, index)}
                  className="d-block mb-4"
                  href={image.url}
                >
                  <InnerImageZoom
                    hideHint
                    src={image.url}
                    zoomSrc={image.url}
                    alt={image.alt || "Product Image"}
                    zoomType="hover"
                    className="cursor-pointer"
                  />
                </a>
              ))}

              <Lightbox
                open={lightBoxOpen}
                close={() => setLightBoxOpen(false)}
                slides={images.map((image) => ({
                  alt: image.alt || "Product Image",
                  src: image.url,
                }))}
                index={activeImage}
              />
            </Col>

            {/* Product Details */}
            <Col lg="6" xl="4" className="pt-4 order-1 order-lg-2 ms-lg-auto">
              <div className="sticky-top" style={{ top: "100px" }}>
                <h1 className="mb-4">{productData.name}</h1>
                <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between mb-4">
                  <ul className="list-inline mb-2 mb-sm-0">
                    <li className="list-inline-item h4 fw-light mb-0">
                      {productData.salePrice > 0
                        ? `${(productData.salePrice ?? 0)
                            .toLocaleString("it-IT")
                            .replace(/,/g, ".")}đ`
                        : `${(productData.price ?? 0)
                            .toLocaleString("it-IT")
                            .replace(/,/g, ".")}đ`}
                    </li>
                    {productData.salePrice > 0 && (
                      <li className="list-inline-item text-muted fw-light">
                        <del>
                          {(productData.price ?? 0)
                            .toLocaleString("it-IT")
                            .replace(/,/g, ".")}
                          đ
                        </del>
                      </li>
                    )}
                  </ul>

                  {/* Ratings */}
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
                          secondColor="gray-300"
                          starClass="me-1"
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

                {/* Product Options Form */}
                <Form onSubmit={handleSubmit(addToCart)}>
                  {/* Size selection */}
                  {sizes.length > 0 && (
                    <div className="mb-4">
                      <h6 className="detail-option-heading">
                        Kích thước <span>(yêu cầu)</span>
                      </h6>
                      <div>
                        {sizes.map((size) => (
                          <Button
                            key={size.id}
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setActiveSize(size.name)
                              setValue("size", size.name)
                            }}
                            className={activeSize === size.name ? "active" : ""}
                          >
                            {size.name}
                          </Button>
                        ))}
                      </div>
                      {errors.size && (
                        <p className="text-danger">{errors.size.message}</p>
                      )}
                    </div>
                  )}

                  {/* Color selection */}
                  {colors.length > 0 && (
                    <div className="mb-4">
                      <h6 className="detail-option-heading">
                        Màu sắc <span>(yêu cầu)</span>
                      </h6>
                      <div>
                        {colors.map((color) => (
                          <Form.Check
                            key={color.id}
                            type="radio"
                            name="color"
                            id={color.id}
                            label={
                              <span
                                className={`btn-colour ${
                                  activeColor === color.name ? "active" : ""
                                }`}
                                style={{ backgroundColor: color.code.trim() }}
                              />
                            }
                            checked={activeColor === color.name}
                            onChange={() => {
                              setActiveColor(color.name)
                              setValue("color", color.name)
                            }}
                          />
                        ))}
                      </div>
                      {errors.color && (
                        <p className="text-danger">{errors.color.message}</p>
                      )}
                    </div>
                  )}

                  {/* Quantity */}
                  <InputGroup className="w-100 mb-4">
                    <Form.Control
                      size="lg"
                      name="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <Button
                      variant="dark"
                      type="submit"
                      className="flex-grow-1"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      Thêm vào giỏ hàng
                    </Button>
                  </InputGroup>
                </Form>

                {/* Wishlist */}
                <div className="mb-4">
                  <Button
                    variant="outline-danger"
                    onClick={(e) => addToWishlist(e, productData)}
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faHeart} className="me-2" />
                    Thêm vào yêu thích
                  </Button>
                </div>

                {/* Category and Features */}
                <ul className="list-unstyled">
                  <li>
                    <strong>Danh mục:&nbsp;</strong>
                    {category}
                  </li>
                  <li>
                    <strong>Tính năng nổi bật:&nbsp;</strong>
                    {features.join(", ")}
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Product Bottom Tabs */}
      <ProductBottomTabs
        product={productData}
        thumbnail={thumbnailImage ? thumbnailImage.url : null}
        feedbacks={feedbacks}
      />
      <ProductBottomProducts />
    </React.Fragment>
  )
}

export default ProductPage
