import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMapMarked } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/router"
import { useUser } from "../../components/UserContext"
import { getUserFromLocalStorage } from "../../utils/authUtils" // Thêm import để lấy thông tin người dùng
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { getOrderById } from "../../api/OrderAPI" // Import hàm gọi API của bạn
import { toast } from "react-toastify"

// Schema validation với yup
const schema = yup
  .object({
    orderId: yup
      .string()
      .required("Mã đơn hàng là bắt buộc!")
      .min(6, "Mã đơn hàng ít nhất 6 ký tự!"),
  })
  .required()

export async function getStaticProps() {
  return {
    props: {
      title: "Tracking Order",
    },
  }
}

const CustomerOrderTracking = () => {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập chưa
    const userData = getUserFromLocalStorage()
    if (!userData) {
      // Nếu chưa đăng nhập, điều hướng đến trang login
      router.push("/account/login")
    } else {
      setLoading(false)
    }
  }, [router, user])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Sử dụng resolver để áp dụng schema validation
  })

  const onSubmit = async (data) => {
    try {
      // Lấy token từ user context hoặc localStorage
      const token = getUserFromLocalStorage()?.token

      // Kiểm tra nếu token không có, hiển thị lỗi
      if (!token) {
        toast.error("Token không hợp lệ!")
        return
      }

      // Gọi hàm getOrderById để lấy thông tin đơn hàng
      const orderData = await getOrderById(data.orderId, token)

      toast.success(orderData.message)

      // Hiển thị thông báo chuyển hướng
      toast.info("Đang chuyển hướng... Vui lòng đợi trong giây lát!")

      // Chuyển hướng sau 3 giây
      setTimeout(() => {
        router.push(`/order-detail/?order-id=${data.orderId}`)
      }, 1000)
    } catch (error) {
      if (error.message === "Không tìm thấy đơn hàng") {
        toast.error(error.message)
      } else if (error.message === "Không thể xem đơn hàng của người khác!") {
        toast.error(error.message)  
      } else {
        toast.error("Có lỗi xảy ra! Vui lòng thử lại sau!")
      }
    }
  }

  if (loading) {
    return (
      <Container className="py-6 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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
            <Breadcrumb.Item active>Tra cứu đơn hàng</Breadcrumb.Item>
          </Breadcrumb>
          <div className="hero-content">
            <h1 className="hero-heading mb-3">Trang tra cứu đơn hàng</h1>
            <div>
              <p className="text-muted mb-0">
                Để tra cứu đơn hàng, bạn cần nhập chính xác mã đơn hàng của bạn!
              </p>
            </div>
          </div>
        </Container>
      </section>
      <section className="pb-6">
        <Container>
          <Row>
            <Col lg="5">
              <Card>
                <Card.Body className="p-5">
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                      <Form.Label htmlFor="orderId">Order ID</Form.Label>
                      <Form.Control
                        id="orderId"
                        type="text"
                        {...register("orderId")} // Kết nối với react-hook-form
                        isInvalid={!!errors.orderId} // Hiển thị lỗi nếu có
                      />
                      <Form.Text id="orderIdHelp" className="text-muted">
                        Nhập vào đây mã đơn hàng của bạn
                      </Form.Text>
                      {errors.orderId && (
                        <Form.Control.Feedback type="invalid">
                          {errors.orderId.message}
                        </Form.Control.Feedback>
                      )}
                    </div>
                    <Button variant="dark" type="submit">
                      <FontAwesomeIcon icon={faMapMarked} className="me-2" />{" "}
                      Tra cứu ngay
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default CustomerOrderTracking
