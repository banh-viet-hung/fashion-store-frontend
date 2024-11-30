// OrderAPI.js
import axios from "axios"

const BASE_URL = "http://localhost:8080/orders"

export const createOrder = async (orderData, token = null) => {
  try {
    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        }

    const response = await axios.post(`${BASE_URL}/create`, orderData, {
      headers,
    })

    // Trả về phản hồi từ server
    return response.data
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
