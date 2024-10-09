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
  Tooltip,
  Tab,
  OverlayTrigger,
  CloseButton,
} from "react-bootstrap"
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { registerUser } from "../api/UserAPI"

// Định nghĩa schema với Yup
const schema = yup.object().shape({
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

const ModalLogin = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const [errorMessage, setErrorMessage] = useState("") // State để lưu thông báo lỗi

  const onSubmit = async (data) => {
    try {
      await registerUser(data)
      console.log("User registered successfully")
      props.toggle()
    } catch (error) {
      console.log("Error response:", error.response)
      if (error.response && error.response.data) {
        // Lấy thông điệp lỗi từ backend
        const backendMessage = error.response.data.message
        setErrorMessage(backendMessage) // Hiển thị thông điệp lỗi
      } else {
        setErrorMessage("Có lỗi xảy ra trong quá trình đăng ký")
      }
      console.error("Registration error:", error)
    }
  }

  return (
    <Modal show={props.isOpen} onHide={props.toggle}>
      <CloseButton
        className="btn-close-absolute btn-close-lg"
        size="lg"
        onClick={props.toggle}
        type="button"
      />
      <Modal.Body className="p-5">
        <Tab.Container defaultActiveKey="login">
          <Nav className="flex-row">
            <Nav.Link href="#" className="nav-link-lg me-4" eventKey="login">
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
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control id="email" type="text" />
                </div>
                <div className="mb-4">
                  <Row>
                    <Col>
                      <Form.Label htmlFor="loginPassword">Mật khẩu</Form.Label>
                    </Col>
                    <Col xs="auto">
                      <Form.Text className="small text-primary" href="#" as="a">
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
                    <FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Đăng
                    nhập
                  </Button>
                </div>
              </Form>
              <hr className="my-3 hr-text letter-spacing-2" data-content="OR" />
              <div className="text-center">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Đăng nhập với Facebook</Tooltip>}
                >
                  <Button
                    variant="outline-primary"
                    className="letter-spacing-0 me-1"
                  >
                    <FontAwesomeIcon icon={faFacebookF} className="fa-fw" />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Đăng nhập với Google</Tooltip>}
                >
                  <Button variant="outline-muted" className="letter-spacing-0">
                    <FontAwesomeIcon icon={faGoogle} className="fa-fw" />
                  </Button>
                </OverlayTrigger>
              </div>
            </Tab.Pane>
            <Tab.Pane className="px-3" eventKey="register">
              <p className="text-muted text-sm">
                Bạn chưa có tài khoản? Vui lòng nhập thông tin vào biểu mẫu bên
                dưới và nhấn vào nút "ĐĂNG KÝ".
              </p>
              {errorMessage && (
                <div className="text-danger mb-3">
                  {errorMessage.split(", ").map((msg, index) => (
                    <div key={index}>{msg}</div>
                  ))}
                </div>
              )}
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <Form.Label htmlFor="fullName">Tên của bạn</Form.Label>
                  <Form.Control
                    id="fullName"
                    type="text"
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-danger">{errors.fullName.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Form.Label htmlFor="email">Email của bạn</Form.Label>
                  <Form.Control id="email" type="text" {...register("email")} />
                  {errors.email && (
                    <p className="text-danger">{errors.email.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Form.Label htmlFor="password">Mật khẩu</Form.Label>
                  <Form.Control
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-danger">{errors.password.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <Form.Label htmlFor="confirmPassword">
                    Nhập lại mật khẩu
                  </Form.Label>
                  <Form.Control
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-danger">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <div className="text-center mb-4">
                  <Button
                    variant="outline-dark"
                    className="w-100"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Đăng ký
                  </Button>
                </div>
              </Form>
              <hr className="my-3 hr-text letter-spacing-2" data-content="OR" />
              <div className="text-center">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Đăng nhập với Facebook</Tooltip>}
                >
                  <Button
                    variant="outline-primary"
                    className="letter-spacing-0 me-1"
                  >
                    <FontAwesomeIcon icon={faFacebookF} className="fa-fw" />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Đăng nhập với Google</Tooltip>}
                >
                  <Button variant="outline-muted" className="letter-spacing-0">
                    <FontAwesomeIcon icon={faGoogle} className="fa-fw" />
                  </Button>
                </OverlayTrigger>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  )
}

export default ModalLogin
