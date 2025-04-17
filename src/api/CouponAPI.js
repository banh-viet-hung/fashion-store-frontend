// CouponAPI.js
import axios from "axios"

const BASE_URL = "http://localhost:8080/coupons"

// Hàm validate mã giảm giá
export const validateCoupon = async (code, orderValue) => {
  try {
    const response = await axios.post(`${BASE_URL}/validate`, {
      code,
      orderValue
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    })

    return response.data
  } catch (error) {
    // Kiểm tra lỗi từ server nếu có
    if (error.response) {
      console.error("Error response from server:", error.response.data)
      return {
        success: false,
        message: error.response.data.message || "Lỗi không xác định"
      }
    } else if (error.request) {
      console.error("No response from server:", error.request)
      return {
        success: false,
        message: "Không thể kết nối đến server"
      }
    } else {
      console.error("Unexpected error:", error.message)
      return {
        success: false,
        message: "Lỗi không xác định"
      }
    }
  }
} 