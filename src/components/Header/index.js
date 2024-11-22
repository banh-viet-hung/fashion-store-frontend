import React, { useEffect } from "react"
import Router from "next/router"
import Link from "next/link"
import { Nav, Navbar, NavLink } from "react-bootstrap"
import menu from "../../data/menu.json"
import Icon from "../Icon"
import ActiveLink from "../ActiveLink"
import MainIcons from "./MainIcons"
import { CartContext } from "../CartContext"
import { WishlistContext } from "../WishlistContext" // Import WishlistContext
import TopBar from "./TopBar"
import SearchBlock from "./SearchBlock"
import DropdownMenuItem from "./DropdownMenuItem"
import UseWindowSize from "../../hooks/UseWindowSize"
import { getUserFromLocalStorage } from "../../utils/authUtils" // Utility to check login status
import { getFavoriteProducts } from "../../api/UserAPI" // API to get favorite products
import { getCart } from "../../api/CartAPI" // API to get cart
import { useUser } from "../../components/UserContext"

const Header = ({ header }) => {
  const [collapse, setCollapse] = React.useState(false)
  const size = UseWindowSize() // Viewport size hook
  const [parentName, setParentName] = React.useState(false)
  const [cartItems, cartDispatch] = React.useContext(CartContext) // Cart context
  const { user } = useUser()
  const [wishlistItems, wishlistDispatch] = React.useContext(WishlistContext) // Wishlist context

  const highlightDropdownParent = () => {
    // Highlight dropdown parent based on page load
    menu.map((item) => {
      item.links &&
        item.links.map((link) => {
          link.link === Router.route && setParentName(item.name)
        })
      item.groups &&
        item.groups.map(
          (group) =>
            group.links &&
            group.links.map(
              (link) => link.link === Router.route && setParentName(item.name)
            )
        )
      item.icons &&
        item.icons.map((link) => {
          link.link === Router.route && setParentName(item.name)
        })

      item.columns &&
        item.columns.map((column) =>
          column.lists.map((list) =>
            list.links.map((link) => {
              if (link.link === Router.route) {
                link.parent
                  ? setParentName(link.parent)
                  : setParentName(item.name)
              }
            })
          )
        )
    })
  }

  useEffect(() => {
    highlightDropdownParent()
    const userInfo = getUserFromLocalStorage() // Kiểm tra người dùng có đăng nhập không

    if (userInfo) {
      // Nếu người dùng đã đăng nhập, reset wishlist và gọi API lấy danh sách sản phẩm yêu thích
      wishlistDispatch({ type: "reset" }) // Reset wishlist context nếu đã đăng nhập
      cartDispatch({ type: "reset" }) // Reset cart context nếu đã đăng nhập

      // Gọi API lấy danh sách sản phẩm yêu thích của người dùng
      getFavoriteProducts(userInfo.token)
        .then((response) => {
          if (response.success && response.data) {
            // Cập nhật wishlist với danh sách sản phẩm yêu thích
            response.data.forEach((productId) => {
              wishlistDispatch({ type: "add", payload: productId })
            })
          }
        })
        .catch((error) => {
          console.error("Error fetching favorite products:", error)
        })

      // Gọi API lấy danh sách sản phẩm trong giỏ hàng của người dùng
      getCart(userInfo.token)
        .then((response) => {
          if (response.success && response.data) {
            // Cập nhật giỏ hàng với danh sách sản phẩm từ API
            response.data.forEach((product) => {
              cartDispatch({ type: "add", payload: product })
            })
          }
        })
        .catch((error) => {
          console.error("Error fetching cart:", error)
        })
    } else {
      // Nếu người dùng chưa đăng nhập, lấy wishlist từ localStorage
      const storedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      )
      wishlistDispatch({ type: "reset" }) // Đặt lại wishlist nếu có dữ liệu cũ
      storedWishlist.forEach((productId) => {
        wishlistDispatch({ type: "add", payload: productId })
      })

      // Lấy giỏ hàng từ localStorage
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]")
      cartDispatch({ type: "reset" }) // Đặt lại giỏ hàng nếu có dữ liệu cũ
      storedCart.forEach((product) => {
        cartDispatch({ type: "add", payload: product })
      })
    }
  }, [user])

  const onLinkClick = (parent) => {
    size.width < 991 && setCollapse(!collapse) // If viewport below 991px toggle collapse block
    setParentName(parent) // Set parent name for item parent highlight
  }

  return (
    <header
      className={`header ${header && header.absolute ? "header-absolute" : ""}`}
    >
      {/* TOP BAR */}
      <TopBar header={header} />
      {/* END TOP BAR */}

      {/* NAV BAR */}
      <Navbar
        expand="lg"
        style={{ zIndex: "11" }}
        bg={
          header && header.transparentNavbar
            ? collapse
              ? "white"
              : "transparent"
            : "white"
        }
        expanded={collapse}
        className={`border-0 ${
          header && header.transparentNavbar ? "shadow-0" : ""
        } px-lg-5 ${collapse ? "was-transparent was-navbar-light" : ""}`}
      >
        {/* LOGO */}
        <Link href="/" passHref>
          <Navbar.Brand>COOLMAN</Navbar.Brand>
        </Link>
        {/* END LOGO */}

        {/* TOP USER MOBILE ICONS */}
        <MainIcons className="d-block d-lg-none" />
        {/* TOP USER MOBILE ICONS */}

        {/* NAV MOBILE TOGGLER  */}
        <Navbar.Toggle
          className="navbar-toggler-right text-hover-primary"
          onClick={() => setCollapse(!collapse)}
          aria-label="Toggle navigation"
        >
          <Icon icon="menu-hamburger-1" className="navbar-icon" />
        </Navbar.Toggle>
        {/* END NAV MOBILE TOGGLER */}

        {/* MENU */}
        <Navbar.Collapse>
          {/* Menu.json */}
          <Nav className="mt-3 mt-lg-0" navbar>
            {menu.map((item, index) => {
              return item.link ? (
                <Nav.Item key={index}>
                  <ActiveLink
                    activeClassName="active"
                    href={item.link}
                    passHref
                  >
                    <NavLink>{item.name}</NavLink>
                  </ActiveLink>
                </Nav.Item>
              ) : (
                <DropdownMenuItem
                  onLinkClick={onLinkClick}
                  item={item}
                  key={item.name}
                  parentName={parentName}
                  viewportWidth={size.width}
                />
              )
            })}
          </Nav>
          {/* SEARCH BLOCK */}
          <SearchBlock />
          {/* END SEARCH BLOCK */}

          {/* Bộ Icon người dùng */}
          <MainIcons className="d-none d-lg-block" />
        </Navbar.Collapse>
        {/* END MENU */}
      </Navbar>
      {/* END NAV BAR */}
    </header>
  )
}

export default Header
