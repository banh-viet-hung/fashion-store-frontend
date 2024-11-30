import React, { useContext, useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Nav,
  Button,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/router"

import OrderSummary from "../components/OrderSummary"
import CartItems from "../components/CartItems"
import { FormContext } from "../components/FormContext"
import { CartContext } from "../components/CartContext" // Import CartContext
import { getUserFromLocalStorage } from "../utils/authUtils"
import { createOrder } from "../api/OrderAPI"

export async function getStaticProps() {
  return {
    props: {
      title: "Thanh toán",
      checkout: true,
    },
  }
}

const Checkout4 = () => {
  const [formInputs, setFormInputs] = useContext(FormContext)
  const [cart] = useContext(CartContext) // Lấy dữ liệu giỏ hàng từ CartContext
  const [isLoading, setIsLoading] = useState(true) // Quản lý trạng thái loading
  const [isRedirecting, setIsRedirecting] = useState(false) // Trạng thái chuyển hướng
  const [showErrorToast, setShowErrorToast] = useState(false) // Quản lý hiển thị Toast lỗi
  const [errorMessage, setErrorMessage] = useState("") // Lưu trữ thông báo lỗi
  const [isOrderLoading, setIsOrderLoading] = useState(false) // Trạng thái loading cho nút "Xác nhận đặt hàng"
  const router = useRouter()

  // Kiểm tra xem có địa chỉ thanh toán hay không, nếu không có sẽ chuyển hướng về trang checkout1
  useEffect(() => {
    if (!formInputs.payment && !isRedirecting) {
      setIsRedirecting(true) // Bắt đầu trạng thái chuyển hướng
      setIsLoading(false) // Dừng trạng thái loading
      router.push("/checkout1") // Chuyển hướng về trang checkout1
    } else {
      setIsLoading(false) // Nếu đã có payment, dừng loading
    }
  }, [formInputs.payment, router, isRedirecting])

  // Cập nhật formInputs với dữ liệu từ CartContext khi component được mount
  useEffect(() => {
    setFormInputs({
      ...formInputs,
      cart: cart, // Cập nhật giỏ hàng từ CartContext vào formInputs
    })
  }, [cart]) // Chỉ cập nhật lại khi cart thay đổi

  function replaceNullWithEmptyString(data) {
    return JSON.parse(
      JSON.stringify(data, (key, value) => (value === null ? "" : value))
    )
  }

  const handleOrderConfirmation = async (event) => {
    event.preventDefault() // Ngăn chặn reload trang khi bấm nút

    setIsOrderLoading(true) // Bắt đầu loading cho nút

    if (
      !formInputs.cart ||
      !formInputs.payment ||
      !formInputs.address ||
      !formInputs.shipping
    ) {
      alert("Vui lòng điền đầy đủ thông tin!") // Thông báo lỗi nếu thiếu thông tin
      router.push("/checkout1") // Chuyển hướng về trang checkout1
    }

    const token = getUserFromLocalStorage()?.token || null
    const modifiedFormInputs = replaceNullWithEmptyString(formInputs)

    try {
      const response = await createOrder(modifiedFormInputs, token)

      if (response.success) {
        router.push(`/checkout-confirmed?id=${response.data}`)
      } else {
        setErrorMessage(response.message || "Có lỗi xảy ra, vui lòng thử lại!")
        setShowErrorToast(true) // Hiển thị thông báo lỗi
      }
    } catch (error) {
      console.error("Error confirming order:", error)
      setErrorMessage(error.message || "Có lỗi xảy ra, vui lòng thử lại!")
      setShowErrorToast(true) // Hiển thị thông báo lỗi
    } finally {
      setIsOrderLoading(false) // Dừng trạng thái loading sau khi hoàn tất
    }
  }

  // Hiển thị spinner trong khi loading hoặc chuyển hướng
  if (isLoading || isRedirecting) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <React.Fragment>
      <section className="hero py-6">
        <Container>
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>Thanh toán</Breadcrumb.Item>
          </Breadcrumb>
          <div className="hero-content">
            <h1 className="hero-heading">Thanh toán</h1>
            <div>
              <p className="lead text-muted">
                Hãy chắc chắn rằng các lựa chọn đã đúng như mong muốn của bạn
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="8">
              <Nav variant="pills" className="custom-nav mb-5">
                <Nav.Item className="w-25">
                  <Link href="/checkout1" passHref>
                    <Nav.Link className="text-sm">Địa chỉ nhận hàng</Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="w-25">
                  <Link href="/checkout2" passHref>
                    <Nav.Link className="text-sm">Vận chuyển</Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="w-25">
                  <Link href="/checkout3" passHref>
                    <Nav.Link className="text-sm">Thanh toán</Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="w-25">
                  <Link href="/checkout4" passHref>
                    <Nav.Link className="text-sm" active>
                      Tổng kết
                    </Nav.Link>
                  </Link>
                </Nav.Item>
              </Nav>

              {/* Đánh giá đơn hàng */}
              <div className="mb-5">
                <CartItems review />
              </div>

              {/* Nút điều hướng */}
              <div className="my-5 d-flex justify-content-between flex-column flex-lg-row">
                <Link href="/checkout3" passHref>
                  <Button variant="link" className="text-muted">
                    <FontAwesomeIcon icon={faAngleLeft} className="me-2" />
                    Trở lại
                  </Button>
                </Link>
                <Button
                  variant="dark"
                  onClick={handleOrderConfirmation}
                  disabled={isOrderLoading}
                >
                  {isOrderLoading ? (
                    <>
                      Đang xử lý{" "}
                      <Spinner animation="border" size="sm" className="ms-2" />
                    </>
                  ) : (
                    <>
                      Xác nhận đặt hàng
                      <FontAwesomeIcon icon={faAngleRight} className="ms-2" />
                    </>
                  )}
                </Button>
              </div>
            </Col>

            <Col lg="4">
              <OrderSummary />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Thông báo lỗi */}
      <ToastContainer
        className="p-3"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <Toast
          onClose={() => setShowErrorToast(false)}
          show={showErrorToast}
          delay={5000}
          autohide
          bg="danger"
        >
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  )
}

export default Checkout4
