import axios from "axios"

const BASE_URL = "http://localhost:8080/api/auth"

// Đăng nhập người dùng
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials)

    // Kiểm tra nếu đăng nhập thành công
    if (response.data.success) {
      return response.data // Trả về dữ liệu nếu thành công
    } else {
      throw new Error(response.data.message) // Ném ra lỗi nếu không thành công
    }
  } catch (error) {
    // Thông báo lỗi nếu có
    const errorMessage = error.response?.data?.message || "Đăng nhập thất bại."
    throw new Error(errorMessage)
  }
}
