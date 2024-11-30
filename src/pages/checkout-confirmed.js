import React, { useEffect } from "react"
import { Container, Breadcrumb, Button, Alert } from "react-bootstrap"
import { useRouter } from "next/router" // Import useRouter hook

import { FormContext } from "../components/FormContext"
import Icon from "../components/Icon"
import Link from "next/link"

export async function getServerSideProps(context) {
  const { id } = context.query // Lấy giá trị 'id' từ query params trong URL

  // Kiểm tra nếu không có id trong URL, điều hướng về trang chủ
  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      title: "Đặt hàng thành công",
      checkout: true,
      id, // Truyền id vào props
    },
  }
}

const CheckoutConfirmed = ({ id }) => {
  const [formInputs, setFormInputs] = React.useContext(FormContext) // Checkout inputs context

  console.log(formInputs) // Log of filled inputs and cart items

  return (
    <React.Fragment>
      <section className="hero py-6">
        <Container>
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>Đặt hàng thành công</Breadcrumb.Item>
          </Breadcrumb>
          <div className="hero-content">
            <h1 className="hero-heading">Đặt hàng thành công</h1>
            <Alert variant="success" className="d-flex align-items-center">
              <Icon
                icon="checked-circle-1"
                className="w-3rem h-3rem svg-icon-light flex-shrink-0 me-3"
              />
              Thông tin đặt hàng của bạn đã được chuyển đến nhân viên của chúng
              tôi.
            </Alert>
          </div>
        </Container>
      </section>
      <section className="pb-6">
        <Container>
          <p className="lead">Cảm ơn bạn đã tin tưởng và lựa chọn COOLMAN.</p>
          <p className="lead mb-5">
            Nhân viên của chúng tôi sẽ nhanh chóng gọi điện cho bạn để xác nhận
            đơn hàng.
          </p>
          <div className="p-5 bg-gray-100">
            Mã đơn hàng của bạn là: <strong>{id}</strong>{" "}
            {/* Display the id here */}
            hãy ghi nhớ mã này để tra cứu đơn hàng của bạn.
          </div>
          <br />
          <p className="mb-6">
            <Link href="/customer-order" passHref>
              <Button variant="outline-dark">Quản lí đơn hàng</Button>
            </Link>
          </p>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default CheckoutConfirmed
