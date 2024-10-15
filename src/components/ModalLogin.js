import { faUser } from "@fortawesome/free-regular-svg-icons"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState, useEffect } from "react"
import {
  Button,
  Modal,
  Nav,
  Row,
  Col,
  Form,
  Tab,
  Spinner,
} from "react-bootstrap"
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { registerUser, checkEmail, requestPasswordReset } from "../api/UserAPI"

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

const forgotPasswordSchema = yup.object().shape({
  forgotEmail: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
})

const ModalLogin = (props) => {
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  })

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  })

  const [errorMessage, setErrorMessage] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showResetSuccessModal, setShowResetSuccessModal] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [loading, setLoading] = useState(false)

  const onSubmitRegister = async (data) => {
    try {
      await registerUser(data)
      setShowSuccessModal(true)
      setErrorMessage("")
    } catch (error) {
      console.log("Error response:", error.response)
      if (error.response && error.response.data) {
        const backendMessage = error.response.data.message
        setErrorMessage(backendMessage)
      } else {
        setErrorMessage("Có lỗi xảy ra trong quá trình đăng ký")
      }
      console.error("Registration error:", error)
    }
  }

  const handleForgotPasswordSubmit = async (data) => {
    console.log("Submitting forgot password form with email:", data.forgotEmail)
    setLoading(true)
    try {
      const response = await checkEmail(data.forgotEmail)
      console.log("Check email response:", response)
      if (response.success) {
        await requestPasswordReset(data.forgotEmail)
        setShowResetSuccessModal(true) // Hiển thị modal thông báo thành công
        props.toggle() // Đóng modal chính trước khi mở modal mới
      } else {
        setErrorMessage(response.message)
      }
    } catch (error) {
      console.error("Error checking email:", error)
      setErrorMessage("Có lỗi xảy ra trong quá trình kiểm tra email.")
    } finally {
      setLoading(false)
    }
  }

  const handleTabSelect = (key) => {
    setActiveTab(key)
    setErrorMessage("")
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
  }

  const handleCloseResetSuccessModal = () => {
    setShowResetSuccessModal(false)
    props.toggle() // Để đóng modal chính
  }

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessModal])

  return (
    <>
      {/* Modal cho Đăng nhập / Đăng ký */}
      <Modal show={props.isOpen} onHide={props.toggle} centered>
        <Modal.Body className="p-5">
          {isForgotPassword ? (
            <>
              <Modal.Header>
                <Modal.Title>Cấp lại mật khẩu</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmitForgot(handleForgotPasswordSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email của bạn</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Nhập email"
                      {...registerForgot("forgotEmail")}
                    />
                    {forgotErrors.forgotEmail && (
                      <p className="text-danger">
                        {forgotErrors.forgotEmail.message}
                      </p>
                    )}
                  </Form.Group>
                  {errorMessage && (
                    <p className="text-danger">{errorMessage}</p>
                  )}
                  <Button variant="primary" type="submit" className="w-100">
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Kiểm tra"
                    )}
                  </Button>
                  <div className="text-center mt-3">
                    <Button
                      variant="link"
                      onClick={() => setIsForgotPassword(false)}
                    >
                      Quay lại
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </>
          ) : (
            <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
              <Nav className="flex-row">
                <Nav.Link
                  href="#"
                  className="nav-link-lg me-4"
                  eventKey="login"
                >
                  Đăng nhập
                </Nav.Link>
                <Nav.Link href="#" className="nav-link-lg" eventKey="register">
                  Đăng ký
                </Nav.Link>
              </Nav>
              <hr className="mb-3" />
              <Tab.Content>
                <Tab.Pane className="px-3" eventKey="login">
                  <Form>
                    <div className="mb-4">
                      <Form.Label htmlFor="loginEmail">Email</Form.Label>
                      <Form.Control id="loginEmail" type="text" />
                    </div>
                    <div className="mb-4">
                      <Row>
                        <Col>
                          <Form.Label htmlFor="loginPassword">
                            Mật khẩu
                          </Form.Label>
                        </Col>
                        <Col xs="auto">
                          <Form.Text
                            className="small text-primary"
                            onClick={() => setIsForgotPassword(true)}
                            style={{ cursor: "pointer" }}
                          >
                            Quên mật khẩu?
                          </Form.Text>
                        </Col>
                      </Row>
                      <Form.Control
                        name="loginPassword"
                        id="loginPassword"
                        placeholder="Mật khẩu"
                        type="password"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <Form.Check
                        type="checkbox"
                        id="loginRemember"
                        label={
                          <span className="text-sm text-muted">
                            Ghi nhớ mật khẩu
                          </span>
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <Button variant="outline-dark w-100">
                        <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                        Đăng nhập
                      </Button>
                    </div>
                    <div className="mb-4">
                      <Button variant="outline-danger w-100">
                        <FontAwesomeIcon icon={faGoogle} className="me-2" />
                        Đăng nhập với Google
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>
                <Tab.Pane className="px-3" eventKey="register">
                  <p className="text-muted text-sm">
                    Bạn chưa có tài khoản? Vui lòng nhập thông tin vào biểu mẫu
                    bên dưới và nhấn vào nút "ĐĂNG KÝ".
                  </p>
                  {errorMessage && (
                    <div className="text-danger mb-3">
                      {errorMessage.split(", ").map((msg, index) => (
                        <div key={index}>{msg}</div>
                      ))}
                    </div>
                  )}
                  <Form onSubmit={handleSubmitRegister(onSubmitRegister)}>
                    <div className="mb-4">
                      <Form.Label htmlFor="fullName">Tên của bạn</Form.Label>
                      <Form.Control
                        id="fullName"
                        type="text"
                        {...registerRegister("fullName")}
                      />
                      {registerErrors.fullName && (
                        <p className="text-danger">
                          {registerErrors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Form.Label htmlFor="email">Email của bạn</Form.Label>
                      <Form.Control
                        id="email"
                        type="text"
                        {...registerRegister("email")}
                      />
                      {registerErrors.email && (
                        <p className="text-danger">
                          {registerErrors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Form.Label htmlFor="password">Mật khẩu</Form.Label>
                      <Form.Control
                        id="password"
                        type="password"
                        {...registerRegister("password")}
                      />
                      {registerErrors.password && (
                        <p className="text-danger">
                          {registerErrors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Form.Label htmlFor="confirmPassword">
                        Nhập lại mật khẩu
                      </Form.Label>
                      <Form.Control
                        id="confirmPassword"
                        type="password"
                        {...registerRegister("confirmPassword")}
                      />
                      {registerErrors.confirmPassword && (
                        <p className="text-danger">
                          {registerErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                    <div className="text-center mb-4">
                      <Button
                        variant="outline-dark"
                        className="w-100"
                        type="submit"
                      >
                        <FontAwesomeIcon icon={faUser} className="me-2" /> Đăng
                        ký
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal thông báo thành công cho yêu cầu cấp lại mật khẩu */}
      <Modal show={showResetSuccessModal} onHide={handleCloseResetSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Yêu Cầu Thành Công</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="mb-4">
            Vui lòng kiểm tra email để thực hiện thay đổi mật khẩu.
            <br />
            Nếu không tìm thấy, vui lòng kiểm tra mục <strong>"Spam"</strong>.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleCloseResetSuccessModal() // Đóng modal thông báo
              setIsForgotPassword(false) // Quay lại tab đăng nhập
              setActiveTab("login") // Chuyển đến tab đăng nhập
            }}
          >
            Đăng nhập
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleCloseResetSuccessModal() // Đóng modal thông báo
              setIsForgotPassword(false) // Để không ở trạng thái quên mật khẩu
              setActiveTab("register") // Chuyển đến tab đăng ký
            }}
          >
            Đăng ký tài khoản mới
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSuccessModal}
        onHide={handleCloseSuccessModal}
        size="md"
        style={{ transform: "translateX(-9px)" }} // Dịch modal sang phải 20px
      >
        <Modal.Header className="bg-success text-white" closeButton>
          <Modal.Title>Đăng Ký Thành Công</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="mb-4" style={{ color: "green" }}>
            Bạn đã đăng ký tài khoản thành công.
            <br />
            Đăng nhập ngay để trải nghiệm dịch vụ mua sắm online cùng COOLMAN
            <span style={{ color: "red", marginLeft: "5px" }}>❤️</span>
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="success" onClick={handleCloseSuccessModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalLogin
