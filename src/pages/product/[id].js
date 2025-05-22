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
  Image,
} from "react-bootstrap"
import InnerImageZoom from "react-inner-image-zoom"
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css"
import {
  getProductsWithPagination,
  getProductById,
  getImagesByProductId,
  getSizesByProductId,
  getColorsByProductId,
  getCategoriesByProductId,
} from "../../api/ProductAPI"
import { getProductFeedbacksWithUser } from "../../api/FeedbackAPI"
import Icon from "../../components/Icon"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import Stars from "../../components/Stars"
import ProductBottomTabs from "../../components/ProductBottomTabs"
import ProductBottomProducts from "../../components/ProductBottomProducts"
import Link from "next/link"
import { CartContext } from "../../components/CartContext"
import { addCartItem } from "../../hooks/UseCart"
import { addWishlistItem, removeWishlistItem } from "../../hooks/UseWishlist"
import { getProductQuantity } from "../../api/ProductVariantAPI"
import { WishlistContext } from "../../components/WishlistContext"
import { faShoppingCart, faSearchPlus, faHeartBroken } from "@fortawesome/free-solid-svg-icons"
import { faHeart } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useWindowSize from "../../hooks/UseWindowSize"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

// Static Generation (SSG) - Paths and Props fetching
export async function getStaticPaths() {
  const productsData = await getProductsWithPagination(0, 1000)
  // Lọc bỏ sản phẩm đã bị xóa
  const activeProducts = productsData._embedded.product.filter(product => !product.deleted)
  const paths = activeProducts.map((product) => ({
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
  const router = useRouter()
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
  const [categories, setCategories] = useState([])
  const size = useWindowSize()

  // Kiểm tra sản phẩm đã bị xóa hay chưa
  if (productData && productData.deleted) {
    return (
      <Container fluid className="px-xl-7 pt-5 pb-3 pb-lg-6">
        <Alert variant="danger">
          <h4>Sản phẩm không tồn tại</h4>
          <p>Sản phẩm này đã bị xóa hoặc không còn tồn tại.</p>
          <div className="mt-3">
            <Link href="/category">
              <a className="btn btn-outline-danger">Quay lại mua sắm</a>
            </Link>
          </div>
        </Alert>
      </Container>
    )
  }

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
        const response = await getProductFeedbacksWithUser(productData.id)
        if (response.success) {
          setFeedbacks(response.data || [])
        } else {
          console.error("Error in feedback response:", response.message)
          setFeedbacks([])
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error)
        setFeedbacks([])
      }
    }
    fetchFeedbacks()
  }, [productData.id])

  // Fetch Sizes, Colors, and Categories
  useEffect(() => {
    const fetchSizesColorsAndCategories = async () => {
      const sizesData = await getSizesByProductId(productData.id)
      setSizes(sizesData)

      const colorsData = await getColorsByProductId(productData.id)
      setColors(colorsData)

      // Fetch categories for the product
      try {
        const categoriesData = await getCategoriesByProductId(productData.id)
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData)
        } else {
          setCategories([])
        }
      } catch (error) {
        console.error("Error fetching product categories:", error)
        setCategories([])
      }
    }
    fetchSizesColorsAndCategories()
  }, [productData.id])

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

  // Handle Image Click for Lightbox and Image Selection
  const handleImageInteraction = (index, openLightbox = false) => {
    setActiveImage(index)
    if (openLightbox && size.width > 1200) {
      setLightBoxOpen(true)
    }
  }

  const addToCart = async (data) => {
    const cartData = {
      productId: productData.id,
      size: activeSize || null,
      color: activeColor || null,
      quantity: quantity || 1,
    }

    try {
      const response = await getProductQuantity(
        productData.id,
        activeColor,
        activeSize
      )

      if (response.success) {
        const availableQuantity = response.data

        if (availableQuantity >= quantity) {
          console.log("Sản phẩm có sẵn đủ số lượng:", availableQuantity)

          addCartItem(cartData)
          dispatch({ type: "add", payload: cartData })

          toast.success("Sản phẩm đã được thêm vào giỏ hàng!")
        } else {
          toast.error("Sản phẩm không đủ số lượng trong kho!")
          setQuantity(availableQuantity)
        }
      } else {
        toast.error("Lỗi khi kiểm tra số lượng sản phẩm!")
      }
    } catch (error) {
      console.error("Lỗi khi gọi API lấy số lượng sản phẩm:", error)
      toast.error("Lỗi khi kiểm tra số lượng sản phẩm!")
    }
  }

  // Kiểm tra xem sản phẩm có trong wishlist không
  const isInWishlist = wishlistItems.some((item) => item === productData.id)

  const addToWishlist = (e) => {
    e.preventDefault()
    addWishlistItem(productData)
    wishlistDispatch({ type: "add", payload: productData.id })
  }

  const removeFromWishlist = (e) => {
    e.preventDefault()
    removeWishlistItem(productData)
    wishlistDispatch({ type: "remove", payload: productData.id })
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
          {/* <div className="d-block" id="addToCartAlert">
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
          </div> */}

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
            {/* Product Images - Improved Layout */}
            <Col
              lg="6"
              xl="7"
              className="pt-4 order-2 order-lg-1 photoswipe-gallery"
            >
              {/* Main Image with Zoom */}
              <div
                className="product-main-image mb-4"
                style={{
                  overflow: 'hidden',
                  borderRadius: '8px',
                  boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}
              >
                {images.length > 0 && (
                  <>
                    <div
                      className="zoom-indicator"
                      style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                      }}
                    >
                      <FontAwesomeIcon icon={faSearchPlus} style={{ fontSize: '18px' }} />
                    </div>
                    <InnerImageZoom
                      hideHint
                      src={images[activeImage]?.url}
                      zoomSrc={images[activeImage]?.url}
                      alt={images[activeImage]?.alt || "Product Image"}
                      zoomType="hover"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleImageInteraction(activeImage, true);
                      }}
                    />
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              <div className="product-thumbnails d-flex flex-wrap justify-content-start"
                style={{
                  maxWidth: '100%',
                  overflowX: 'auto',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#aaa #f5f5f5',
                  paddingBottom: '10px'
                }}
              >
                {images.length > 0 && images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail-item me-2 me-md-3 mb-2 mb-md-3 ${activeImage === index ? 'active' : ''}`}
                    style={{
                      cursor: 'pointer',
                      width: '70px',
                      height: '70px',
                      minWidth: '70px',
                      borderRadius: '6px',
                      border: activeImage === index ? '2px solid #000' : '1px solid #ddd',
                      padding: '3px',
                      transition: 'all 0.2s ease-in-out',
                      overflow: 'hidden',
                      opacity: activeImage === index ? 1 : 0.7,
                      flexShrink: 0
                    }}
                    onClick={() => handleImageInteraction(index)}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = activeImage === index ? 1 : 0.7}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || "Product Thumbnail"}
                      className="img-fluid"
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </div>
                ))}
              </div>

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

                {/* Product Description - Added here from the bottom tabs */}
                <div className="product-description mb-4">
                  <div
                    className="text-muted"
                    dangerouslySetInnerHTML={{
                      __html: productData.detail || productData.description || "Không có mô tả chi tiết",
                    }}
                  />
                </div>

                {/* Product Options Form */}
                <Form onSubmit={handleSubmit(addToCart)}>
                  {/* Size selection */}
                  {sizes.length > 0 && (
                    <div className="mb-4">
                      <h6 className="detail-option-heading fw-bold mb-2">
                        Kích thước <span className="ms-2 text-danger" style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>(Bắt buộc)</span>
                      </h6>
                      <div className="size-options mt-3 d-flex flex-wrap">
                        {sizes.map((size) => (
                          <Button
                            key={size.id}
                            variant={activeSize === size.name ? "primary" : "outline-secondary"}
                            size="sm"
                            onClick={() => {
                              setActiveSize(size.name)
                              setValue("size", size.name)
                            }}
                            className={`me-2 mb-2 px-3 rounded-pill size-option ${activeSize === size.name ? "active" : ""}`}
                            style={{
                              minWidth: '45px',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s ease',
                              boxShadow: activeSize === size.name ? '0 2px 4px rgba(0,0,0,0.15)' : 'none'
                            }}
                          >
                            {size.name}
                          </Button>
                        ))}
                      </div>
                      {errors.size && (
                        <p className="text-danger mt-2" style={{ fontSize: '0.8rem' }}>
                          {errors.size.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Color selection */}
                  {colors.length > 0 && (
                    <div className="mb-4">
                      <h6 className="detail-option-heading fw-bold mb-2">
                        Màu sắc <span className="ms-2 text-danger" style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>(Bắt buộc)</span>
                      </h6>
                      <div className="color-options mt-3">
                        <div className="d-flex flex-wrap">
                          {colors.map((color) => (
                            <div
                              key={color.id}
                              className="position-relative me-3 mb-3"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setActiveColor(color.name)
                                setValue("color", color.name)
                              }}
                            >
                              <div
                                className={`color-option rounded-circle d-flex align-items-center justify-content-center ${activeColor === color.name ? "border border-2 border-primary p-1" : ""}`}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  transition: 'all 0.2s ease',
                                  transform: activeColor === color.name ? 'scale(1.08)' : 'scale(1)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                              >
                                <span
                                  className="rounded-circle"
                                  style={{
                                    backgroundColor: color.code.trim(),
                                    width: activeColor === color.name ? '28px' : '32px',
                                    height: activeColor === color.name ? '28px' : '32px',
                                    border: '1px solid #ddd'
                                  }}
                                ></span>
                              </div>
                              {activeColor === color.name && (
                                <div
                                  className="color-name position-absolute text-center w-100"
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '500',
                                    top: '40px',
                                    left: '0',
                                  }}
                                >
                                  {color.name}
                                </div>
                              )}
                              <input
                                type="radio"
                                name="color"
                                checked={activeColor === color.name}
                                onChange={() => { }} // Keep empty onChange to avoid React warning while actual change happens in onClick
                                style={{ display: 'none' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {errors.color && (
                        <p className="text-danger mt-2" style={{ fontSize: '0.8rem' }}>
                          {errors.color.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="quantity-section mb-4">
                    <h6 className="detail-option-heading fw-bold mb-3">Số lượng</h6>
                    <InputGroup className="w-100">
                      <Form.Control
                        size="lg"
                        name="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        className="text-center border-end-0"
                        style={{ maxWidth: '80px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
                      />
                      <Button
                        variant="dark"
                        type="submit"
                        className="flex-grow-1"
                        style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                        Thêm vào giỏ hàng
                      </Button>
                    </InputGroup>
                  </div>
                </Form>

                {/* Wishlist */}
                <div className="mb-4">
                  <Button
                    variant={
                      !isInWishlist ? "outline-danger" : "outline-primary"
                    }
                    onClick={!isInWishlist ? addToWishlist : removeFromWishlist}
                    className="w-100"
                  >
                    <FontAwesomeIcon
                      icon={!isInWishlist ? faHeart : faHeartBroken}
                      className="me-2"
                    />
                    {!isInWishlist ? "Yêu thích" : "Hông thích nữa"}
                  </Button>
                </div>

                {/* Category */}
                <div className="category-section">
                  <h6 className="detail-option-heading fw-bold mb-2">Danh mục</h6>
                  {categories && categories.length > 0 ? (
                    <div className="mt-2 d-flex flex-wrap">
                      {categories.map((category, index) => (
                        <Link href={`/category/${category.slug || ''}`} key={category.id || index}>
                          <a className="me-2 mb-2 py-1 px-3 rounded-pill bg-light text-dark" style={{ fontSize: '0.85rem', textDecoration: 'none' }}>
                            {category.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Chưa phân loại</p>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Product Reviews Section */}
      <ProductBottomTabs
        product={productData}
        feedbacks={feedbacks}
      />
      {/* <ProductBottomProducts /> */}
    </React.Fragment>
  )
}

export default ProductPage
