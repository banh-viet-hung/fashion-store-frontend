import axios from "axios"

// Địa chỉ API
const BASE_URL = "http://localhost:8080/size"

// Hàm lấy danh sách kích thước
export const getSizes = async (token = null) => {
  try {
    // Xây dựng headers nếu có token
    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        }

    // Gửi yêu cầu GET để lấy danh sách kích thước
    const response = await axios.get(BASE_URL, { headers })

    // Kiểm tra phản hồi thành công và trả về dữ liệu kích thước
    if (response.data._embedded && response.data._embedded.size) {
      return response.data._embedded.size // Trả về danh sách kích thước từ API
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
