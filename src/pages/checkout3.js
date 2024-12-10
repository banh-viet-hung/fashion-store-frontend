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
    COD: true, // Mặc định phương thức COD mở
    VNBANK: false, // Mặc định đóng phần "Thanh toán qua thẻ ATM"
    INTCARD: false, // Mặc định đóng phần "Thanh toán qua thẻ quốc tế"
  })
  const [isLoading, setIsLoading] = useState(true) // Quản lý trạng thái loading
  const [isRedirecting, setIsRedirecting] = useState(false) // Theo dõi trạng thái chuyển hướng
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
    // Mặc định chọn phương thức thanh toán khi nhận hàng nếu chưa có giá trị
    if (!formInputs.payment) {
      setFormInputs((prev) => ({
        ...prev,
        payment: "COD",
      }))
    }
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
      COD: paymentMethod === "COD" ? !prev.COD : false,
      VNBANK: paymentMethod === "VNBANK" ? !prev.VNBANK : false,
      INTCARD: paymentMethod === "INTCARD" ? !prev.INTCARD : false,
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
                        handleRadioChange({ target: { id: "COD" } })
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

                {/* ATM Payment (VNBANK) */}
                <Card className="border-0 shadow mb-3">
                  <Card.Header>
                    <a
                      href="#"
                      className={multiCollapse.VNBANK ? "" : "collapsed"}
                      onClick={(e) => {
                        e.preventDefault()
                        handleRadioChange({ target: { id: "VNBANK" } })
                      }}
                    >
                      Thanh toán qua thẻ ATM
                    </a>
                  </Card.Header>
                  <Collapse in={multiCollapse.VNBANK}>
                    <div>
                      <Card.Body className="py-5">
                        <Form.Check
                          type="radio"
                          id="VNBANK"
                          name="payment"
                          label="Thẻ ATM"
                          onChange={handleRadioChange}
                          checked={formInputs.payment === "VNBANK"}
                        />
                        <div className="mt-3">
                          <div className="d-flex justify-content-start flex-wrap">
                            {/* Các logo ngân hàng */}
                            <img
                              src="https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/ncb.svg"
                              alt="NCB"
                              className="bank-logo"
                              style={{
                                width: "120px", // Tăng kích thước
                                marginRight: "30px", // Tăng khoảng cách giữa các logo
                                marginBottom: "20px", // Tăng khoảng cách dưới các logo
                                objectFit: "contain", // Đảm bảo hình ảnh không bị biến dạng
                              }}
                            />
                            <img
                              src="https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/eximbank.svg"
                              alt="EXIMBANK"
                              className="bank-logo"
                              style={{
                                width: "120px", // Tăng kích thước
                                marginRight: "30px", // Tăng khoảng cách
                                marginBottom: "20px", // Tăng khoảng cách dưới
                                objectFit: "contain",
                              }}
                            />
                            <img
                              src="https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/vietcombank.svg"
                              alt="Vietcombank"
                              className="bank-logo"
                              style={{
                                width: "120px", // Tăng kích thước
                                marginRight: "30px", // Tăng khoảng cách
                                marginBottom: "20px", // Tăng khoảng cách dưới
                                objectFit: "contain",
                              }}
                            />
                            <img
                              src="https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/techcombank.svg"
                              alt="Techcombank"
                              className="bank-logo"
                              style={{
                                width: "120px", // Tăng kích thước
                                marginRight: "30px", // Tăng khoảng cách
                                marginBottom: "20px", // Tăng khoảng cách dưới
                                objectFit: "contain",
                              }}
                            />
                            {/* Thêm các ngân hàng khác nếu cần */}
                          </div>
                        </div>
                      </Card.Body>
                    </div>
                  </Collapse>
                </Card>

                {/* International Card Payment (INTCARD) */}
                <Card className="border-0 shadow mb-3">
                  <Card.Header>
                    <a
                      href="#"
                      className={multiCollapse.INTCARD ? "" : "collapsed"}
                      onClick={(e) => {
                        e.preventDefault()
                        handleRadioChange({ target: { id: "INTCARD" } })
                      }}
                    >
                      Thanh toán qua thẻ quốc tế
                    </a>
                  </Card.Header>
                  <Collapse in={multiCollapse.INTCARD}>
                    <div>
                      <Card.Body className="py-5">
                        <Form.Check
                          type="radio"
                          id="INTCARD"
                          name="payment"
                          label="Thẻ quốc tế"
                          onChange={handleRadioChange}
                          checked={formInputs.payment === "INTCARD"}
                        />
                        <div className="mt-3">
                          <div className="d-flex justify-content-start flex-wrap">
                            <img
                              src="https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/VISA.svg"
                              alt="VISA"
                              className="bank-logo"
                              style={{
                                width: "120px", // Tăng kích thước
                                marginRight: "30px", // Tăng khoảng cách giữa các logo
                                marginBottom: "20px", // Tăng khoảng cách dưới
                                objectFit: "contain", // Đảm bảo hình ảnh không bị biến dạng
                              }}
                            />
                            <img
                              src="https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/MASTERCARD.svg"
                              alt="MasterCard"
                              className="bank-logo"
                              style={{
                                width: "120px", // Tăng kích thước
                                marginRight: "30px", // Tăng khoảng cách giữa các logo
                                marginBottom: "20px", // Tăng khoảng cách dưới
                                objectFit: "contain",
                              }}
                            />
                            <img
                              src="https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/JCB.svg"
                              alt="JCB"
                              className="bank-logo"
                              style={{
                                width: "120px", // Tăng kích thước
                                marginRight: "30px", // Tăng khoảng cách giữa các logo
                                marginBottom: "20px", // Tăng khoảng cách dưới
                                objectFit: "contain",
                              }}
                            />
                            {/* Thêm các ngân hàng khác nếu cần */}
                          </div>
                        </div>
                      </Card.Body>
                    </div>
                  </Collapse>
                </Card>
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
