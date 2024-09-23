import { faFacebookF, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Col, Container, Row } from "react-bootstrap"
import Icon from "../Icon"

const TopBar = ({ header }) => {
  return (
    <div
      className={`top-bar text-sm ${
        header && header.transparentBar ? "bg-transparent" : ""
      }`}
    >
      <Container className="px-lg-5 py-3" fluid>
        <Row className="align-items-center">
          {/* SOCIAL & PHONE BLOCK */}
          <Col md="4" className="d-none d-md-block">
            <ul className="list-inline mb-0">
              <li className="list-inline-item me-2">
                <a
                  className="text-reset text-hover-primary"
                  href="https://www.facebook.com/viethungprofile.personal"
                  target="_blank" // // Mở liên kết trong tab mới
                  rel="noopener noreferrer"  // Bảo mật khi mở tab mới
                  aria-label="Go to Facebook"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
              </li>
              <li className="list-inline-item me-4">
                <a
                  className="text-reset text-hover-primary"
                  href="https://www.youtube.com/watch?v=ttcXp47r8Kg"
                  target="_blank"  // Mở liên kết trong tab mới
                  rel="noopener noreferrer"  // Bảo mật khi mở tab mới
                  aria-label="Go to Youtube"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </li>
              <li className="list-inline-item me-2">
                <Icon icon="calls-1" className="me-2" />
                037.259.0536
              </li>
            </ul>
          </Col>
          {/* END SOCIAL & PHONE BLOCK */}

          {/* ANNOUNCEMENT OR SILOGAN */}
          <Col md="4" sm="6" className="text-start text-md-center">
            <p className="mb-0">"Thời trang của bạn, cá tính của bạn."</p>
          </Col>
          {/* END ANNOUNCEMENT */}

        </Row>
      </Container>
    </div>
  )
}

export default TopBar
