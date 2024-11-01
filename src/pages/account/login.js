import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Toast,
  Spinner,
} from "react-bootstrap"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { loginUser } from "../../api/AuthAPI"
import { useUser } from "../../components/UserContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUbuntu, faGoogle } from "@fortawesome/free-brands-svg-icons"
import { useRouter } from "next/router"

// Định nghĩa schema với Yup cho đăng nhập
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  password: yup
    .string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

export async function getStaticProps() {
  return {
    props: {
      title: "Đăng nhập",
    },
  }
}

const LoginPage = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  })
  const { login, user } = useUser()

  const [loginErrorMessage, setLoginErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      if (showToast) {
        setTimeout(() => {
          router.push("/")
        }, 1000)
      } else {
        router.push("/")
      }
    } else {
      setLoading(false) // Nếu chưa đăng nhập, dừng loading
    }
  }, [user, router])

  const handleLoginSubmit = async (data) => {
    try {
      const response = await loginUser(data)
      login(response.data)
      setSuccessMessage("Đăng nhập thành công!")
      setShowToast(true)
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (error) {
      setLoginErrorMessage(
        error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      )
      setSuccessMessage("")
    }
  }

  // Hiển thị spinner trong khi đang kiểm tra trạng thái đăng nhập
  if (loading) {
    return (
      <Container className="py-6 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  if (user && !showToast) {
    // Nếu user đã đăng nhập, không render nội dung login
    return null // Không render gì cả, sẽ chuyển hướng ở trên
  } else {
    // Nếu user chưa đăng nhập, render nội dung đăng nhập
    return (
      <Container className="py-6">
        <Row className="justify-content-center">
          <Col md={6} className="bg-white rounded p-5 shadow">
            <h2 className="text-center mb-4">Đăng nhập</h2>
            {loginErrorMessage && (
              <div className="text-danger mb-3">{loginErrorMessage}</div>
            )}
            {successMessage && (
              <div className="text-success mb-3">{successMessage}</div>
            )}

            <Form onSubmit={handleSubmit(handleLoginSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </Form.Group>
              <Button variant="outline-dark w-100" type="submit">
                <FontAwesomeIcon icon={faUbuntu} className="me-2" /> Đăng nhập
              </Button>
            </Form>

            <hr className="my-3" data-content="HOẶC" />
            <div className="text-center">
              <Button variant="outline-primary" className="me-1">
                <FontAwesomeIcon icon={faGoogle} className="fa-fw" /> Đăng nhập
                với Google
              </Button>
            </div>

            <Row className="mt-3">
              <Col className="text-start">
                <Button
                  variant="link"
                  onClick={() => router.push("/account/register")}
                >
                  Đăng ký
                </Button>
              </Col>
              <Col className="text-end">
                <Button
                  variant="link"
                  onClick={() => router.push("/account/forgot")}
                >
                  Quên mật khẩu?
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1050,
          }}
        >
          <Toast.Body>{successMessage}</Toast.Body>
        </Toast>
      </Container>
    )
  }
}

export default LoginPage
