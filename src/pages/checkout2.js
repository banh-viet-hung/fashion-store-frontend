import React, { useState, useContext, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Nav,
  Card,
  Form,
  Button,
  Spinner,
} from "react-bootstrap"
import Link from "next/link"
import { FormContext } from "../components/FormContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import OrderSummary from "../components/OrderSummary"
import { getShippingMethodsWithPagination } from "../api/ShippingMethodAPI"
import { useRouter } from "next/router"

export async function getServerSideProps() {
  return {
    props: {
      title: "Thanh toán",
      checkout: true,
    },
  }
}

const Checkout2 = () => {
  const [formInputs, setFormInputs] = useContext(FormContext)
  const [shippingOptions, setShippingOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true) // Manage loading state
  const [isRedirecting, setIsRedirecting] = useState(false) // Track redirection state
  const router = useRouter()

  // Check if there is an address; if not, set loading to true, then redirect
  useEffect(() => {
    if (!formInputs.address) {
      setIsRedirecting(true)
      setIsLoading(false) // Stop loading as we begin redirecting
      router.push("/checkout1")
    }
  }, [formInputs, router])

  // Fetch shipping methods from the API when component mounts
  useEffect(() => {
    if (!isRedirecting) {
      // Prevent fetching if we're redirecting
      const fetchShippingMethods = async () => {
        try {
          const data = await getShippingMethodsWithPagination(0, 5)
          setShippingOptions(data._embedded.shippingMethod)
        } catch (error) {
          console.error("Error fetching shipping methods:", error)
        } finally {
          setIsLoading(false) // Stop loading after data is fetched
        }
      }

      fetchShippingMethods()
    }
  }, [isRedirecting]) // Run only if not redirecting

  useEffect(() => {
    if (shippingOptions.length > 0 && !formInputs.shipping) {
      const defaultShipping = shippingOptions[0]
      setFormInputs((prevFormInputs) => ({
        ...prevFormInputs,
        shipping: {
          code: defaultShipping.code,
          name: defaultShipping.name,
          fee: defaultShipping.fee,
        },
      }))
    }
  }, [shippingOptions, formInputs, setFormInputs])

  const onShippingChange = (e, shippingOption) => {
    setFormInputs((prevFormInputs) => ({
      ...prevFormInputs,
      shipping: {
        code: e.target.id,
        name: shippingOption.name,
        fee: shippingOption.fee,
      },
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
            <Breadcrumb.Item active>Thanh toán </Breadcrumb.Item>
          </Breadcrumb>
          <div className="hero-content">
            <h1 className="hero-heading">Thanh toán</h1>
            <div>
              <p className="lead text-muted">Chọn hình thức vận chuyển</p>
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
                  <Nav.Link className="text-sm" active>
                    Vận chuyển
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="w-25">
                  <Nav.Link className="text-sm disabled">Thanh toán</Nav.Link>
                </Nav.Item>
                <Nav.Item className="w-25">
                  <Nav.Link className="text-sm disabled">Tổng kết</Nav.Link>
                </Nav.Item>
              </Nav>

              {/* Shipping options */}
              <Card className="mb-5">
                <Card.Body>
                  <Form>
                    <Row>
                      {shippingOptions.map((shippingOption, index) => (
                        <Col md="6" key={shippingOption.code}>
                          <div className="card-radio mb-4">
                            <label
                              className="card-label"
                              htmlFor={shippingOption.code}
                            />
                            <input
                              className="card-radio-input"
                              type="radio"
                              name="shipping"
                              id={shippingOption.code}
                              onChange={(e) =>
                                onShippingChange(e, shippingOption)
                              }
                              checked={
                                formInputs.shipping
                                  ? formInputs.shipping.code ===
                                    shippingOption.code
                                  : index === 0
                              }
                            />
                            <Card>
                              <Card.Header>
                                <h6 className="mb-0">{shippingOption.name}</h6>
                              </Card.Header>
                              <Card.Body>
                                {shippingOption.fee &&
                                  !isNaN(shippingOption.fee) && (
                                    <h6 className="mb-3">
                                      {shippingOption.fee.toLocaleString()} VND
                                    </h6>
                                  )}
                                <p className="text-muted text-sm card-text">
                                  {shippingOption.description}
                                </p>
                              </Card.Body>
                            </Card>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Form>
                </Card.Body>
              </Card>

              {/* Next/Previous buttons */}
              <div className="my-5 d-flex justify-content-between flex-column flex-lg-row">
                <Link href="/checkout1" passHref>
                  <Button variant="link" className="text-muted">
                    <FontAwesomeIcon icon={faAngleLeft} className="me-2" />
                    Trở lại
                  </Button>
                </Link>
                <Link href="/checkout3" passHref>
                  <Button variant="dark">
                    Tiếp tục
                    <FontAwesomeIcon icon={faAngleRight} className="ms-2" />
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg="4">
              {/* Order Summary */}
              <OrderSummary />
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default Checkout2
