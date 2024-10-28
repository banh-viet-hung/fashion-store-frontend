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
  CloseButton,
  Toast,
} from "react-bootstrap"
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { registerUser, checkEmail, requestPasswordReset } from "../api/UserAPI"
import { loginUser } from "../api/AuthAPI"
import { useUser } from "./UserContext"

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

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  })

  const [errorMessage, setErrorMessage] = useState("")
  const [loginErrorMessage, setLoginErrorMessage] = useState("")
  const [forgotPasswordErrorMessage, setForgotPasswordErrorMessage] =
    useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showResetSuccessModal, setShowResetSuccessModal] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState("")
  const [showToast, setShowToast] = useState(false)
  const { login } = useUser()

  const onSubmitRegister = async (data) => {
    try {
      await registerUser(data)
      setRegisterSuccessMessage("Đăng ký thành công!")
      setErrorMessage("")
    } catch (error) {
      console.error("Registration error:", error)
      setErrorMessage(
        error.response?.data?.message || "Có lỗi xảy ra trong quá trình đăng ký"
      )
      setRegisterSuccessMessage("")
    }
  }

  const handleForgotPasswordSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await checkEmail(data.forgotEmail)
      if (response.success) {
        await requestPasswordReset(data.forgotEmail)
        setShowResetSuccessModal(true)
        props.toggle()
      } else {
        setForgotPasswordErrorMessage(response.message)
      }
    } catch (error) {
      setForgotPasswordErrorMessage(
        "Có lỗi xảy ra trong quá trình kiểm tra email."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSubmit = async (data) => {
    try {
      const response = await loginUser(data)
      login(response.data)
      setLoginErrorMessage("")
      setSuccessMessage("Đăng nhập thành công!")
      props.toggle() // Ẩn modal
      setShowToast(true) // Hiện thông báo thành công
    } catch (error) {
      setLoginErrorMessage(
        error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      )
      setSuccessMessage("")
    }
  }

  const handleTabSelect = (key) => {
    setActiveTab(key)
    setErrorMessage("")
    setLoginErrorMessage("")
    setForgotPasswordErrorMessage("")
  }

  const handleCloseResetSuccessModal = () => {
    setShowResetSuccessModal(false)
    props.toggle()
  }

  const handleFocus = () => {
    setErrorMessage("")
    setLoginErrorMessage("")
    setForgotPasswordErrorMessage("")
    setRegisterSuccessMessage("")
    setSuccessMessage("")
  }

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessModal])

  return (
    <>
      <Modal show={props.isOpen} onHide={props.toggle} centered>
        <CloseButton
          className="btn-close-absolute btn-close-lg"
          size="lg"
          onClick={props.toggle}
        />
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
                  {forgotPasswordErrorMessage && (
                    <p className="text-danger">{forgotPasswordErrorMessage}</p>
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
                  {loginErrorMessage && (
                    <div className="text-danger mb-3">{loginErrorMessage}</div>
                  )}
                  {successMessage && (
                    <div className="text-success mb-3">{successMessage}</div>
                  )}
                  <Form onSubmit={handleSubmitLogin(handleLoginSubmit)}>
                    <div className="mb-4">
                      <Form.Label htmlFor="email">Email</Form.Label>
                      <Form.Control
                        id="email"
                        type="email"
                        {...registerLogin("email")}
                        onFocus={handleFocus}
                      />
                      {loginErrors.email && (
                        <p className="text-danger">
                          {loginErrors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Row>
                        <Col>
                          <Form.Label htmlFor="password">Mật khẩu</Form.Label>
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
                        id="password"
                        type="password"
                        {...registerLogin("password")}
                        onFocus={handleFocus}
                      />
                      {loginErrors.password && (
                        <p className="text-danger">
                          {loginErrors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Form.Check
                        type="checkbox"
                        id="loginRemember"
                        label={
                          <span className="text-sm text-muted">
                            Ghi nhớ đăng nhập trong 30 ngày
                          </span>
                        }
                        {...registerLogin("rememberMe")}
                      />
                    </div>
                    <div className="mb-4">
                      <Button
                        variant="outline-dark w-100"
                        type="submit"
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faSignInAlt} className="me-2" />{" "}
                        Đăng nhập
                      </Button>
                    </div>
                  </Form>
                  <hr
                    className="my-3 hr-text letter-spacing-2"
                    data-content="HOẶC"
                  />
                  <div className="text-center">
                    <Button variant="outline-primary" className="me-1">
                      <FontAwesomeIcon icon={faGoogle} className="fa-fw" /> Đăng
                      nhập với Google
                    </Button>
                  </div>
                </Tab.Pane>
                <Tab.Pane className="px-3" eventKey="register">
                  <p className="text-muted text-sm">
                    Bạn chưa có tài khoản? Vui lòng nhập thông tin vào biểu mẫu
                    bên dưới và nhấn vào nút "ĐĂNG KÝ".
                  </p>
                  {registerSuccessMessage && (
                    <div className="text-success mb-3">
                      {registerSuccessMessage}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="text-danger mb-3">{errorMessage}</div>
                  )}
                  <Form onSubmit={handleSubmitRegister(onSubmitRegister)}>
                    <div className="mb-4">
                      <Form.Label htmlFor="fullName">Tên của bạn</Form.Label>
                      <Form.Control
                        id="fullName"
                        type="text"
                        {...registerRegister("fullName")}
                        onFocus={handleFocus}
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
                        onFocus={handleFocus}
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
                        onFocus={handleFocus}
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
                        onFocus={handleFocus}
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

      <Modal show={showResetSuccessModal} onHide={handleCloseResetSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Yêu Cầu Thành Công</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="mb-4">
            Vui lòng kiểm tra email để thực hiện thay đổi mật khẩu.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleCloseResetSuccessModal()
              setIsForgotPassword(false)
              setActiveTab("login")
            }}
          >
            Đăng nhập
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleCloseResetSuccessModal()
              setIsForgotPassword(false)
              setActiveTab("register")
            }}
          >
            Đăng ký tài khoản mới
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Toast thông báo thành công */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 99999,
        }}
      >
        <Toast.Body>{successMessage}</Toast.Body>
      </Toast>
    </>
  )
}

export default ModalLogin
