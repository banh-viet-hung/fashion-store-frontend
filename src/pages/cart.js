import React from "react"
import { Container, Row, Col, Breadcrumb, Button } from "react-bootstrap"
import OrderSummary from "../components/OrderSummary"
import Link from "next/link"
import CartItems from "../components/CartItems"
import { CartContext } from "../components/CartContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faSync } from "@fortawesome/free-solid-svg-icons"

export async function getStaticProps() {
  return {
    props: {
      title: "Giỏ hàng",
    },
  }
}

const Cart = () => {
  const [cartItems, dispatch] = React.useContext(CartContext)

  // Nếu giỏ hàng rỗng, hiển thị thông báo
  if (cartItems.length === 0) {
    return (
      <React.Fragment>
        <section className="hero py-6">
          <Container>
            <Breadcrumb>
              <Link href="/" passHref>
                <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
              </Link>
              <Breadcrumb.Item active>Giỏ hàng</Breadcrumb.Item>
            </Breadcrumb>
            <div className="hero-content">
              <h1 className="hero-heading">Giỏ hàng</h1>
              <div>
                <p className="lead text-muted">
                  Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm vào giỏ hàng!
                </p>
              </div>
            </div>
          </Container>
        </section>
        <section>
          <Container>
            <Row className="mb-5">
              <Col className="text-center">
                <Button variant="link" href="/category">
                  <FontAwesomeIcon icon={faChevronLeft} className="me-2" />
                  Trở lại trang mua sắm
                </Button>
              </Col>
            </Row>
          </Container>
        </section>
      </React.Fragment>
    )
  }

  // Nếu có sản phẩm trong giỏ, hiển thị như bình thường
  return (
    <React.Fragment>
      <section className="hero py-6">
        <Container>
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>Giỏ hàng</Breadcrumb.Item>
          </Breadcrumb>
          <div className="hero-content">
            <h1 className="hero-heading">Giỏ hàng</h1>
            <div>
              <p className="lead text-muted">
                Bạn có {cartItems.length} sản phẩm trong giỏ hàng.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <section>
        <Container>
          <Row className="mb-5">
            <Col lg="8" className="pe-xl-5">
              <CartItems className="mb-5" />
              <div className="d-flex justify-content-between flex-column flex-lg-row mb-5 mb-lg-0">
                <Button
                  variant="link"
                  className="text-muted"
                  href="/category"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="me-2" />
                  Tiếp tục mua sắm
                </Button>
              </div>
            </Col>
            <Col lg="4">
              <OrderSummary showProceedToCheckout />
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default Cart
