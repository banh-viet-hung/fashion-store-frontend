import { faFacebookF, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

import { Modal, Nav, Collapse, CloseButton } from "react-bootstrap"

import Icon from "./Icon"

const SidebarRight = (props) => {
  const headerClose = (
    <CloseButton
      className="btn-close-lg btn-close-rotate"
      type="button"
      onClick={props.toggle}
    />
  )

  const [dropdown, setDropdown] = React.useState(false)
  return (
    <Modal className="modal-right" show={props.isOpen} onHide={props.toggle}>
      <Modal.Header className="border-0">{headerClose}</Modal.Header>
      <Modal.Body className="px-5 pb-5">
        <div>
          <h5 className="mb-5" data-aos="zoom-in" data-aos-delay="50">
            Coolman
          </h5>
          <Nav className="flex-column mb-5">
            <Nav.Item active>
              <Nav.Link className="ps-0" href="#">
                Trang chủ
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="ps-0" href="#">
                Link
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="ps-0" href="#" disabled>
                Disabled
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="drodpown">
              <Nav.Link
                className="ps-0 dropdown-toggle"
                onClick={() => setDropdown(!dropdown)}
                href="#"
                aria-expanded={dropdown}
              >
                Dropdown link
              </Nav.Link>
              <Collapse in={dropdown} className="flex-column ms-3">
                <Nav className="flex-column ms-3">
                  <Nav.Item>
                    <Nav.Link className="ps-0" href="#">
                      Action
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link className="ps-0" href="#">
                      Another action
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link className="ps-0" href="#">
                      Something else here
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Collapse>
            </Nav.Item>
          </Nav>
          <ul className="list-inline mb-4">
            <li className="list-inline-item me-2">
              <a
                className="text-reset text-hover-primary"
                href="https://www.facebook.com/viethungprofile.personal"
                target="_blank" // // Mở liên kết trong tab mới
                rel="noopener noreferrer" // Bảo mật khi mở tab mới
                aria-label="Go to Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
            </li>
            <li className="list-inline-item me-2">
              <a
                className="text-reset text-hover-primary"
                href="https://www.youtube.com/watch?v=ttcXp47r8Kg"
                target="_blank" // Mở liên kết trong tab mới
                rel="noopener noreferrer" // Bảo mật khi mở tab mới
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
  )
}

export default SidebarRight
