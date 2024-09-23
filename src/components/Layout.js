import React from "react"
import Head from "next/head"
import NextNProgress from "../components/NextNProgress"

import Header from "./Header"
import Footer from "./Footer"
import Icons from "./Icons"

import { FormProvider } from "./FormContext"
import { CartProvider } from "./CartContext"
import { WishlistProvider } from "./WishlistContext"
import SSRProvider from "react-bootstrap/SSRProvider"

const Layout = (pageProps) => {
  return (
    <SSRProvider>
      {/* Icon và Title của mỗi trang */}
      <Head>
        <link rel="icon" href="/favicon.png" />
        <title>{`${pageProps.title}`}</title>
      </Head>

      {/* Hiển thị thanh tiến trình */}
      <NextNProgress color="#bcac76" options={{ showSpinner: false }} />

      <CartProvider>
        <WishlistProvider>
          {/* Header */}
          <Header header={pageProps.header} />

          {/* Nội dung trang */}
          {/* Nếu trang là trang checkout thì sử dụng FormProvider để lưu trạng thái của form */}
          {pageProps.checkout ? (
            <FormProvider>
              <main>{pageProps.children}</main>
            </FormProvider>
          ) : (
            <main>{pageProps.children}</main>
          )}

          {/* Footer */}
          <Footer />
        </WishlistProvider>
      </CartProvider>

      {/* Hiển thị các icon */}
      <Icons />
    </SSRProvider>
  )
}

export default Layout
