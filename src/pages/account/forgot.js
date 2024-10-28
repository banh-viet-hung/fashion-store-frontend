import { useState } from "react"
import { Button, Form, Container, Row, Col } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { checkEmail, requestPasswordReset } from "../../api/UserAPI"
import { useRouter } from "next/router" // Import useRouter

// Định nghĩa schema với Yup cho quên mật khẩu
const forgotPasswordSchema = yup.object().shape({
  forgotEmail: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
})

export async function getStaticProps() {
  return {
    props: {
      title: "Quên mật khẩu",
    },
  }
}

const ForgotPasswordForm = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  })

  const router = useRouter() // Khởi tạo router
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleForgotPasswordSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await checkEmail(data.forgotEmail)
      if (response.success) {
        await requestPasswordReset(data.forgotEmail)
        setSuccessMessage(
          "Yêu cầu cấp lại mật khẩu đã được gửi! Vui lòng kiểm tra email để xác nhận"
        )
        setErrorMessage("")
        if (onSuccess) onSuccess() // Callback để xử lý thành công
      } else {
        setErrorMessage(response.message)
        setSuccessMessage("")
      }
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra trong quá trình kiểm tra email.")
      setSuccessMessage("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-6">
      <Row className="justify-content-center">
        <Col md={6} className="bg-white rounded p-5 shadow">
          <h2 className="text-center mb-4">Quên mật khẩu</h2>
          {errorMessage && (
            <div className="text-danger mb-3">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-success mb-3">{successMessage}</div>
          )}
          <Form onSubmit={handleSubmit(handleForgotPasswordSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email của bạn</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                {...register("forgotEmail")}
              />
              {errors.forgotEmail && (
                <p className="text-danger">{errors.forgotEmail.message}</p>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              {loading ? "Đang xử lý..." : "Kiểm tra"}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Button
              variant="link"
              onClick={() => router.push("/account/login")}
            >
              ĐĂNG NHẬP NGAY
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default ForgotPasswordForm
