import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { resetPassword } from "../../../api/UserAPI"
import Head from "next/head"
import { useRouter } from "next/router"

// Định nghĩa schema với Yup
const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu không được để trống"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Mật khẩu không khớp")
    .required("Bạn phải xác nhận mật khẩu"),
})

const ResetPassword = ({ token }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  })

  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(7) // Thời gian đếm ngược
  const router = useRouter()

  const handleSubmitForm = async (data) => {
    setLoading(true)
    try {
      await resetPassword(token, {
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })
      setSuccessMessage(
        "Thay đổi mật khẩu thành công.\nBạn có thể sử dụng mật khẩu mới để đăng nhập."
      )
      setErrorMessage("")
    } catch (error) {
      console.error("Error resetting password:", error)
      setErrorMessage("Có lỗi xảy ra trong quá trình đặt lại mật khẩu.")
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Tự động chuyển hướng sau 7 giây và đếm ngược
  useEffect(() => {
    if (successMessage) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push("/")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [successMessage, router])

  return (
    <>
      <Head>
        <title>Đặt lại mật khẩu</title>
      </Head>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md="6">
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="text-center mb-4">Đặt lại mật khẩu</h2>
                <Form onSubmit={handleSubmit(handleSubmitForm)}>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label></Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      {...register("newPassword")}
                      isInvalid={!!errors.newPassword}
                      required
                    />
                    {errors.newPassword && (
                      <Form.Control.Feedback type="invalid">
                        {errors.newPassword.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group controlId="formBasicPasswordConfirm">
                    <Form.Label></Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      {...register("confirmPassword")}
                      isInvalid={!!errors.confirmPassword}
                      required
                    />
                    {errors.confirmPassword && (
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  {errorMessage && (
                    <Alert variant="danger" className="mt-3 text-center">
                      {errorMessage}
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert variant="success" className="mt-3 text-center">
                      <p>
                        {successMessage.split("\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                      <hr />
                      <p className="mb-0">
                        Bạn sẽ được chuyển hướng về trang chính trong{" "}
                        {countdown} giây.
                      </p>
                    </Alert>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-4 w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Đang xử lý...
                      </>
                    ) : (
                      "Đặt lại mật khẩu"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

// Lấy token từ URL
export const getServerSideProps = async (context) => {
  const { token } = context.params
  return {
    props: { token },
  }
}

export default ResetPassword
