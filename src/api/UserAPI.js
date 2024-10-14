import axios from "axios"

const BASE_URL = "http://localhost:8080/user"

// Đăng ký người dùng mới
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData)
    return response.data // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error registering user:", error)
    throw error // Ném lỗi để xử lý ở nơi khác nếu cần
  }
}

// Kiểm tra xem email đã tồn tại hay chưa
export const checkEmail = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/check-email`, { email })
    return response.data // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error checking email:", error)
    throw error // Ném lỗi để xử lý ở nơi khác nếu cần
  }
}

// Yêu cầu gửi email đặt lại mật khẩu
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/request-password-reset`, {
      email,
    })
    return response.data // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error requesting password reset:", error)
    throw error // Ném lỗi để xử lý ở nơi khác nếu cần
  }
}

// Đặt lại mật khẩu
export const resetPassword = async (token, newPasswordData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/reset-password/${token}`,
      newPasswordData
    )
    return response.data // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error resetting password:", error)
    throw error // Ném lỗi để xử lý ở nơi khác nếu cần
  }
}

// Bạn có thể thêm các API khác như login, get user info, v.v.
