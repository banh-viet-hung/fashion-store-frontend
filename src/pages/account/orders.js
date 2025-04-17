import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button, Badge, Card, Spinner, Dropdown, Nav } from "react-bootstrap"
import Link from "next/link"
import { useRouter } from "next/router"
import CustomerSidebar from "../../components/CustomerSidebar"
import { getUserFromLocalStorage } from "../../utils/authUtils"
import { useUser } from "../../components/UserContext"
import { getAllOrders } from "../../api/OrderAPI"

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
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const { user } = useUser()

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (!userData) {
      router.push("/account/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router, user])

  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const token = user?.token || getUserFromLocalStorage()?.token
          if (!token) {
            throw new Error("Token không hợp lệ")
          }
          const data = await getAllOrders(token)
          if (data.success) {
            setOrders(data.data)
          } else {
            setError("Không thể tải danh sách đơn hàng")
          }
        } catch (error) {
          setError(error.message || "Lỗi không xác định")
        } finally {
          setLoading(false)
        }
      }

      fetchOrders()
    }
  }, [isAuthenticated, user])

  // Hàm lọc đơn hàng theo trạng thái
  const getFilteredOrders = () => {
    if (filter === "all") return orders;
    return orders.filter(order => order.currentStatus === filter);
  }

  // Tính tổng số đơn hàng theo trạng thái
  const getOrderCountByStatus = (status) => {
    return orders.filter(order => order.currentStatus === status).length;
  }

  // Đếm đơn hàng theo trạng thái
  const orderStats = {
    all: orders.length,
    "Chờ xác nhận": getOrderCountByStatus("Chờ xác nhận"),
    "Chờ lấy hàng": getOrderCountByStatus("Chờ lấy hàng"),
    "Chờ giao hàng": getOrderCountByStatus("Chờ giao hàng"),
    "Đã giao": getOrderCountByStatus("Đã giao"),
    "Đã hủy": getOrderCountByStatus("Đã hủy"),
  }

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center p-4 bg-white rounded shadow-sm">
          <Spinner animation="border" variant="primary" className="mb-3" style={{width: '3rem', height: '3rem'}} />
          <p className="mb-0 text-muted">Đang tải dữ liệu đơn hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="mb-4">
          <Col md={12}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
              <div className="mb-3 mb-md-0">
                <h1 className="h3 fw-bold mb-1">Đơn hàng của bạn</h1>
                <p className="text-muted mb-0">Quản lý và theo dõi đơn hàng của bạn một cách dễ dàng</p>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row className="g-4">
          {/* Sidebar */}
          <Col xl="3" lg="4" className="order-lg-2">
            <div className="sticky-top" style={{ top: '20px' }}>
              {/* Customer Sidebar */}
              <CustomerSidebar />
              
              {/* Need Help Section in Sidebar */}
              <Card className="border-0 shadow-sm mt-4 bg-white overflow-hidden">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <i className="fas fa-headset text-primary me-2"></i> Hỗ trợ
                  </h5>
                  <p className="text-muted small mb-3">Bạn cần trợ giúp với đơn hàng? Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.</p>
                  <div className="d-grid">
                    <Button 
                      variant="outline-primary"
                      size="sm"
                      href="https://www.facebook.com/viethungprofile.personal/?locale=vi_VN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className="fas fa-comment-dots me-2"></i> Liên hệ hỗ trợ
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
          
          {/* Main content */}
          <Col lg="8" xl="9" className="order-lg-1">
            {/* Order Status Filter */}
            <Card className="border-0 shadow-sm mb-4 overflow-hidden">
              <Card.Body className="p-0">
                <div className="order-stats-container">
                  <Nav variant="pills" className="order-status-tabs border-bottom p-1 px-2 flex-nowrap overflow-auto">
                    <Nav.Item>
                      <Nav.Link 
                        active={filter === 'all'}
                        onClick={() => setFilter('all')}
                        className="d-flex align-items-center px-3 py-2"
                      >
                        <i className="fas fa-list-ul me-2"></i>
                        <span>Tất cả</span>
                        <Badge bg="secondary" pill className="ms-2">{orderStats.all}</Badge>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={filter === 'Chờ xác nhận'}
                        onClick={() => setFilter('Chờ xác nhận')}
                        className="d-flex align-items-center px-3 py-2"
                      >
                        <i className="fas fa-clock text-warning me-2"></i>
                        <span>Chờ xác nhận</span>
                        <Badge bg="warning" text="dark" pill className="ms-2">{orderStats["Chờ xác nhận"]}</Badge>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={filter === 'Chờ lấy hàng'}
                        onClick={() => setFilter('Chờ lấy hàng')}
                        className="d-flex align-items-center px-3 py-2"
                      >
                        <i className="fas fa-box text-primary me-2"></i>
                        <span>Chờ lấy hàng</span>
                        <Badge bg="primary" pill className="ms-2">{orderStats["Chờ lấy hàng"]}</Badge>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={filter === 'Chờ giao hàng'}
                        onClick={() => setFilter('Chờ giao hàng')}
                        className="d-flex align-items-center px-3 py-2"
                      >
                        <i className="fas fa-truck text-info me-2"></i>
                        <span>Chờ giao hàng</span>
                        <Badge bg="info" pill className="ms-2">{orderStats["Chờ giao hàng"]}</Badge>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={filter === 'Đã giao'}
                        onClick={() => setFilter('Đã giao')}
                        className="d-flex align-items-center px-3 py-2"
                      >
                        <i className="fas fa-check-circle text-success me-2"></i>
                        <span>Đã giao</span>
                        <Badge bg="success" pill className="ms-2">{orderStats["Đã giao"]}</Badge>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={filter === 'Đã hủy'}
                        onClick={() => setFilter('Đã hủy')}
                        className="d-flex align-items-center px-3 py-2"
                      >
                        <i className="fas fa-times-circle text-danger me-2"></i>
                        <span>Đã hủy</span>
                        <Badge bg="danger" pill className="ms-2">{orderStats["Đã hủy"]}</Badge>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Card.Body>
            </Card>

            {/* Order List */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <Card.Header className="bg-white border-0 p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 d-flex align-items-center">
                    <i className="fas fa-shopping-bag text-primary me-2"></i>
                    {filter === 'all' ? 'Tất cả đơn hàng' : `Đơn hàng: ${filter}`}
                  </h5>
                  <div className="d-md-none">
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm" id="dropdown-filter">
                        <i className="fas fa-filter me-1"></i> Lọc
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item onClick={() => setFilter('all')} active={filter === 'all'}>
                          Tất cả đơn hàng
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Chờ xác nhận')} active={filter === 'Chờ xác nhận'}>
                          Chờ xác nhận
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Chờ lấy hàng')} active={filter === 'Chờ lấy hàng'}>
                          Chờ lấy hàng
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Chờ giao hàng')} active={filter === 'Chờ giao hàng'}>
                          Chờ giao hàng
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Đã giao')} active={filter === 'Đã giao'}>
                          Đã giao
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilter('Đã hủy')} active={filter === 'Đã hủy'}>
                          Đã hủy
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </Card.Header>
              
              <Card.Body className="p-0">
                {error ? (
                  <div className="text-center p-5">
                    <div className="mb-4">
                      <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                        <i className="fas fa-exclamation-triangle fa-2x text-danger"></i>
                      </div>
                      <h5 className="mb-2">Đã xảy ra lỗi</h5>
                      <p className="text-muted mb-4">{error}</p>
                      <Button 
                        variant="primary" 
                        onClick={() => window.location.reload()}
                        size="sm"
                        className="px-4"
                      >
                        <i className="fas fa-sync-alt me-2"></i>
                        Tải lại trang
                      </Button>
                    </div>
                  </div>
                ) : getFilteredOrders().length === 0 ? (
                  <div className="text-center p-5">
                    <div className="mb-4">
                      <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                        <i className="fas fa-shopping-bag fa-2x text-muted"></i>
                      </div>
                      <h4 className="mb-2">
                        {filter === 'all' 
                          ? 'Bạn chưa có đơn hàng nào' 
                          : `Không có đơn hàng nào ở trạng thái "${filter}"`}
                      </h4>
                      <p className="text-muted mb-4">
                        {filter === 'all' 
                          ? 'Hãy khám phá các sản phẩm của chúng tôi và đặt hàng ngay hôm nay.' 
                          : 'Vui lòng chọn trạng thái khác hoặc quay lại sau.'}
                      </p>
                      {filter === 'all' && (
                        <Link href="/products" passHref>
                          <Button variant="primary" className="px-4">
                            <i className="fas fa-shopping-cart me-2"></i> Bắt đầu mua sắm
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="order-list">
                      {getFilteredOrders().map((order) => (
                        <div key={order.id} className="order-item border-bottom position-relative px-4 py-4">
                          <div className="row g-3 align-items-center">
                            {/* Order ID and Date */}
                            <div className="col-12 col-md-3">
                              <div className="d-flex flex-column">
                                <h6 className="fw-bold mb-1 d-flex align-items-center">
                                  <i className="fas fa-receipt text-primary me-2"></i>
                                  #{order.id}
                                </h6>
                                <div className="text-muted small d-flex align-items-center">
                                  <i className="fas fa-calendar-alt me-1"></i>
                                  {formatDate(order.orderDate)}
                                </div>
                              </div>
                            </div>
                            
                            {/* Order Total */}
                            <div className="col-6 col-md-3">
                              <div className="d-flex flex-column">
                                <h6 className="small text-muted mb-1">Tổng tiền</h6>
                                <div className="fw-bold text-primary">
                                  {order.total.toLocaleString()} ₫
                                </div>
                              </div>
                            </div>
                            
                            {/* Order Status */}
                            <div className="col-6 col-md-3">
                              <div className="d-flex flex-column">
                                <h6 className="small text-muted mb-1">Trạng thái</h6>
                                <Badge 
                                  className={`${statusClassMapping[order.currentStatus]} rounded-pill px-3 py-2 d-inline-flex align-items-center w-fit-content`}
                                >
                                  <i className={`${statusIcons[order.currentStatus]} me-1`}></i>
                                  <span>{order.currentStatus}</span>
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Action Button */}
                            <div className="col-12 col-md-3 text-md-end mt-md-0 mt-2">
                              <Link
                                href={`/order-detail/?order-id=${order.id}`}
                                passHref
                              >
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  className="d-inline-flex align-items-center"
                                >
                                  Chi tiết
                                  <i className="fas fa-chevron-right ms-2"></i>
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Footer Info */}
                    <div className="p-4 bg-light border-top">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                          Hiển thị {getFilteredOrders().length} đơn hàng {filter !== 'all' ? `trạng thái "${filter}"` : ''}
                        </div>
                        <div>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 text-decoration-none"
                            onClick={() => setFilter('all')}
                            disabled={filter === 'all'}
                          >
                            <i className="fas fa-eye me-1"></i> Xem tất cả
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Custom CSS */}
      <style jsx global>{`
        .order-status-tabs {
          background-color: #f8f9fa;
        }

        .order-status-tabs .nav-link {
          border-radius: 50rem;
          color: #495057;
          margin: 0.25rem;
          white-space: nowrap;
        }

        .order-status-tabs .nav-link.active {
          font-weight: 500;
        }
        
        .order-item:hover {
          background-color: #f8f9fa;
        }
        
        .w-fit-content {
          width: fit-content;
        }
        
        .overflow-auto::-webkit-scrollbar {
          height: 4px;
        }
        
        .overflow-auto::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 4px;
        }
        
        @media (max-width: 767px) {
          .order-item {
            padding-top: 1.25rem;
            padding-bottom: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}

export default CustomerOrders
