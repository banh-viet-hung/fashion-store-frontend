import React, { useState, useContext, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Nav,
  Form,
  Button,
  Card,
  Collapse,
  Spinner,
} from "react-bootstrap"
import Link from "next/link"
import { FormContext } from "../components/FormContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import OrderSummary from "../components/OrderSummary"
import { useRouter } from "next/router"

export async function getStaticProps() {
  return {
    props: {
      title: "Thanh toán",
      checkout: true,
    },
  }
}

const Checkout3 = () => {
  const [formInputs, setFormInputs] = useContext(FormContext)
  const [multiCollapse, setMultiCollapse] = useState({
    card: false, // Mặc định mở "Thanh toán qua thẻ"
    paypal: false,
    COD: true, // Mặc định phần "Thanh toán khi nhận hàng" mở
  })
  const [isLoading, setIsLoading] = useState(true) // Manage loading state
  const [isRedirecting, setIsRedirecting] = useState(false) // Track redirection state
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra xem formInputs.shipping có tồn tại và có giá trị hợp lệ không
    if (!formInputs.shipping || formInputs.shipping.length === 0) {
      // Nếu không có địa chỉ vận chuyển, bắt đầu quá trình redirect
      setIsRedirecting(true)
      router.push("/checkout1")
    } else {
      // Nếu có giá trị, dừng trạng thái loading
      setIsLoading(false)
    }
  }, [formInputs, router]) // Chỉ chạy lại khi formInputs hoặc router thay đổi

  useEffect(() => {
    // Mặc định chọn phương thức thanh toán khi nhận hàng khi trang mới tải
    if (!formInputs.payment) {
      setFormInputs((prev) => ({
        ...prev,
        payment: "COD",
      }))
    }
    console.log(formInputs)
  }, [formInputs, setFormInputs])

  // Handle radio button change
  const handleRadioChange = (e) => {
    const { id } = e.target
    setFormInputs((prevFormInputs) => ({
      ...prevFormInputs,
      payment: id, // Lưu phương thức thanh toán đã chọn vào formContext
    }))
    toggleCollapse(id) // Mở hoặc đóng phần collapse của phương thức thanh toán đã chọn
  }

  // Toggle collapse sections based on selected payment method
  const toggleCollapse = (paymentMethod) => {
    setMultiCollapse((prev) => ({
      card: paymentMethod === "card" ? !prev.card : false,
      paypal: paymentMethod === "paypal" ? !prev.paypal : false,
      COD: paymentMethod === "COD" ? !prev.COD : false,
    }))
  }

  // Show loading spinner until data is loaded or the address is missing
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
            <p className="lead text-muted">Chọn hình thức thanh toán</p>
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
                    <Nav.Link className="text-sm" active>
                      Thanh toán
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="w-25">
                  <Nav.Link className="text-sm disabled" href="#">
                    Tổng kết
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {/* Payment Methods */}
              <Form>
                {/* Pay on COD */}
                <Card className="border-0 shadow mb-3">
                  <Card.Header>
                    <a
                      href="#"
                      className={multiCollapse.COD ? "" : "collapsed"}
                      onClick={(e) => {
                        e.preventDefault()
                        toggleCollapse("COD")
                      }}
                    >
                      Thanh toán khi nhận hàng
                    </a>
                  </Card.Header>
                  <Collapse in={multiCollapse.COD}>
                    <div>
                      <Card.Body className="py-5">
                        <Form.Check
                          type="radio"
                          id="COD"
                          name="payment"
                          label="COD"
                          onChange={handleRadioChange}
                          checked={formInputs.payment === "COD"}
                        />
                      </Card.Body>
                    </div>
                  </Collapse>
                </Card>

                {/* Card Payment (commented out for now) */}
                {/* <Card className="border-0 shadow mb-3">
                  <Card.Header>
                    <a
                      href="#"
                      className={multiCollapse.card ? "" : "collapsed"}
                      onClick={(e) => {
                        e.preventDefault()
                        toggleCollapse("card")
                      }}
                    >
                      Thanh toán bằng thẻ
                    </a>
                  </Card.Header>
                  <Collapse in={multiCollapse.card}>
                    <div>
                      <Card.Body className="py-5">
                        <Row>
                          <Col md={6} className="mb-4">
                            <Form.Label htmlFor="card-name">
                              Name on Card
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="card-name"
                              placeholder="Name on card"
                              value={formInputs["card-name"]}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={6} className="mb-4">
                            <Form.Label htmlFor="card-number">
                              Card Number
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="card-number"
                              placeholder="Card number"
                              value={formInputs["card-number"]}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4} className="mb-4">
                            <Form.Label htmlFor="expiry-date">
                              Expiry Date
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="expiry-date"
                              placeholder="MM/YY"
                              value={formInputs["expiry-date"]}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4} className="mb-4">
                            <Form.Label htmlFor="cvv">CVC/CVV</Form.Label>
                            <Form.Control
                              type="text"
                              name="cvv"
                              placeholder="123"
                              value={formInputs["cvv"]}
                              onChange={handleInputChange}
                            />
                          </Col>
                          <Col md={4} className="mb-4">
                            <Form.Label htmlFor="zip">ZIP</Form.Label>
                            <Form.Control
                              type="text"
                              name="zip"
                              placeholder="123"
                              value={formInputs["zip"]}
                              onChange={handleInputChange}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </div>
                  </Collapse>
                </Card> */}

                {/* PayPal (commented out for now) */}
                {/* <Card className="border-0 shadow mb-3">
                  <Card.Header>
                    <a
                      href="#"
                      className={multiCollapse.paypal ? "" : "collapsed"}
                      onClick={(e) => {
                        e.preventDefault()
                        toggleCollapse("paypal")
                      }}
                    >
                      Thanh toán qua PayPal
                    </a>
                  </Card.Header>
                  <Collapse in={multiCollapse.paypal}>
                    <div>
                      <Card.Body className="py-5">
                        <Form.Check
                          type="radio"
                          id="paypal"
                          name="payment"
                          label="Pay with PayPal"
                          onChange={handleRadioChange}
                          checked={formInputs.payment === "paypal"}
                        />
                      </Card.Body>
                    </div>
                  </Collapse>
                </Card> */}
              </Form>

              {/* Navigation buttons */}
              <div className="my-5 d-flex justify-content-between flex-column flex-lg-row">
                <Link href="/checkout2" passHref>
                  <Button variant="link" className="text-muted">
                    <FontAwesomeIcon icon={faAngleLeft} className="me-2" />
                    Trở lại
                  </Button>
                </Link>
                <Link href="/checkout4" passHref>
                  <Button variant="dark">
                    Tiếp tục
                    <FontAwesomeIcon icon={faAngleRight} className="ms-2" />
                  </Button>
                </Link>
              </div>
            </Col>

            <Col lg="4">
              <OrderSummary />
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default Checkout3
