import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button, Badge, Table } from "react-bootstrap"
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
  "Đã hủy": "bg-danger text-white", // Màu đỏ cho "Đã hủy"
  "Đã giao": "bg-success text-white", // Màu xanh lá cho "Đã giao"
  "Chờ giao hàng": "bg-info text-white", // Màu xanh dương cho "Chờ giao hàng"
  "Chờ xác nhận": "bg-warning text-dark", // Màu vàng cho "Chờ xác nhận"
  "Chờ lấy hàng": "bg-primary text-white", // Màu xanh dương đậm cho "Chờ lấy hàng"
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

  // Nếu chưa xác định trạng thái đăng nhập hoặc đang tải, có thể hiển thị loading
  if (!isAuthenticated || loading) {
    return <Container className="py-6 text-center">Đang tải...</Container>
  }

  return (
    <React.Fragment>
      <section className="hero py-6">
        <Container>
          <div className="hero-content">
            <h1 className="hero-heading">Danh sách đơn hàng</h1>
            <div>
              <p className="text-muted">Danh sách các đơn hàng của bạn</p>
            </div>
          </div>
        </Container>
      </section>
      <section className="pb-6">
        <Container>
          <Row>
            <Col lg="8" xl="9">
              {error ? (
                <div className="alert alert-danger">{error}</div> // Hiển thị thông báo lỗi nếu có
              ) : orders.length === 0 ? (
                <div className="alert alert-info">Không có đơn hàng nào</div> // Thông báo khi không có đơn hàng
              ) : (
                <Table hover responsive>
                  <thead className="bg-light">
                    <tr>
                      <th className="py-4 ps-4 text-sm border-0">Mã đơn #</th>
                      <th className="py-4 text-sm border-0">Ngày đặt hàng</th>
                      <th className="py-4 text-sm border-0">Tổng tiền</th>
                      <th className="py-4 text-sm border-0">Trạng thái</th>
                      <th className="py-4 text-sm border-0">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <th className="ps-4 py-5 align-middle"># {order.id}</th>
                        <td className="py-5 align-middle">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="py-5 align-middle">
                          {order.total.toLocaleString()} đ
                        </td>
                        <td className="py-5 align-middle">
                          <Badge
                            className={statusClassMapping[order.currentStatus]}
                          >
                            {order.currentStatus}
                          </Badge>
                        </td>
                        <td className="py-5 align-middle">
                          <Link
                            href={`/order-detail/?order-id=${order.id}`}
                            passHref
                          >
                            <Button variant="outline-dark" size="sm">
                              Xem chi tiết
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
            <Col xl="3" lg="4" className="mb-5">
              <CustomerSidebar />
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default CustomerOrders
