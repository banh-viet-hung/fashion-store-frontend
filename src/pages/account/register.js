import React, { useState } from "react"
import { Container, Row, Col, Form, Button, Toast } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { registerUser } from "../../api/UserAPI" // Cập nhật đường dẫn cho đúng
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-regular-svg-icons"
import { useRouter } from "next/router" // Import useRouter

// Định nghĩa schema với Yup
const registerSchema = yup.object().shape({
  fullName: yup.string().required("Tên không được để trống"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu không được để trống"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Bạn phải xác nhận mật khẩu"),
})

export async function getStaticProps() {
  return {
    props: {
      title: "Đăng ký",
    },
  }
}

const RegisterPage = () => {
  const router = useRouter() // Khởi tạo router
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  })

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showToast, setShowToast] = useState(false)

  const onSubmitRegister = async (data) => {
    try {
      await registerUser(data)
      setSuccessMessage("Đăng ký thành công!")
      setErrorMessage("")
      setShowToast(true)
    } catch (error) {
      console.error("Registration error:", error)
      setErrorMessage(
        error.response?.data?.message || "Có lỗi xảy ra trong quá trình đăng ký"
      )
      setSuccessMessage("")
    }
  }

  return (
    <Container className="py-6">
      <Row className="justify-content-center">
        <Col md={6} className="bg-white rounded p-5 shadow">
          <h2 className="text-center mb-4">Đăng ký</h2>
          {errorMessage && (
            <div className="text-danger mb-3">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-success mb-3">{successMessage}</div>
          )}
          <Form onSubmit={handleSubmit(onSubmitRegister)}>
            <Form.Group className="mb-4">
              <Form.Label htmlFor="fullName">Tên của bạn</Form.Label>
              <Form.Control
                id="fullName"
                type="text"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-danger">{errors.fullName.message}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label htmlFor="email">Email của bạn</Form.Label>
              <Form.Control id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-danger">{errors.email.message}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label htmlFor="password">Mật khẩu</Form.Label>
              <Form.Control
                id="password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label htmlFor="confirmPassword">
                Nhập lại mật khẩu
              </Form.Label>
              <Form.Control
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-danger">{errors.confirmPassword.message}</p>
              )}
            </Form.Group>
            <Button variant="outline-dark w-100" type="submit">
              <FontAwesomeIcon icon={faUser} className="me-2" /> Đăng ký
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Button variant="link" onClick={() => router.push("/account/login")}>
              ĐĂNG NHẬP NGAY
            </Button>
          </div>
        </Col>
      </Row>

      {/* Toast thông báo thành công */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1050 }}
      >
        <Toast.Body>{successMessage}</Toast.Body>
      </Toast>
    </Container>
  )
}

export default RegisterPage
