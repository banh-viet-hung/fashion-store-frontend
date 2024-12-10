import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Card,
  Spinner,
  Alert,
  Badge,
  Button,
  Modal, // Thêm Modal từ react-bootstrap
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
import { cancelOrder } from "../api/OrderAPI" // Import hàm hủy đơn hàng
import { toast } from "react-toastify"

export async function getStaticProps() {
  return {
    props: {
      title: "Trang chi tiết đơn hàng",
      checkout: true,
    },
  }
}

const CustomerOrder = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orderExists, setOrderExists] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState(null) // Lưu trữ chi tiết đơn hàng
  const [showModal, setShowModal] = useState(false) // Quản lý trạng thái modal
  const [orderIdToCancel, setOrderIdToCancel] = useState(null) // Lưu orderId cần hủy
  const { user } = useUser()
  const router = useRouter()
  const { query } = router

  const orderIdFromUrl = query["order-id"]
  console.log("Order ID từ URL: ", orderIdFromUrl)

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
        console.log("Danh sách đơn hàng người dùng: ", userOrders)

        const orderFound = userOrders.some(
          (order) => order.id.toString() === orderIdFromUrl
        )
        console.log("Đơn hàng tìm thấy: ", orderFound)

        setOrderExists(orderFound)

        if (orderFound) {
          // Gọi API để lấy thông tin chi tiết đơn hàng khi đơn hàng tồn tại
          const orderData = await getOrderById(orderIdFromUrl, token)
          console.log("Dữ liệu trả về từ API: ", orderData) // In dữ liệu trả về từ API

          setOrderDetails(orderData.data) // Lưu thông tin đơn hàng vào state
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
    setShowModal(true) // Hiển thị modal khi bấm vào nút hủy
  }

  const handleConfirmCancel = async () => {
    const token = getUserFromLocalStorage()?.token
    if (!token) {
      console.error("Token không hợp lệ")
      return
    }

    try {
      // Gọi API hủy đơn hàng
      const response = await cancelOrder(orderIdFromUrl, token)
      console.log("Kết quả hủy đơn hàng: ", response)

      // Hiển thị thông báo thành công
      toast.success("Đã hủy đơn hàng thành công")

      // Fetch lại thông tin đơn hàng sau khi hủy
      const updatedOrderData = await getOrderById(orderIdFromUrl, token)
      console.log("Dữ liệu đơn hàng mới: ", updatedOrderData)

      // Cập nhật lại dữ liệu đơn hàng
      setOrderDetails(updatedOrderData.data)

      // Đóng modal sau khi xử lý
      setShowModal(false)
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hủy đơn hàng")
    } finally {
      // Đóng modal sau khi xử lý
      setShowModal(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false) // Đóng modal nếu người dùng hủy
  }

  if (loading) {
    return (
      <Container className="py-6 text-center">
        <Spinner animation="border" role="status"></Spinner>
      </Container>
    )
  }

  if (orderExists === false) {
    router.push("/account/orders")
    return null
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-6 text-center">
        <Spinner animation="border" role="status"></Spinner>
      </Container>
    )
  }

  // Sắp xếp lại orderStatusDetails theo thời gian updateAt giảm dần và làm nổi bật trạng thái hiện tại
  const sortedOrderStatusDetails = orderDetails
    ? [...orderDetails.orderStatusDetails].sort(
        (a, b) => new Date(b.updateAt) - new Date(a.updateAt)
      )
    : []

  const currentStatus = sortedOrderStatusDetails[0] || {}

  // Kiểm tra điều kiện hủy đơn hàng
  const canCancel =
    !orderDetails?.orderStatusDetails.some(
      (status) => status.statusName === "Đã thanh toán"
    ) &&
    (currentStatus.statusName === "Chờ thanh toán" ||
      currentStatus.statusName === "Chờ xác nhận")

  return (
    <Container>
      <section className="hero py-6">
        <Breadcrumb>
          <Link href="/" passHref>
            <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
          </Link>
          <Link href="/account/orders" passHref>
            <Breadcrumb.Item>Danh sách đơn hàng</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item active>#{orderIdFromUrl}</Breadcrumb.Item>
        </Breadcrumb>
        {/* Display order status details */}
        <Row className="my-5">
          <Col>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Trạng thái đơn hàng</h5>
              </Card.Header>
              <Card.Body className="py-4">
                {sortedOrderStatusDetails.map((status, index) => (
                  <Alert
                    key={index}
                    variant={
                      status.statusName === currentStatus.statusName
                        ? "success"
                        : "light"
                    }
                    className={`mb-2 ${
                      status.statusName === currentStatus.statusName
                        ? "border-0"
                        : ""
                    }`}
                  >
                    <strong>{status.statusName}</strong>
                    {status.statusName === currentStatus.statusName && (
                      <Badge variant="success" className="ml-2">
                        Đang xử lý
                      </Badge>
                    )}
                    <br />
                    {status.description} <br />
                    <small>{new Date(status.updateAt).toLocaleString()}</small>
                    <br />
                    {status.updatedBy ? (
                      <small>Cập nhật bởi: {status.updatedBy}</small>
                    ) : (
                      <small>Cập nhật bởi: Không xác định</small>
                    )}
                  </Alert>
                ))}
                {/* Nút Hủy đơn hàng */}
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-3"
                  onClick={handleCancelOrder}
                  disabled={!canCancel} // Chỉ hiển thị nút nếu có thể hủy
                >
                  Hủy đơn hàng
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Modal xác nhận hủy đơn hàng */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hủy đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn
          tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Xác nhận hủy
          </Button>
        </Modal.Footer>
      </Modal>

      <section className="pb-6">
        <Container>
          <Row>
            <Col lg="8" xl="8">
              <ReviewItems review products={orderDetails?.items} />{" "}
              <Row className="my-5">
                <Col md="6">
                  <ReviewOrderSummary
                    priceDetails={orderDetails?.priceDetails}
                  />
                </Col>
                <Col md="6">
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Thông tin nhận hàng</h5>
                    </Card.Header>
                    <Card.Body className="py-4">
                      <Card.Text className="text-muted">
                        <strong>
                          {orderDetails?.shippingAddress?.fullName}
                        </strong>
                        <br />
                        {orderDetails?.shippingAddress?.address}
                        <br />
                        {orderDetails?.shippingAddress?.district},{" "}
                        {orderDetails?.shippingAddress?.city}
                        <br />
                        <strong>Số điện thoại:</strong>{" "}
                        {orderDetails?.shippingAddress?.phoneNumber}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xl="3" lg="4" className="mb-5">
              <CustomerSidebar />
            </Col>
          </Row>
        </Container>
      </section>
    </Container>
  )
}

export default CustomerOrder
