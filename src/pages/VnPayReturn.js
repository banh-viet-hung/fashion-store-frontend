import React, { useEffect, useState, useCallback } from "react"
import {
  Container,
  Breadcrumb,
  Alert,
  Spinner,
  Row,
  Col,
  Button,
  Card,
} from "react-bootstrap"
import Icon from "../components/Icon"
import Link from "next/link"
import { useRouter } from "next/router"
import CryptoJS from "crypto-js"
import { toast } from "react-toastify"
import { updateOrderStatus } from "../api/PaymentAPI" // Nhập hàm updateOrderStatus từ file API của bạn
import { getUserFromLocalStorage } from "../utils/authUtils"

export async function getServerSideProps() {
  return {
    props: {
      title: "Xác nhận thanh toán",
      checkout: true,
    },
  }
}

const VnPayReturn = () => {
  const router = useRouter()
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [isValid, setIsValid] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoaded, setIsLoaded] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false) // Thêm trạng thái để kiểm soát quá trình xác nhận

  const vnpHashSecret = "C98DV73U8O8J78ANS1BUPUX93WPXHQ0E"

  const calculateSecureHash = useCallback((data, secretKey) => {
    const hash = CryptoJS.HmacSHA512(data, secretKey)
    return hash.toString(CryptoJS.enc.Hex).toLowerCase()
  }, [])

  useEffect(() => {
    if (!router.query) return

    const vnp_Params = router.query
    const secureHash = vnp_Params["vnp_SecureHash"]
    delete vnp_Params["vnp_SecureHash"]
    delete vnp_Params["vnp_SecureHashType"]

    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = vnp_Params[key]
        return obj
      }, {})

    const signData = new URLSearchParams(sortedParams).toString()
    const calculatedHash = calculateSecureHash(signData, vnpHashSecret)

    if (secureHash === calculatedHash) {
      const transactionStatus = vnp_Params["vnp_TransactionStatus"]
      const responseCode = vnp_Params["vnp_ResponseCode"]

      setPaymentInfo({
        ...vnp_Params,
        transactionStatus: transactionStatus,
        responseCode: responseCode,
      })

      if (responseCode === "00" && transactionStatus === "00") {
        setIsValid(true)
        setIsLoaded(false)
        toast.success("Chữ kí hợp lệ! Hãy xác nhận đơn hàng của bạn.")
      } else {
        setIsValid(false)
        setIsLoaded(false)
        setErrorMessage(
          "Giao dịch không thành công!. Mã đơn hàng của bạn là: #" +
            vnp_Params["vnp_TxnRef"]
        )
        toast.error("Giao dịch không thành công! Vui lòng thử lại.")
      }
    } else {
      setIsValid(false)
      setErrorMessage("Dữ liệu xác thực không hợp lệ.")
    }
  }, [router.query, calculateSecureHash])

  // Hàm gọi API để cập nhật trạng thái đơn hàng
  const handleConfirmPayment = async () => {
    if (isProcessing) return // Nếu đang xử lý thì không làm gì nữa
    setIsProcessing(true) // Bắt đầu xử lý

    try {
      const orderId = paymentInfo.vnp_TxnRef // Lấy mã đơn hàng từ thông tin trả về
      const response = await updateOrderStatus(
        orderId,
        getUserFromLocalStorage()?.token
      ) // Gọi hàm cập nhật trạng thái đơn hàng

      // Hiển thị thông báo thành công
      toast.success(response)
      setIsProcessing(false) // Kết thúc xử lý
    } catch (error) {
      toast.error(error.message || "Xác nhận thất bại, vui lòng thử lại!")
      setIsProcessing(false) // Kết thúc xử lý
    }
  }

  if (isLoaded) {
    return (
      <div
        className="text-center d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Spinner animation="border" variant="primary" />
        <h3 className="ms-3">Đang xác thực dữ liệu...</h3>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const year = dateString.slice(0, 4)
    const month = dateString.slice(4, 6)
    const day = dateString.slice(6, 8)
    const hour = dateString.slice(8, 10)
    const minute = dateString.slice(10, 12)
    const second = dateString.slice(12, 14)
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`
  }

  return (
    <React.Fragment>
      <section className="hero py-6">
        <Container>
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>
              {isValid ? "Đặt hàng thành công" : "Thanh toán không thành công"}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="hero-content text-center">
            <h1 className="hero-heading">
              {isValid ? "Đặt hàng thành công" : "Thanh toán không thành công"}
            </h1>
            <Alert
              variant={
                isValid === null ? "warning" : isValid ? "success" : "danger"
              }
              className="d-flex align-items-center mx-auto mb-4"
              style={{
                maxWidth: "600px",
                fontSize: "1.1rem",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <Icon
                icon="checked-circle-1"
                className="w-4rem h-4rem svg-icon-light flex-shrink-0 me-3"
              />
              {isValid === null
                ? "Đang kiểm tra thông tin giao dịch..."
                : isValid
                ? "Thanh toán thành công!"
                : errorMessage || "Thông tin giao dịch không hợp lệ!"}
            </Alert>

            {isValid === false && (
              <section className="pb-6">
                <Container>
                  <p className="mb-6">
                    <Link href="/account/orders" passHref>
                      <Button variant="outline-dark">Quản lí đơn hàng</Button>
                    </Link>
                  </p>
                </Container>
              </section>
            )}

            {isValid && (
              <>
                <div
                  style={{
                    color: "red",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <strong>Thông báo quan trọng:</strong> Hãy bấm xác nhận để
                  hoàn thành quá trình thanh toán.
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    variant="danger"
                    size="lg"
                    className="px-5 py-2 mt-3"
                    onClick={handleConfirmPayment} // Thêm sự kiện vào nút
                    disabled={isProcessing} // Vô hiệu hóa nút khi đang xử lý
                  >
                    {isProcessing ? "Đang xác nhận..." : "Xác nhận ngay"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Container>
      </section>

      {isValid && paymentInfo && (
        <section className="pb-6">
          <Container>
            <h3 className="text-center mb-4">Thông tin giao dịch</h3>
            <Row>
              <Col md={6}>
                <Card
                  className="mb-3"
                  border="success"
                  style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
                >
                  <Card.Body>
                    <Card.Title className="mb-3">
                      Thông tin thanh toán
                    </Card.Title>
                    <p>
                      <strong>Số tiền thanh toán:</strong>{" "}
                      {(paymentInfo.vnp_Amount / 100).toLocaleString()} VND
                    </p>
                    <p>
                      <strong>Mã ngân hàng:</strong> {paymentInfo.vnp_BankCode}
                    </p>
                    <p>
                      <strong>Mã giao dịch tại ngân hàng:</strong>{" "}
                      {paymentInfo.vnp_BankTranNo}
                    </p>
                    <p>
                      <strong>Loại thẻ:</strong> {paymentInfo.vnp_CardType}
                    </p>
                    <p>
                      <strong>Ngày đặt hàng:</strong>{" "}
                      {formatDate(paymentInfo.vnp_PayDate)}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card
                  className="mb-3"
                  border="success"
                  style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}
                >
                  <Card.Body>
                    <Card.Title className="mb-3">Chi tiết đơn hàng</Card.Title>
                    <p>
                      <strong>Thông tin đơn hàng:</strong>{" "}
                      {paymentInfo.vnp_OrderInfo}
                    </p>
                    <p>
                      <strong>Transaction No:</strong>{" "}
                      {paymentInfo.vnp_TransactionNo}
                    </p>
                    <p>
                      <strong>Mã đơn hàng):</strong> {paymentInfo.vnp_TxnRef}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <section className="pb-6">
              <Container>
                <p className="mb-6">
                  <Link href="/account/orders" passHref>
                    <Button variant="outline-dark">Quản lí đơn hàng</Button>
                  </Link>
                </p>
              </Container>
            </section>
          </Container>
        </section>
      )}
    </React.Fragment>
  )
}

export default VnPayReturn
