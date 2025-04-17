import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button, Badge, Table, Card, Spinner } from "react-bootstrap"
import Link from "next/link"
import { useRouter } from "next/router"
import CustomerSidebar from "../../components/CustomerSidebar"
import { getUserFromLocalStorage } from "../../utils/authUtils" // Đường dẫn đúng đến hàm này
import { useUser } from "../../components/UserContext"
import { getAllOrders } from "../../api/OrderAPI" // Đảm bảo rằng hàm getAllOrders đã được import

export async function getStaticProps() {
  return {
    props: {
      title: "Đơn hàng của bạn",
    },
  }
}

const statusClassMapping = {
  "Đã hủy": "bg-danger",
  "Đã giao": "bg-success",
  "Chờ giao hàng": "bg-info", 
  "Chờ xác nhận": "bg-warning",
  "Chờ lấy hàng": "bg-primary",
}

const statusIcons = {
  "Đã hủy": "fas fa-times-circle",
  "Đã giao": "fas fa-check-circle",
  "Chờ giao hàng": "fas fa-truck", 
  "Chờ xác nhận": "fas fa-clock",
  "Chờ lấy hàng": "fas fa-box",
}

const CustomerOrders = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState([]) // State lưu trữ đơn hàng
  const [loading, setLoading] = useState(true) // Trạng thái loading
  const [error, setError] = useState("") // Lỗi nếu có
  const { user } = useUser()

  useEffect(() => {
    const userData = getUserFromLocalStorage() // Lấy thông tin người dùng từ localStorage hoặc cookies
    if (!userData) {
      // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
      router.push("/account/login")
    } else {
      // Nếu đã đăng nhập, set trạng thái isAuthenticated thành true
      setIsAuthenticated(true)
    }
  }, [router, user])

  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const token = user?.token || getUserFromLocalStorage()?.token // Lấy token từ user hoặc localStorage
          if (!token) {
            throw new Error("Token không hợp lệ")
          }
          const data = await getAllOrders(token) // Gọi API lấy danh sách đơn hàng
          if (data.success) {
            setOrders(data.data) // Cập nhật danh sách đơn hàng
          } else {
            setError("Không thể tải danh sách đơn hàng")
          }
        } catch (error) {
          setError(error.message || "Lỗi không xác định")
        } finally {
          setLoading(false) // Đã xong việc tải dữ liệu
        }
      }

      fetchOrders()
    }
  }, [isAuthenticated, user])

  // Render loading state
  if (!isAuthenticated || loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Đang tải dữ liệu đơn hàng...</p>
        </div>
      </Container>
    )
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="mb-5">
          <Col md={12}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold mb-1">Đơn hàng của bạn</h2>
                <p className="text-muted mb-0">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col lg="8" xl="9" className="order-lg-1 mb-5">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                {error ? (
                  <div className="text-center p-5">
                    <div className="mb-3 text-danger">
                      <i className="fas fa-exclamation-circle fa-3x"></i>
                    </div>
                    <h5>Đã xảy ra lỗi</h5>
                    <p className="text-muted">{error}</p>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => window.location.reload()}
                      size="sm"
                    >
                      <i className="fas fa-sync-alt me-2"></i>
                      Tải lại
                    </Button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center p-5">
                    <div className="mb-4">
                      <i className="fas fa-shopping-bag fa-4x text-muted opacity-50"></i>
                    </div>
                    <h4>Chưa có đơn hàng nào</h4>
                    <p className="text-muted">Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi.</p>
                    <Link href="/products" passHref>
                      <Button variant="primary">
                        Bắt đầu mua sắm
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr className="bg-light">
                          <th className="py-3 ps-4 fw-medium text-uppercase text-muted small">Mã đơn</th>
                          <th className="py-3 fw-medium text-uppercase text-muted small">Ngày đặt</th>
                          <th className="py-3 fw-medium text-uppercase text-muted small">Tổng tiền</th>
                          <th className="py-3 fw-medium text-uppercase text-muted small">Trạng thái</th>
                          <th className="py-3 fw-medium text-uppercase text-muted small text-end pe-4">Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-bottom">
                            <td className="ps-4 py-4 align-middle fw-medium">
                              #{order.id}
                            </td>
                            <td className="py-4 align-middle">
                              {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              })}
                            </td>
                            <td className="py-4 align-middle fw-medium">
                              {order.total.toLocaleString()} ₫
                            </td>
                            <td className="py-4 align-middle">
                              <Badge 
                                className={`${statusClassMapping[order.currentStatus]} rounded-pill px-3 py-2 d-inline-flex align-items-center`}
                              >
                                <i className={`${statusIcons[order.currentStatus]} me-1`}></i>
                                <span>{order.currentStatus}</span>
                              </Badge>
                            </td>
                            <td className="py-4 align-middle text-end pe-4">
                              <Link
                                href={`/order-detail/?order-id=${order.id}`}
                                passHref
                              >
                                <Button variant="link" className="p-0 text-decoration-none">
                                  Xem chi tiết <i className="fas fa-chevron-right ms-1 small"></i>
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col xl="3" lg="4" className="order-lg-2">
            <div className="sticky-top" style={{ top: '20px' }}>
              <CustomerSidebar />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CustomerOrders
