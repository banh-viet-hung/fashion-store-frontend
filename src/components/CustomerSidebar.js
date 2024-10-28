import React, { useState, useContext } from "react"
import { Badge, ListGroup, Toast } from "react-bootstrap"
import { WishlistContext } from "../components/WishlistContext"
import Icon from "../components/Icon"
import ActiveLink from "./ActiveLink"
import Image from "./Image"
import { useUser } from "./UserContext" // Đảm bảo import useUser

const CustomerSidebar = () => {
  const [wishlistItems, dispatch] = useContext(WishlistContext)
  const { logout } = useUser() // Lấy hàm logout từ UserContext
  const [showToast, setShowToast] = useState(false) // State quản lý thông báo

  const handleLogout = () => {
    logout() // Gọi hàm logout
    setShowToast(true) // Hiển thị thông báo khi đăng xuất
  }

  return (
    <div className="customer-sidebar card border-0">
      <div className="customer-profile">
        <a className="d-inline-block" href="#">
          <Image
            className="img-fluid rounded-circle customer-image"
            src="/img/avatar/avatar-0.jpg"
            alt=""
            width={144}
            height={144}
          />
        </a>
        <h5>Jane Doe</h5>
        <p className="text-muted text-sm mb-0">Los Angeles, CA</p>
      </div>
      <ListGroup className="customer-nav">
        <ActiveLink href="/account/orders" activeClassName="active" passHref>
          <ListGroup.Item
            as="a"
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <Icon icon="paper-bag-1" className="svg-icon-heavy me-2" />
              Lịch sử đơn hàng
            </span>
            <Badge pill className="fw-normal px-3" bg="light" text="dark">
              5
            </Badge>
          </ListGroup.Item>
        </ActiveLink>
        <ActiveLink href="/account/info" activeClassName="active" passHref>
          <ListGroup.Item
            as="a"
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <Icon icon="male-user-1" className="svg-icon-heavy me-2" />
              Thông tin tài khoản
            </span>
          </ListGroup.Item>
        </ActiveLink>
        <ActiveLink
          href="/account/user-address"
          activeClassName="active"
          passHref
        >
          <ListGroup.Item
            as="a"
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <Icon icon="real-estate-1" className="svg-icon-heavy me-2" />
              Địa chỉ
            </span>
          </ListGroup.Item>
        </ActiveLink>
        <ActiveLink href="/account/wishlist" activeClassName="active" passHref>
          <ListGroup.Item
            as="a"
            className="d-flex justify-content-between align-items-center"
          >
            <span>
              <Icon icon="heart-1" className="svg-icon-heavy me-2" />
              Yêu thích
            </span>
            <Badge pill className="fw-normal px-3" bg="light" text="dark">
              {wishlistItems.length}
            </Badge>
          </ListGroup.Item>
        </ActiveLink>
        <ListGroup.Item
          as="a"
          className="d-flex justify-content-between align-items-center"
          onClick={handleLogout}
          style={{ cursor: "pointer" }} // Thêm style để chỉ ra rằng đây là nút nhấn
        >
          <span>
            <Icon icon="exit-1" className="svg-icon-heavy me-2" />
            Đăng xuất
          </span>
        </ListGroup.Item>
      </ListGroup>

      {/* Thông báo khi đăng xuất */}
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
    </div>
  )
}

export default CustomerSidebar
