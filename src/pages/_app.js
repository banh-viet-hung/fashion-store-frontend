import React from "react"
import AOS from "aos"
import Layout from "../components/Layout"
import { UserProvider } from "../components/UserContext" // Import UserProvider
import { ToastContainer, toast } from "react-toastify" // Import react-toastify
import "aos/dist/aos.css"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/parallax"
import "swiper/css/autoplay"
import "swiper/css/effect-fade"
import "../fonts/stylesheet.css"
import "@fortawesome/fontawesome-svg-core/styles.css"
import "../scss/style.default.scss"
import "react-toastify/dist/ReactToastify.css" // Import style của react-toastify

const App = ({ Component, pageProps }) => {
  React.useEffect(() => {
    AOS.init({
      startEvent: "DOMContentLoaded",
      offset: 120,
      delay: 150,
      duration: 400,
      easing: "ease",
      once: true,
    })
    AOS.refresh()
  }, []) // Thêm [] để useEffect chỉ chạy một lần

  // Hàm hiển thị toast
  const showToast = () => {
    toast.success("Đăng ký thành công!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  return (
    <UserProvider>
      <Layout {...pageProps}>
        <Component {...pageProps} />
        <ToastContainer />{" "}
        {/* Đặt ToastContainer ở nơi muốn hiển thị thông báo */}
      </Layout>
    </UserProvider>
  )
}

export default App
