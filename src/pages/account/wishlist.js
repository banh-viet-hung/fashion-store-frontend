import React, { useEffect, useContext } from "react"
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap"
import { useRouter } from "next/router"
import { WishlistContext } from "../../components/WishlistContext"
import CustomerSidebar from "../../components/CustomerSidebar"
import WishlistItems from "../../components/WishlistItems"
import { useUser } from "../../components/UserContext"
import { getUserFromLocalStorage } from "../../utils/authUtils" // Thêm import để lấy thông tin người dùng

export async function getStaticProps() {
  return {
    props: {
      title: "Sản phẩm yêu thích",
    },
  }
}

const CustomerWishlist = () => {
  const router = useRouter()
  const [wishlistItemsState] = useContext(WishlistContext)
  const [loading, setLoading] = React.useState(true)
  const { user } = useUser()
  const [userInfoNotification, setUserInfoNotification] = React.useState({
    message: "",
    type: "",
  })

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập chưa
    const userData = getUserFromLocalStorage()
    if (!userData) {
      // Nếu chưa đăng nhập, điều hướng đến trang login
      router.push("/wishlist")
    } else {
      setLoading(false)
    }
  }, [router, user])

  const showNotification = (message, type) => {
    setUserInfoNotification({ message, type })
    setTimeout(() => {
      setUserInfoNotification({ message: "", type: "" })
    }, 3000)
  }

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
          <div className="hero-content">
            <h1 className="hero-heading mb-3">Danh sách yêu thích</h1>
            <div>
              <p className="lead text-muted mb-0">
                Bạn có {wishlistItemsState.length} sản phẩm trong danh sách yêu
                thích của mình.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <Container className="pb-6">
        <Row>
          <Col lg="8" xl="9">
            {userInfoNotification.message && (
              <Alert
                variant={
                  userInfoNotification.type === "success" ? "success" : "danger"
                }
              >
                {userInfoNotification.message}
              </Alert>
            )}

            {/* Kiểm tra nếu không có sản phẩm yêu thích */}
            {wishlistItemsState.length === 0 ? (
              <Alert variant="info">
                Bạn chưa có sản phẩm nào trong danh sách yêu thích.
              </Alert>
            ) : (
              <WishlistItems customer />
            )}
          </Col>
          <Col lg="4" xl="3" className="mb-5">
            <CustomerSidebar />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default CustomerWishlist
