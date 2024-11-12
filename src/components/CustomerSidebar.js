import React, { useState, useContext, useEffect } from "react"
import {
  Badge,
  ListGroup,
  Toast,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap"
import { WishlistContext } from "../components/WishlistContext"
import Icon from "../components/Icon"
import ActiveLink from "./ActiveLink"
import Image from "./Image"
import { useUser } from "./UserContext"
import { getUserFromLocalStorage } from "../utils/authUtils"
import { getUserAvatarAndFullName, updateAvatar } from "../api/UserAPI"
import axios from "axios"

const CustomerSidebar = () => {
  const [wishlistItems] = useContext(WishlistContext)
  const { logout } = useUser()

  const [showToast, setShowToast] = useState(false)
  const [fullName, setFullName] = useState("")
  const [avatar, setAvatar] = useState("")
  const [email, setEmail] = useState("")
  const [isHover, setIsHover] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleLogout = () => {
    logout()
    setShowToast(true)
  }

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (userData) {
      const fetchUserInfo = async () => {
        const token = userData.token
        try {
          const { success, data, message } = await getUserAvatarAndFullName(
            token
          )
          if (success) {
            setFullName(data.fullName)
            setAvatar(data.avatar)
            setEmail(userData.email)
          } else {
            console.error("Failed to fetch user info:", message)
          }
        } catch (error) {
          console.error("Error fetching user info:", error)
        }
      }
      fetchUserInfo()
    }
  }, [])

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      alert("Vui lòng chọn file ảnh (JPG, PNG, GIF, WEBP).")
      return
    }

    const maxSizeInMB = 2
    if (file.size > maxSizeInMB * 1024 * 1024) {
      alert("Kích thước file phải nhỏ hơn 2MB.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "ml_default")

    setIsUploading(true)
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/doo4qviqi/image/upload`,
        formData
      )
      if (response.data) {
        const avatarUrl = response.data.secure_url
        const userData = getUserFromLocalStorage()
        await updateAvatar(userData.token, avatarUrl)
        setAvatar(avatarUrl)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="customer-sidebar card border-0">
      <div className="customer-profile">
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="avatar-tooltip">
              Nhấp vào đây để thay đổi avatar
            </Tooltip>
          }
        >
          <label
            className="d-inline-block"
            htmlFor="avatar-upload"
            style={{ position: "relative", cursor: "pointer" }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <Image
              className="img-fluid rounded-circle customer-image"
              src={
                avatar ||
                "https://res.cloudinary.com/doo4qviqi/image/upload/v1730703669/defaultavatar_uhpwxn.png"
              }
              alt=""
              width={144}
              height={144}
              style={{
                filter: isHover ? "brightness(0.7)" : "none",
                transition: "filter 0.2s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: isHover ? 1 : 0,
                transition: "opacity 0.2s ease",
              }}
            >
              <Icon
                icon="upload"
                className="upload-icon"
                style={{
                  fontSize: "24px",
                  color: "#007bff",
                  pointerEvents: "none",
                }}
              />
            </div>
          </label>
        </OverlayTrigger>
        <input
          id="avatar-upload"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleAvatarChange}
          style={{ display: "none" }}
        />
        <h5>{fullName || "Người dùng"}</h5>
        <p className="text-muted text-sm mb-0">{email}</p>
        {isUploading && <Spinner animation="border" size="sm" />}
      </div>
      <ListGroup className="customer-nav">
        {[
          {
            href: "/account/orders",
            icon: "paper-bag-1",
            text: "Lịch sử đơn hàng",
            badge: 5,
          },
          {
            href: "/account/info",
            icon: "male-user-1",
            text: "Thông tin tài khoản",
          },
          {
            href: "/account/user-address",
            icon: "real-estate-1",
            text: "Địa chỉ",
          },
          {
            href: "/account/wishlist",
            icon: "heart-1",
            text: "Yêu thích",
            badge: wishlistItems.length,
          },
        ].map(({ href, icon, text, badge }) => (
          <ActiveLink key={href} href={href} activeClassName="active" passHref>
            <ListGroup.Item
              as="a"
              className="d-flex justify-content-between align-items-center"
            >
              <span>
                <Icon icon={icon} className="svg-icon-heavy me-2" />
                {text}
              </span>
              {badge !== undefined && (
                <Badge pill className="fw-normal px-3" bg="light" text="dark">
                  {badge}
                </Badge>
              )}
            </ListGroup.Item>
          </ActiveLink>
        ))}
        <ListGroup.Item
          as="a"
          className="d-flex justify-content-between align-items-center"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <span>
            <Icon icon="exit-1" className="svg-icon-heavy me-2" />
            Đăng xuất
          </span>
        </ListGroup.Item>
      </ListGroup>

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
