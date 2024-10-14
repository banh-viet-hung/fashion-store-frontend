import { faUser } from "@fortawesome/free-regular-svg-icons"
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import {
  Button,
  Modal,
  Nav,
  Row,
  Col,
  Form,
  Tab,
  CloseButton,
  Spinner, // Import Spinner
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
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login") // Trạng thái tab
  const [loading, setLoading] = useState(false) // Thêm trạng thái loading

  const onSubmitRegister = async (data) => {
    try {
      await registerUser(data)
      console.log("User registered successfully")
      props.toggle()
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
    setLoading(true) // Bắt đầu loading
    try {
      const response = await checkEmail(data.forgotEmail)
      console.log("Check email response:", response)
      if (response.success) {
        // Gọi API gửi email đặt lại mật khẩu
        await requestPasswordReset(data.forgotEmail)
        setShowSuccessModal(true)
        setErrorMessage("")
      } else {
        setErrorMessage(response.message)
      }
    } catch (error) {
      console.error("Error checking email:", error)
      setErrorMessage("Có lỗi xảy ra trong quá trình kiểm tra email.")
    } finally {
      setLoading(false) // Kết thúc loading
    }
  }

  const handleCloseSuccessModal = (type) => {
    setShowSuccessModal(false)
    setIsForgotPassword(false)
    setActiveTab(type) // Đặt lại tab hoạt động
    setErrorMessage("") // Reset error message khi đóng modal
  }

  const handleTabSelect = (key) => {
    setActiveTab(key)
    setErrorMessage("") // Reset error message khi chuyển tab
  }

  return (
    <>
      {/* Modal cho Đăng nhập / Đăng ký */}
      {!showSuccessModal && (
        <Modal show={props.isOpen} onHide={props.toggle}>
          <CloseButton
            className="btn-close-absolute btn-close-lg"
            size="lg"
            onClick={props.toggle}
            type="button"
          />
          <Modal.Body className="p-5">
            {isForgotPassword ? (
              <>
                <Modal.Header>
                  <Modal.Title>Cấp lại mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form
                    onSubmit={handleSubmitForgot(handleForgotPasswordSubmit)}
                  >
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
                        <Spinner animation="border" size="sm" /> // Hiển thị spinner khi loading
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
              <Tab.Container
                activeKey={activeTab}
                onSelect={handleTabSelect} // Sử dụng hàm mới này
              >
                <Nav className="flex-row">
                  <Nav.Link
                    href="#"
                    className="nav-link-lg me-4"
                    eventKey="login"
                  >
                    Đăng nhập
                  </Nav.Link>
                  <Nav.Link
                    href="#"
                    className="nav-link-lg"
                    eventKey="register"
                  >
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
                          <FontAwesomeIcon
                            icon={faSignInAlt}
                            className="me-2"
                          />
                          Đăng nhập
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                  <Tab.Pane className="px-3" eventKey="register">
                    <p className="text-muted text-sm">
                      Bạn chưa có tài khoản? Vui lòng nhập thông tin vào biểu
                      mẫu bên dưới và nhấn vào nút "ĐĂNG KÝ".
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
                          <FontAwesomeIcon icon={faUser} className="me-2" />{" "}
                          Đăng ký
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            )}
          </Modal.Body>
        </Modal>
      )}

      {/* Modal thông báo thành công */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
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
            onClick={() => handleCloseSuccessModal("login")}
          >
            Đăng nhập
          </Button>
          <Button
            variant="primary"
            onClick={() => handleCloseSuccessModal("register")}
          >
            Đăng ký tài khoản mới
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalLogin
