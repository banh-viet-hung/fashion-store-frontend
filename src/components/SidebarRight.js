import { faFacebookF, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Modal, Nav, CloseButton, Toast } from "react-bootstrap"
import Icon from "./Icon"
import { useUser } from "./UserContext"
import { useRouter } from "next/router"

const SidebarRight = (props) => {
  const router = useRouter()
  const headerClose = (
    <CloseButton
      className="btn-close-lg btn-close-rotate"
      type="button"
      onClick={props.toggle}
    />
  )

  const { user, logout } = useUser()
  const [showToast, setShowToast] = React.useState(false)

  const handleLogout = () => {
    logout()
    setShowToast(true)
    props.toggle()
  }

  return (
    <>
      <Modal className="modal-right" show={props.isOpen} onHide={props.toggle}>
        <Modal.Header className="border-0">{headerClose}</Modal.Header>
        <Modal.Body className="px-5 pb-5">
          <div>
            <h5 className="mb-5" data-aos="zoom-in" data-aos-delay="50">
              Chào mừng, {user && user.email ? user.email.split("@")[0] : ""}!
            </h5>
            <Nav className="flex-column mb-5">
              {[
                "/account/info",
                "/account/user-address",
                "/order/tracking",
                "/account/orders",
              ].map((path, index) => (
                <Nav.Item key={index}>
                  <Nav.Link className="ps-0" onClick={() => router.push(path)}>
                    {
                      [
                        "Thông tin tài khoản",
                        "Địa chỉ",
                        "Theo dõi đơn hàng",
                        "Lịch sử đơn hàng",
                      ][index]
                    }
                  </Nav.Link>
                </Nav.Item>
              ))}
              <hr className="my-3" />
              <Nav.Item>
                <Nav.Link className="ps-0" onClick={handleLogout}>
                  Đăng xuất
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <ul className="list-inline mb-4">
              <li className="list-inline-item me-2">
                <a
                  className="text-reset text-hover-primary"
                  href="https://www.facebook.com/viethungprofile.personal"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Go to Facebook"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
              </li>
              <li className="list-inline-item me-2">
                <a
                  className="text-reset text-hover-primary"
                  href="https://www.youtube.com/watch?v=ttcXp47r8Kg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Go to Youtube"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </li>
              <li className="list-inline-item me-2">
                <Icon className="me-2" icon="calls-1" />
                037-2590-536
              </li>
            </ul>
            <p className="text-sm text-muted mb-0">
              Địa chỉ: Trường Đại học Sư phạm kỹ thuật TP.HCM.
              <br />
              Email: banhviet.hung123@gmail.com
              <br />
              Chịu trách nhiệm quản lý nội dung: Bành Viết Hùng
            </p>
          </div>
        </Modal.Body>
      </Modal>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000000,
        }}
      >
        <Toast.Body>Đăng xuất thành công!</Toast.Body>
      </Toast>
    </>
  )
}

export default SidebarRight
