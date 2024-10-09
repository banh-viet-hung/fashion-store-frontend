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
} from "../../api/ProductAPI" // Import hàm gọi API
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
import SelectBox from "../../components/SelectBox"
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import { faHeart } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useWindowSize from "../../hooks/UseWindowSize"

export async function getStaticPaths() {
  const productsData = await getProductsWithPagination(0, 1000) // Lấy dữ liệu sản phẩm từ API
  const paths = productsData._embedded.product.map((product) => ({
    params: { id: product.id.toString() }, // Sử dụng id làm slug
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const productData = await getProductById(params.id) // Lấy sản phẩm theo id
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
  const [activeType, setActiveType] = useState("material_0")
  const [quantity, setQuantity] = useState("1")
  const [images, setImages] = useState([]) // Khởi tạo state cho hình ảnh
  const [feedbacks, setFeedbacks] = useState([])
  const size = useWindowSize()

  useEffect(() => {
    const fetchImages = async () => {
      if (productData && productData.id) {
        const imagesData = await getImagesByProductId(productData.id) // Gọi API để lấy hình ảnh sản phẩm
        setImages(imagesData)
      }
    }

    fetchImages()
  }, [productData])

  // Lấy ảnh thumbnail hoặc ảnh đầu tiên
  const thumbnailImage =
    images.find((image) => image.thumbnail) || images[0] || null

  const onClick = (e, index) => {
    e.preventDefault()
    if (size.width > 1200) {
      setActiveImage(index)
      setLightBoxOpen(!lightBoxOpen)
    }
  }

  const addToCart = (e, product) => {
    e.preventDefault()
    addCartItem(product, quantity)
    dispatch({ type: "add", payload: product, quantity: quantity })
  }

  const addToWishlist = (e, product) => {
    e.preventDefault()
    addWishlistItem(product)
    wishlistDispatch({ type: "add", payload: product })
  }

  const onChange = (e) => {
    const value = e.target.value
    setQuantity(value)
  }

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
                          ({(
                            feedbacks.reduce(
                              (acc, feedback) => acc + feedback.rating,
                              0
                            ) / feedbacks.length
                          ).toFixed(1)})
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Form>
                  <Row>
                    <Col sm="6" lg="12" className="detail-option mb-4">
                      <h6 className="detail-option-heading">
                        Kích thước <span>(yêu cầu)</span>
                      </h6>
                      {/* <SelectBox options={dummyProduct.sizes} id="detail-slug" /> */}
                    </Col>
                    <Col sm="6" lg="12" className="detail-option mb-4">
                      <h6 className="detail-option-heading">
                        Màu sắc <span>(yêu cầu)</span>
                      </h6>
                      {/* {dummyProduct.types.map((type) => (
                          <label
                            key={type.value}
                            className={`btn btn-sm btn-outline-primary detail-option-btn-label ${
                              activeType === type.id ? "active" : ""
                            } me-1`}
                            htmlFor={type.id}
                          >
                            {type.label}
                            <Form.Control
                              className="input-invisible"
                              type="radio"
                              name="material"
                              value={type.value}
                              id={type.id}
                              onChange={() => setActiveType(type.id)}
                              required
                            />
                          </label>
                        ))} */}
                    </Col>
                  </Row>
                  <InputGroup className="w-100 mb-4">
                    <Form.Control
                      size="lg"
                      className="detail-quantity"
                      defaultValue="1"
                      name="items"
                      type="number"
                      onChange={onChange}
                    />
                    <div className="flex-grow-1">
                      <div className="d-grid h-100">
                        <Button
                          variant="dark"
                          type="submit"
                          onClick={(e) => addToCart(e, productData)}
                        >
                          <FontAwesomeIcon
                            icon={faShoppingCart}
                            className="me-2"
                          />
                          Thêm vào giỏ hàng
                        </Button>
                      </div>
                    </div>
                  </InputGroup>
                  <Row className="mb-4">
                    <Col xs="6">
                      <a
                        href="#"
                        onClick={(e) => addToWishlist(e, productData)}
                      >
                        <FontAwesomeIcon icon={faHeart} className="me-2" />
                        Yêu thích
                      </a>
                    </Col>
                  </Row>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Danh mục:&nbsp;</strong>
                      {/* <Link href={`/${productData.category[1]}`}>
                          <a className="text-muted">{productData.category[0]}</a>
                        </Link> */}
                    </li>
                    <li>
                      <strong>Tính năng nổi bật:&nbsp;</strong>
                      {/* {dummyProduct.tags.map((tag, index) => (
                          <React.Fragment key={tag.name}>
                            <Link href={tag.link}>
                              <a className="text-muted">{tag.name}</a>
                            </Link>
                            {index < dummyProduct.tags.length - 1 ? ",\u00A0" : ""}
                          </React.Fragment>
                        ))} */}
                    </li>
                  </ul>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
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
