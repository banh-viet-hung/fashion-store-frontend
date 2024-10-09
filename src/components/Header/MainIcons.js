import React from "react"
import Link from "next/link"

import { CartContext } from "../CartContext"

import SidebarCart from "../SidebarCart"
import ModalLogin from "../ModalLogin"
import SidebarRight from "../SidebarRight"

import Icon from "../Icon"
import { WishlistContext } from "../WishlistContext"

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
  return (
    <React.Fragment>
      <ul className={`list-inline mb-0 ${props.className}`}>
        <li className="list-inline-item me-3">
          <a
            className={`text-${
              props.light ? "light" : "dark"
            } text-hover-primary`}
            href="#"
            aria-label="open login modal"
            onClick={(e) => preventAnchor(e, () => toggleModal("login"))}
          >
            <Icon icon="avatar-1" className="navbar-icon" />
          </a>
        </li>
        <li className="list-inline-item me-3">
          <Link href="/wishlist">
            <a
              className={`text-${
                props.light ? "light" : "dark"
              } text-hover-primary position-relative`}
              aria-label="go to whishlist"
            >
              <Icon icon="heart-1" className="navbar-icon" />
              <div className="navbar-icon-badge">{wishlistContext.length}</div>
            </a>
          </Link>
        </li>
        <li className="list-inline-item position-relative me-3">
          <a
            className={`text-${
              props.light ? "light" : "dark"
            } text-hover-primary`}
            href="#"
            aria-label="show cart"
            onClick={(e) => preventAnchor(e, () => toggleModal("sidebarCart"))}
          >
            <Icon icon="retail-bag-1" className="navbar-icon" />
            <div className="navbar-icon-badge">{cartContext.length}</div>
          </a>
        </li>
      </ul>
      {/* Modal của Icon người dùng */}
      <ModalLogin toggle={() => toggleModal("login")} isOpen={modal.login} />
      {/* Sidebar của giỏ hàng */}
      <SidebarCart
        toggle={() => toggleModal("sidebarCart")}
        isOpen={modal.sidebarCart}
      />
    </React.Fragment>
  )
}

export default MainIcons
