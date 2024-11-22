import React from "react"
import Link from "next/link"
import { CartContext } from "../CartContext"
import ModalLogin from "../ModalLogin"
import SidebarRight from "../SidebarRight"
import Icon from "../Icon"
import { WishlistContext } from "../WishlistContext"
import { useUser } from "../UserContext"

const MainIcons = (props) => {
  const [modal, setModal] = React.useState({})
  const toggleModal = (name) => {
    setModal({ ...modal, [name]: !modal[name] })
  }

  const preventAnchor = (e, func) => {
    e.preventDefault()
    func()
  }

  const [cartContext] = React.useContext(CartContext)
  const [wishlistContext] = React.useContext(WishlistContext)
  const { user } = useUser()

  return (
    <React.Fragment>
      <ul className={`list-inline mb-0 ${props.className}`}>
        <li className="list-inline-item me-3">
          <a
            className={`text-${
              props.light ? "light" : "dark"
            } text-hover-primary`}
            href="#"
            aria-label={user ? "open right sidebar" : "open login modal"}
            onClick={(e) =>
              preventAnchor(e, () => {
                if (user) {
                  toggleModal("sidebarRight")
                } else {
                  toggleModal("login")
                }
              })
            }
          >
            {user ? (
              <Icon icon="male-user-1" className="navbar-icon" />
            ) : (
              <Icon icon="avatar-1" className="navbar-icon" />
            )}
          </a>
        </li>
        <li className="list-inline-item me-3">
          <Link href="/wishlist">
            <a
              className={`text-${
                props.light ? "light" : "dark"
              } text-hover-primary position-relative`}
              aria-label="go to wishlist"
            >
              <Icon icon="heart-1" className="navbar-icon" />
              <div className="navbar-icon-badge">{wishlistContext.length}</div>
            </a>
          </Link>
        </li>
        <li className="list-inline-item position-relative me-3">
          {/* Thay đổi ở đây: Sử dụng Link thay vì onClick để điều hướng đến trang giỏ hàng */}
          <Link href="/cart">
            <a
              className={`text-${
                props.light ? "light" : "dark"
              } text-hover-primary`}
              aria-label="go to cart"
            >
              <Icon icon="retail-bag-1" className="navbar-icon" />
              <div className="navbar-icon-badge">{cartContext.length}</div>
            </a>
          </Link>
        </li>
        {props.sidebarRight && (
          <li className="list-inline-item">
            <a
              className={`text-${
                props.light ? "light" : "dark"
              } text-hover-primary`}
              href="#"
              onClick={(e) =>
                preventAnchor(e, () => toggleModal("sidebarRight"))
              }
              aria-label="open right sidebar"
            >
              <Icon className="navbar-icon" icon="menu-hamburger-1" />
            </a>
          </li>
        )}
      </ul>
      <ModalLogin toggle={() => toggleModal("login")} isOpen={modal.login} />
      <SidebarRight
        toggle={() => toggleModal("sidebarRight")}
        isOpen={modal.sidebarRight}
      />
    </React.Fragment>
  )
}

export default MainIcons
