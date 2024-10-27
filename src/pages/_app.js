import React from "react"
import AOS from "aos"
import Layout from "../components/Layout"
import { UserProvider } from "../components/UserContext" // Import UserProvider

import "aos/dist/aos.css"

// swiper core styles
import "swiper/css"

// modules styles
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/parallax"
import "swiper/css/autoplay"
import "swiper/css/effect-fade"

import "../fonts/stylesheet.css"
import "@fortawesome/fontawesome-svg-core/styles.css"
import "../scss/style.default.scss"

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

  return (
    <UserProvider>
      {" "}
      {/* Bọc Layout bằng UserProvider */}
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  )
}

export default App
