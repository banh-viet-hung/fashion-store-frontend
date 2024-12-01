import React from "react"
import { Card, Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"

const ReviewOrderSummary = ({ priceDetails }) => {
  // Destructure price details object to access individual prices
  const { subTotal, shipping, discount, total } = priceDetails

  // Định dạng tiền tệ theo VND
  const formatCurrency = (amount) => {
    return amount
      ? amount.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      : "0 VND"
  }

  return (
    <Card className="mb-5">
      <Card.Header>
        <h6 className="mb-0">Đơn hàng của bạn</h6>
      </Card.Header>
      <Card.Body className="py-4">
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
                {formatCurrency(discount)} {/* Hiển thị giảm giá nếu có */}
              </td>
            </tr>
            <tr>
              <th className="pt-4 border-0">Tổng tiền phải trả</th>
              <td className="pt-4 border-0 text-end h3 fw-normal">
                {formatCurrency(total)} {/* Tổng tiền phải trả */}
              </td>
            </tr>
          </tbody>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default ReviewOrderSummary
