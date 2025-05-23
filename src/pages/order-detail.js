import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Card,
  Spinner,
  Badge,
  Button,
  Modal,
} from "react-bootstrap"
import { useRouter } from "next/router"
import Link from "next/link"
import CustomerSidebar from "../components/CustomerSidebar"
import { getUserFromLocalStorage } from "../utils/authUtils"
import { useUser } from "../components/UserContext"
import { getAllOrders } from "../api/OrderAPI"
import { getOrderById } from "../api/OrderAPI"
import ReviewOrderSummary from "../components/ReviewOrderSummary"
import ReviewItems from "../components/ReviewItems"
import { cancelOrder } from "../api/OrderAPI"
import { toast } from "react-toastify"

export async function getStaticProps() {
  return {
    props: {
      title: "Chi tiết đơn hàng",
      checkout: true,
    },
  }
}

// Cấu hình trạng thái
const statusConfig = {
  "Chờ thanh toán": {
    icon: "fas fa-hourglass-half",
    color: "#ffc107",
    variant: "warning",
    step: 1,
  },
  "Đã thanh toán": {
    icon: "fas fa-money-bill-wave",
    color: "#17a2b8",
    variant: "info",
    step: 2,
  },
  "Chờ xác nhận": {
    icon: "fas fa-spinner fa-spin",
    color: "#6c757d",
    variant: "secondary",
    step: 2,
  },
  "Chờ lấy hàng": {
    icon: "fas fa-box",
    color: "#007bff",
    variant: "primary",
    step: 3,
  },
  "Chờ giao hàng": {
    icon: "fas fa-truck",
    color: "#6610f2",
    variant: "primary",
    step: 4,
  },
  "Đã giao": {
    icon: "fas fa-check-circle",
    color: "#28a745",
    variant: "success",
    step: 5,
  },
  "Đã hủy": {
    icon: "fas fa-times-circle",
    color: "#dc3545",
    variant: "danger",
    step: 0,
  },
}

// Các bước đặt hàng
const orderSteps = [
  { name: "Đặt hàng", icon: "fas fa-shopping-cart" },
  { name: "Thanh toán", icon: "fas fa-money-bill-wave" },
  { name: "Xác nhận", icon: "fas fa-clipboard-check" },
  { name: "Vận chuyển", icon: "fas fa-truck" },
  { name: "Hoàn tất", icon: "fas fa-flag-checkered" }
]

const CustomerOrder = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orderExists, setOrderExists] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [orderIdToCancel, setOrderIdToCancel] = useState(null)
  const { user } = useUser()
  const router = useRouter()
  const { query } = router

  const orderIdFromUrl = query["order-id"]

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (!userData) {
      router.push("/account/login")
      return
    }

    setIsAuthenticated(true)

    if (!orderIdFromUrl) {
      return
    }

    const checkExistingOrder = async () => {
      try {
        const token = getUserFromLocalStorage()?.token
        if (!token) {
          throw new Error("Token không hợp lệ")
        }

        const data = await getAllOrders(token)
        const userOrders = data.data

        const orderFound = userOrders.some(
          (order) => order.id.toString() === orderIdFromUrl
        )

        setOrderExists(orderFound)

        if (orderFound) {
          const orderData = await getOrderById(orderIdFromUrl, token)
          setOrderDetails(orderData.data)
        }
      } catch (error) {
        console.error(error)
        setOrderExists(false)
      } finally {
        setLoading(false)
      }
    }

    checkExistingOrder()
  }, [router, orderIdFromUrl, user])

  const handleCancelOrder = () => {
    setShowModal(true)
  }

  const handleConfirmCancel = async () => {
    const token = getUserFromLocalStorage()?.token
    if (!token) {
      console.error("Token không hợp lệ")
      return
    }

    try {
      const response = await cancelOrder(orderIdFromUrl, token)
      toast.success("Đã hủy đơn hàng thành công")

      const updatedOrderData = await getOrderById(orderIdFromUrl, token)
      setOrderDetails(updatedOrderData.data)

      setShowModal(false)
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hủy đơn hàng")
    } finally {
      setShowModal(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center p-4 bg-white rounded shadow-sm">
          <Spinner animation="border" variant="primary" className="mb-3" style={{ width: '3rem', height: '3rem' }} />
          <p className="mb-0 text-muted">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (orderExists === false) {
    router.push("/account/orders")
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center p-4 bg-white rounded shadow-sm">
          <Spinner animation="border" variant="primary" className="mb-3" style={{ width: '3rem', height: '3rem' }} />
          <p className="mb-0 text-muted">Đang xác thực người dùng...</p>
        </div>
      </div>
    )
  }

  const sortedOrderStatusDetails = orderDetails
    ? [...orderDetails.orderStatusDetails].sort(
      (a, b) => new Date(b.updateAt) - new Date(a.updateAt)
    )
    : []

  const currentStatus = sortedOrderStatusDetails[0] || {}

  const currentStatusConfig = statusConfig[currentStatus.statusName] || {
    icon: "fas fa-question-circle",
    color: "#6c757d",
    variant: "secondary",
    step: 0,
  }

  const canCancel =
    !orderDetails?.orderStatusDetails.some(
      (status) => status.statusName === "Đã thanh toán"
    ) &&
    (currentStatus.statusName === "Chờ thanh toán" ||
      currentStatus.statusName === "Chờ xác nhận")

  const currentStep = currentStatusConfig.step;

  function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  }

  function formatTime(dateString) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('vi-VN', options);
  }

  return (
    <div className="bg-light py-5 min-vh-100">
      <Container className="py-3">
        {/* Breadcrumb & Order Info */}
        <div className="mb-5">
          <Breadcrumb className="bg-transparent px-0 py-2 mb-0">
            <Link href="/" passHref>
              <Breadcrumb.Item className="text-decoration-none">
                <i className="fas fa-home me-1"></i> Trang chủ
              </Breadcrumb.Item>
            </Link>
            <Link href="/account/orders" passHref>
              <Breadcrumb.Item className="text-decoration-none">Đơn hàng của tôi</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>
              <span className="fw-medium">#{orderIdFromUrl}</span>
            </Breadcrumb.Item>
          </Breadcrumb>

          <div className="d-flex justify-content-between align-items-center mt-2">
            <div>
              <h1 className="h3 fw-bold mb-1">Đơn hàng #{orderIdFromUrl}</h1>
            </div>
            <div className="d-flex">
              <Link href="/account/orders" passHref>
                <Button variant="light" className="me-2 d-flex align-items-center" size="sm">
                  <i className="fas fa-arrow-left me-2"></i> Quay lại
                </Button>
              </Link>
              {canCancel && (
                <Button
                  variant="danger"
                  size="sm"
                  className="d-flex align-items-center"
                  onClick={handleCancelOrder}
                >
                  <i className="fas fa-times-circle me-2"></i> Hủy đơn hàng
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Order Status Steps */}
        {currentStatus.statusName !== "Đã hủy" && (
          <div className="mb-5 card border-0 shadow-sm p-4">
            <div className="order-timeline">
              <div className="position-relative">
                <div className="progress" style={{ height: '3px', backgroundColor: '#e9ecef' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${currentStep >= 5 ? 100 : (currentStep - 1) * 25}%`,
                      backgroundColor: currentStatusConfig.color
                    }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between position-relative" style={{ marginTop: '-12px' }}>
                  {orderSteps.map((step, index) => (
                    <div
                      key={index}
                      className="text-center position-relative"
                      style={{ width: '120px', marginLeft: index === 0 ? '-10px' : 0, marginRight: index === 4 ? '-10px' : 0 }}
                    >
                      <div
                        className={`
                          d-flex align-items-center justify-content-center rounded-circle mx-auto
                          ${index + 1 <= currentStep ? 'bg-primary text-white' : 'bg-light text-muted border'}
                        `}
                        style={{
                          width: '40px',
                          height: '40px',
                          border: index + 1 <= currentStep ? 'none' : '1px solid #dee2e6',
                          zIndex: 2,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className={`${step.icon} ${index + 1 === currentStep ? 'fa-beat-fade' : ''}`}></i>
                      </div>
                      <div className="mt-2 small">
                        <div className={`fw-medium ${index + 1 <= currentStep ? 'text-dark' : 'text-muted'}`}>{step.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <Row className="g-4">
          <Col lg="8" className="order-lg-1">
            {/* Order Status Timeline */}
            <Card className="border-0 shadow-sm mb-4 overflow-hidden">
              <Card.Header className="bg-white d-flex justify-content-between align-items-center p-4">
                <div className="d-flex align-items-center">
                  <i className={`${currentStatusConfig.icon} me-2`} style={{ color: currentStatusConfig.color }}></i>
                  <h5 className="mb-0">Trạng thái đơn hàng</h5>
                </div>
                <Badge
                  bg={currentStatusConfig.variant}
                  className="rounded-pill px-3 py-2"
                >
                  {currentStatus.statusName}
                </Badge>
              </Card.Header>

              <div className="status-timeline p-4">
                {sortedOrderStatusDetails.map((status, index) => {
                  const statusCfg = statusConfig[status.statusName] || {
                    icon: "fas fa-circle",
                    color: "#6c757d",
                    variant: "secondary"
                  };

                  return (
                    <div
                      key={index}
                      className={`timeline-item position-relative ps-4 pb-4 ${index === sortedOrderStatusDetails.length - 1 ? '' : 'border-start'
                        }`}
                      style={{
                        borderColor: '#e9ecef',
                        borderLeftWidth: '2px'
                      }}
                    >
                      <div
                        className="timeline-badge position-absolute rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          left: '-10px',
                          top: '0px',
                          width: '20px',
                          height: '20px',
                          background: status.statusName === currentStatus.statusName
                            ? statusCfg.color
                            : '#f8f9fa',
                          border: `2px solid ${status.statusName === currentStatus.statusName
                            ? statusCfg.color
                            : '#dee2e6'}`
                        }}
                      >
                        {status.statusName === currentStatus.statusName && (
                          <i className={`${statusCfg.icon} fa-xs text-white`}></i>
                        )}
                      </div>

                      <div className="timeline-content bg-white rounded p-3" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="fw-bold mb-1">{status.statusName}</h6>
                          <div className="text-muted small">{formatDate(status.updateAt)}</div>
                        </div>
                        <p className="mb-2 text-muted">{status.description}</p>
                        {status.statusName === "Đã hủy" && status.cancelReason && (
                          <p className="mb-2 text-danger">
                            <i className="fas fa-info-circle me-1"></i>
                            <strong>Lí do hủy:</strong> {status.cancelReason}
                          </p>
                        )}
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">{formatTime(status.updateAt)}</small>
                          <small className="text-muted">
                            {status.updatedBy ? (
                              <><i className="fas fa-user-edit me-1"></i> {status.updatedBy}</>
                            ) : (
                              <><i className="fas fa-robot me-1"></i> Hệ thống</>
                            )}
                          </small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Order Items */}
            <Card className="border-0 shadow-sm mb-4 overflow-hidden">
              <Card.Header className="bg-white p-4">
                <div className="d-flex align-items-center">
                  <i className="fas fa-shopping-bag me-2 text-primary"></i>
                  <h5 className="mb-0">Sản phẩm đã đặt</h5>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <ReviewItems review products={orderDetails?.items} />
              </Card.Body>
            </Card>
          </Col>

          {/* Right Sidebar */}
          <Col lg="4" className="order-lg-2">
            <div className="sticky-top" style={{ top: '20px' }}>
              {/* Order Status Card - Mobile only */}
              {currentStatus.statusName === "Đã hủy" && (
                <Card className="border-0 shadow-sm mb-4 d-lg-none">
                  <Card.Body className="p-4 text-center">
                    <div className="mb-3">
                      <span className="badge-status rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                        style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: '#ffebee'
                        }}
                      >
                        <i className="fas fa-times-circle fa-2x text-danger"></i>
                      </span>
                      <h5 className="fw-bold text-danger mb-0">Đơn hàng đã bị hủy</h5>
                    </div>
                    <p className="text-muted mb-0">
                      {sortedOrderStatusDetails[0]?.description || "Đơn hàng này đã bị hủy"}
                    </p>
                  </Card.Body>
                </Card>
              )}

              {/* Order Summary */}
              <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                <Card.Header className="bg-white p-4">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-receipt me-2 text-primary"></i>
                    <h5 className="mb-0">Tổng quan đơn hàng</h5>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <ReviewOrderSummary priceDetails={orderDetails?.priceDetails} />

                  {/* Phương thức thanh toán */}
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-bold mb-3">
                      <i className="fas fa-credit-card me-2 text-muted"></i> Phương thức thanh toán
                    </h6>
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        <i className="fas fa-money-bill-wave text-success fa-lg"></i>
                      </span>
                      <div>
                        <p className="mb-0 fw-medium">Thanh toán khi nhận hàng (COD)</p>
                        <small className="text-muted">Thanh toán bằng tiền mặt khi nhận được hàng</small>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Shipping Info */}
              <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                <Card.Header className="bg-white p-4">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                    <h5 className="mb-0">Địa chỉ nhận hàng</h5>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex mb-3">
                    <div className="flex-shrink-0 me-3">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px' }}>
                        <i className="fas fa-user text-primary"></i>
                      </div>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{orderDetails?.shippingAddress?.fullName}</h6>
                      <p className="mb-0 text-muted">
                        <i className="fas fa-phone-alt me-2 small"></i>
                        {orderDetails?.shippingAddress?.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-top">
                    <h6 className="fw-medium mb-3">
                      <i className="fas fa-home me-2 text-muted"></i> Địa chỉ giao hàng
                    </h6>
                    <p className="mb-1 text-dark">{orderDetails?.shippingAddress?.address}</p>
                    <p className="mb-0 text-muted">
                      {orderDetails?.shippingAddress?.district}, {orderDetails?.shippingAddress?.city}
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Cần trợ giúp */}
              <Card className="border-0 shadow-sm mb-4 bg-light">
                <Card.Body className="p-4">
                  <h6 className="fw-bold mb-3">
                    <i className="fas fa-headset me-2"></i> Cần trợ giúp?
                  </h6>
                  <p className="small text-muted mb-3">
                    Nếu bạn có thắc mắc về đơn hàng, vui lòng liên hệ với chúng tôi.
                  </p>
                  <div className="d-grid">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      href="https://www.facebook.com/viethungprofile.personal/?locale=vi_VN"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-comment-dots me-2"></i> Liên hệ hỗ trợ
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Cancel Order Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Xác nhận hủy đơn hàng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <div className="text-center mb-4">
            <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '80px', height: '80px' }}>
              <i className="fas fa-times-circle fa-3x text-danger"></i>
            </div>
          </div>
          <p className="mb-3 text-center fs-5">Bạn có chắc chắn muốn hủy đơn hàng #{orderIdFromUrl}?</p>
          <div className="alert alert-warning py-2 mb-0 small">
            <i className="fas fa-info-circle me-2"></i>
            <strong>Lưu ý:</strong> Hành động này không thể hoàn tác sau khi xác nhận.
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 d-flex justify-content-center">
          <Button variant="outline-secondary" onClick={handleCloseModal} className="px-4">
            <i className="fas fa-times me-2"></i> Đóng
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel} className="px-4">
            <i className="fas fa-check me-2"></i> Xác nhận hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CustomerOrder
