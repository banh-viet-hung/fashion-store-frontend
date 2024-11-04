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

// Lấy thông tin người dùng
export const getUserInfo = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/info`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    })
    return response.data // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error getting user info:", error)
    throw error // Ném lỗi để xử lý ở nơi khác nếu cần
  }
}

export const updateUserInfo = async (token, userInfo) => {
  try {
    const response = await axios.put(`${BASE_URL}/update`, userInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error updating user info:", error)
    throw error
  }
}

// Đổi mật khẩu
export const changePassword = async (token, passwordData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/change-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Kèm theo token trong header
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}
