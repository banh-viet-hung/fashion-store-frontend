import React, { useEffect, useState, useContext } from "react"
import { Container, Breadcrumb, Spinner, Alert } from "react-bootstrap"
import { useRouter } from "next/router"
import Link from "next/link"
import WishlistItems from "../components/WishlistItems"
import { WishlistContext } from "../components/WishlistContext"
import { getUserFromLocalStorage } from "../utils/authUtils" // Thêm import để lấy thông tin người dùng
import { useUser } from "../components/UserContext"


export async function getStaticProps() {
  return {
    props: {
      title: "Danh sách yêu thích",
    },
  }
}

const Wishlist = () => {
  const [wishlistItemsState] = useContext(WishlistContext)
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập chưa
    const userData = getUserFromLocalStorage()
    if (userData) {
      // Nếu đã đăng nhập, chuyển hướng tới trang danh sách yêu thích của người dùng
      router.push("/account/wishlist")
    } else {
      // Nếu chưa đăng nhập, tiếp tục ở lại trang này
      setLoading(false)
    }
  }, [router, user])

  if (loading) {
    return (
      <Container className="py-6 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  return (
    <React.Fragment>
      <section className="hero py-6">
        <Container>
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>Danh sách yêu thích</Breadcrumb.Item>
          </Breadcrumb>
          <div className="hero-content">
            <h1 className="hero-heading mb-3">Danh sách yêu thích</h1>
            <div>
              {wishlistItemsState.length > 0 ? (
                <p className="lead text-muted">
                  Bạn đã thêm {wishlistItemsState.length} sản phẩm vào danh sách
                  yêu thích của mình.
                </p>
              ) : (
                <p className="lead text-muted">
                  Danh sách yêu thích của bạn hiện đang trống.
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>
      {wishlistItemsState.length > 0 && (
        <Container className="pb-6">
          <WishlistItems />
        </Container>
      )}
    </React.Fragment>
  )
}

export default Wishlist
