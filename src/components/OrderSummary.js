import React, { useEffect, useState, useContext } from "react"
import Link from "next/link"
import { Card, Button, Form, InputGroup, Badge } from "react-bootstrap"
import { CartContext } from "../components/CartContext"
import { FormContext } from "./FormContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight, faTag, faTimes } from "@fortawesome/free-solid-svg-icons"
import { getProductById } from "../api/ProductAPI"
import { validateCoupon } from "../api/CouponAPI"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const OrderSummary = (props) => {
  const [cartItems] = useContext(CartContext) // Lấy giỏ hàng từ CartContext
  const [formInputs, setFormInputs] = useContext(FormContext) // Lấy thông tin form từ FormContext
  const [productDetails, setProductDetails] = useState([]) // Lưu thông tin chi tiết sản phẩm
  const [loading, setLoading] = useState(true) // Trạng thái loading
  const [couponCode, setCouponCode] = useState("") // State lưu mã giảm giá
  const [discount, setDiscount] = useState(0) // State lưu giá trị giảm giá
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false) // Trạng thái đang xác thực mã giảm giá
  const [appliedCoupon, setAppliedCoupon] = useState(null) // State lưu mã giảm giá đã áp dụng

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

  // Kiểm tra và áp dụng mã giảm giá từ localStorage khi component mount
  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon')
    const savedDiscount = localStorage.getItem('couponDiscount')
    
    if (savedCoupon && savedDiscount && !appliedCoupon) {
      setAppliedCoupon(savedCoupon)
      setDiscount(Number(savedDiscount))
      
      // Cập nhật vào FormContext
      setFormInputs(prev => ({
        ...prev,
        couponCode: savedCoupon
      }))
    }
  }, [])

  // Kiểm tra và áp dụng lại mã giảm giá khi subTotal thay đổi
  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon')
    
    // Nếu có mã giảm giá đã lưu và đã tính được subTotal
    if (savedCoupon && !loading && subTotal > 0 && appliedCoupon) {
      // Xác thực lại mã giảm giá với giá trị mới của giỏ hàng
      const validateSavedCoupon = async () => {
        try {
          const response = await validateCoupon(savedCoupon, subTotal)
          
          if (response.success) {
            setDiscount(response.data)
            localStorage.setItem('couponDiscount', response.data)
          } else {
            // Nếu mã không còn hợp lệ (ví dụ: giỏ hàng thay đổi, không đủ điều kiện)
            handleRemoveCoupon()
            toast.error("Mã giảm giá không còn hợp lệ với giỏ hàng hiện tại")
          }
        } catch (error) {
          console.error("Error validating saved coupon:", error)
        }
      }
      
      validateSavedCoupon()
    }
  }, [subTotal])

  // Xử lý thay đổi input mã giảm giá
  const handleCouponChange = (e) => {
    setCouponCode(e.target.value)
  }

  // Xử lý xác thực mã giảm giá
  const handleValidateCoupon = async (e) => {
    e.preventDefault()
    
    if (!couponCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá")
      return
    }

    setIsValidatingCoupon(true)

    try {
      const response = await validateCoupon(couponCode, subTotal)
      
      if (response.success) {
        setDiscount(response.data)
        setAppliedCoupon(couponCode)
        
        // Lưu vào localStorage
        localStorage.setItem('appliedCoupon', couponCode)
        localStorage.setItem('couponDiscount', response.data)
        
        // Cập nhật couponCode vào FormContext
        setFormInputs({
          ...formInputs,
          couponCode: couponCode
        })
        toast.success(response.message || "Áp dụng mã giảm giá thành công")
        setCouponCode("")
      } else {
        setDiscount(0)
        setAppliedCoupon(null)
        
        // Xóa khỏi localStorage
        localStorage.removeItem('appliedCoupon')
        localStorage.removeItem('couponDiscount')
        
        // Xóa couponCode khỏi FormContext
        setFormInputs({
          ...formInputs,
          couponCode: null
        })
        toast.error(response.message || "Mã giảm giá không hợp lệ")
      }
    } catch (error) {
      console.error("Error validating coupon:", error)
      toast.error("Đã xảy ra lỗi khi kiểm tra mã giảm giá")
      setDiscount(0)
      setAppliedCoupon(null)
      
      // Xóa khỏi localStorage
      localStorage.removeItem('appliedCoupon')
      localStorage.removeItem('couponDiscount')
      
      // Xóa couponCode khỏi FormContext khi có lỗi
      setFormInputs({
        ...formInputs,
        couponCode: null
      })
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  // Xử lý loại bỏ mã giảm giá
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscount(0)
    
    // Xóa khỏi localStorage
    localStorage.removeItem('appliedCoupon')
    localStorage.removeItem('couponDiscount')
    
    // Xóa couponCode khỏi FormContext khi gỡ bỏ
    setFormInputs({
      ...formInputs,
      couponCode: null
    })
    toast.info("Đã gỡ bỏ mã giảm giá")
  }

  // Định dạng tiền tệ theo VND
  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    })
  }

  return (
    <>
      <Card className="mb-5">
        <Card.Header className="bg-light">
          <h6 className="mb-0">Đơn hàng của bạn</h6>
        </Card.Header>
        <Card.Body className="py-4">
          <p className="text-muted text-sm mb-4">
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
                  {formatCurrency(discount)} {/* Hiển thị giảm giá */}
                </td>
              </tr>
              <tr>
                <th className="pt-4 border-0">Tổng tiền phải trả</th>
                <td className="pt-4 border-0 text-end h3 fw-normal">
                  {formatCurrency(subTotal + shipping - discount)} {/* Tổng tiền phải trả */}
                </td>
              </tr>
            </tbody>
          </Card.Text>
          
          {/* Phần mã giảm giá */}
          <div className="mt-4 border-top pt-4">
            <h6 className="mb-3">
              <FontAwesomeIcon icon={faTag} className="me-2" />
              Mã giảm giá
            </h6>
            
            {appliedCoupon ? (
              <div className="d-flex align-items-center justify-content-between p-3 border rounded mb-3">
                <div>
                  <Badge bg="success" className="me-2">Đã áp dụng</Badge>
                  <span className="fw-bold">{appliedCoupon}</span>
                  <div className="text-success mt-1">
                    Giảm {formatCurrency(discount)}
                  </div>
                </div>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={handleRemoveCoupon}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-1" />
                  Gỡ bỏ
                </Button>
              </div>
            ) : (
              <Form onSubmit={handleValidateCoupon}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={handleCouponChange}
                    className="border-end-0"
                  />
                  <Button 
                    variant="outline-primary" 
                    type="submit"
                    disabled={isValidatingCoupon}
                    className="fw-bold"
                  >
                    {isValidatingCoupon ? "Đang kiểm tra..." : "Áp dụng"}
                  </Button>
                </InputGroup>
              </Form>
            )}
          </div>
        </Card.Body>
        {props.showProceedToCheckout && (
          <Card.Footer className="overflow-hidden p-0">
            <div className="d-grid">
              <Link href="/checkout1" passHref>
                <Button variant="primary" size="lg" className="py-3">
                  Tiến hành thanh toán{" "}
                  <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
                </Button>
              </Link>
            </div>
          </Card.Footer>
        )}
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default OrderSummary
