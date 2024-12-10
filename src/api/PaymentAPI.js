import axios from "axios"

// Địa chỉ API
const BASE_URL = "http://localhost:8080/payment"

// Hàm tạo URL thanh toán
export const createPaymentUrl = async (
  orderId,
  bankCode = null,
  token = null
) => {
  try {
    // Xây dựng headers
    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        }

    // Gửi yêu cầu GET để tạo URL thanh toán
    const response = await axios.get(
      `${BASE_URL}/create-payment-url/${orderId}`,
      {
        params: { bankCode },
        headers,
      }
    )

    // Kiểm tra phản hồi thành công và trả về URL thanh toán
    if (response.data.success) {
      return response.data.data // Đây là URL thanh toán từ API trả về
    } else {
      throw new Error(response.data.message || "Lỗi không xác định từ server")
    }
  } catch (error) {
    // Kiểm tra lỗi từ server nếu có
    if (error.response) {
      console.error("Error response from server:", error.response.data)
      throw new Error(error.response.data.message || "Lỗi không xác định")
    } else if (error.request) {
      console.error("No response from server:", error.request)
      throw new Error("Không thể kết nối đến server")
    } else {
      console.error("Unexpected error:", error.message)
      throw new Error("Lỗi không xác định")
    }
  }
}

// Hàm cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, token = null) => {
  try {
    // Xây dựng headers
    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        }

    // Gửi yêu cầu POST để cập nhật trạng thái đơn hàng
    const response = await axios.post(
      `${BASE_URL}/update-status/${orderId}`,
      {},
      { headers }
    )

    // Kiểm tra phản hồi từ server và xử lý kết quả
    if (response.data.success) {
      return response.data.message // Trả về thông báo thành công
    } else {
      throw new Error(response.data.message || "Lỗi không xác định từ server")
    }
  } catch (error) {
    // Kiểm tra lỗi từ server nếu có
    if (error.response) {
      console.error("Error response from server:", error.response.data)
      throw new Error(error.response.data.message || "Lỗi không xác định")
    } else if (error.request) {
      console.error("No response from server:", error.request)
      throw new Error("Không thể kết nối đến server")
    } else {
      console.error("Unexpected error:", error.message)
      throw new Error("Lỗi không xác định")
    }
  }
}
