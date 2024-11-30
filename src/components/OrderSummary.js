import React, { useEffect, useState, useContext } from "react"
import Link from "next/link"
import { Card, Button } from "react-bootstrap"
import { CartContext } from "../components/CartContext"
import { FormContext } from "./FormContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { getProductById } from "../api/ProductAPI"

const OrderSummary = (props) => {
  const [cartItems] = useContext(CartContext) // Lấy giỏ hàng từ CartContext
  const [formInputs] = useContext(FormContext) // Lấy thông tin form từ FormContext
  const [productDetails, setProductDetails] = useState([]) // Lưu thông tin chi tiết sản phẩm
  const [loading, setLoading] = useState(true) // Trạng thái loading

  // Tính tổng tiền sản phẩm
  const calculateTotal = (cartItems, productDetails) => {
    return cartItems.reduce((sum, item) => {
      const product = productDetails.find(
        (product) => product.id === item.productId
      )
      if (product) {
        // Sử dụng salePrice nếu có, nếu không thì dùng price
        const productPrice =
          product.salePrice > 0 ? product.salePrice : product.price
        return sum + productPrice * item.quantity
      }
      return sum
    }, 0)
  }

  // Lấy thông tin các sản phẩm từ CartContext
  const fetchProductDetails = async () => {
    try {
      const productPromises = cartItems.map(
        (item) => getProductById(item.productId) // Lấy chi tiết sản phẩm từ API
      )
      const products = await Promise.all(productPromises)
      setProductDetails(products) // Cập nhật thông tin sản phẩm
      setLoading(false) // Set loading thành false khi dữ liệu đã được lấy
    } catch (error) {
      console.error("Error fetching product details:", error)
      setLoading(false) // Nếu có lỗi, cũng set loading thành false
    }
  }

  useEffect(() => {
    fetchProductDetails() // Gọi hàm fetchProductDetails khi giỏ hàng thay đổi
  }, [cartItems])

  // Tính tổng tiền sản phẩm
  const subTotal = loading ? 0 : calculateTotal(cartItems, productDetails)

  // Phí vận chuyển, mặc định bằng 0 nếu không có thông tin
  const shipping = formInputs.shipping ? formInputs.shipping?.fee : 0

  // Định dạng tiền tệ theo VND
  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    })
  }

  return (
    <Card className="mb-5">
      <Card.Header>
        <h6 className="mb-0">Đơn hàng của bạn</h6>
      </Card.Header>
      <Card.Body className="py-4">
        <p className="text-muted text-sm">
          Chi phí vận chuyển sẽ phụ thuộc vào đơn vị vận chuyển mà bạn lựa chọn.
        </p>
        <Card.Text as="table" className="table">
          <tbody>
            <tr>
              <th className="py-4">Tổng tiền sản phẩm</th>
              <td className="py-4 text-end text-muted">
                {formatCurrency(subTotal)} {/* Hiển thị tổng tiền sản phẩm */}
              </td>
            </tr>
            <tr>
              <th className="py-4">Chi phí vận chuyển</th>
              <td className="py-4 text-end text-muted">
                {formatCurrency(shipping)} {/* Hiển thị chi phí vận chuyển */}
              </td>
            </tr>
            <tr>
              <th className="py-4">Giảm giá</th>
              <td className="py-4 text-end text-muted">
                {formatCurrency(0)} {/* Hiển thị giảm giá nếu có */}
              </td>
            </tr>
            <tr>
              <th className="pt-4 border-0">Tổng tiền phải trả</th>
              <td className="pt-4 border-0 text-end h3 fw-normal">
                {formatCurrency(subTotal + shipping)} {/* Tổng tiền phải trả */}
              </td>
            </tr>
          </tbody>
        </Card.Text>
      </Card.Body>
      {props.showProceedToCheckout && (
        <Card.Footer className="overflow-hidden p-0">
          <div className="d-grid">
            <Link href="/checkout1" passHref>
              <Button variant="primary" className="py-3">
                Tiến hành thanh toán{" "}
                <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
              </Button>
            </Link>
          </div>
        </Card.Footer>
      )}
    </Card>
  )
}

export default OrderSummary
