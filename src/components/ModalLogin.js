import { faUser } from "@fortawesome/free-regular-svg-icons"
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
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

const ModalLogin = (props) => {
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
            <Nav.Link href="#" className={`nav-link-lg me-4`} eventKey="login">
              Đăng nhập
            </Nav.Link>
            <Nav.Link href="#" className={`nav-link-lg `} eventKey="register">
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
                    <FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Đăng nhập
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
                Bạn chưa có tài khoản? Vui lòng nhập thông tin vào biểu mẫu bên dưới và nhấn vào nút "ĐĂNG KÝ".{" "}
              </p>
              <Form>
                <div className="mb-4">
                  <Form.Label htmlFor="registerName">Tên của bạn</Form.Label>
                  <Form.Control id="registerName" type="text" />
                </div>
                <div className="mb-4">
                  <Form.Label htmlFor="registerEmail">Email của bạn</Form.Label>
                  <Form.Control id="registerEmail" type="text" />
                </div>
                <div className="mb-4">
                  <Form.Label htmlFor="registerPassword">Mật khẩu</Form.Label>
                  <Form.Control id="registerPassword" type="password" />
                </div>
                <div className="text-center mb-4">
                  <Button variant="outline-dark" className=" w-100">
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
