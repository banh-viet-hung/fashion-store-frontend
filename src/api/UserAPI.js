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

// Cập nhật thông tin người dùng
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

// Lấy avatar và tên đầy đủ của người dùng
export const getUserAvatarAndFullName = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/avatar-and-fullname`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    })
    return response.data // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error getting user avatar and full name:", error)
    throw error // Ném lỗi để xử lý ở nơi khác nếu cần
  }
}

// Cập nhật avatar
export const updateAvatar = async (token, avatarUrl) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/update-avatar`,
      { avatar: avatarUrl }, // Gửi URL avatar trong body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Kèm theo token trong header
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error updating avatar:", error)
    throw error
  }
}

// Thêm sản phẩm vào danh sách yêu thích
export const addToFavorites = async (token, productId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/favorite/add/${productId}`,
      {}, // Không cần body, chỉ cần productId trong URL
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    )
    return response.data // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error adding product to favorites:", error)
    throw error // Ném lỗi để xử lý ở nơi khác nếu cần
  }
}

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFromFavorites = async (token, productId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/favorite/remove/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    )
    return response.data // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error removing product from favorites:", error)
    throw error // Ném lỗi để xử lý ở nơi khác nếu cần
  }
}

// Lấy danh sách sản phẩm yêu thích
export const getFavoriteProducts = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/favorite`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    })
    return response.data // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error getting favorite products:", error)
    throw error // Ném lỗi để xử lý ở nơi khác nếu cần
  }
}

// Hàm kiểm tra trạng thái tài khoản người dùng
export const checkUserStatus = async (username) => {
  try {
    // Gửi yêu cầu GET đến API với tham số username
    const response = await axios.get(
      `${BASE_URL}/check-status?username=${username}`
    )

    // Kiểm tra kết quả từ API
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message, // Trả về thông báo nếu thành công
      }
    } else {
      // Nếu tài khoản bị khóa
      throw new Error(
        response.data.message || "Tài khoản bị khóa hoặc không hợp lệ."
      )
    }
  } catch (error) {
    // Xử lý lỗi từ API hoặc các lỗi khác (mạng, server)
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Kiểm tra trạng thái tài khoản thất bại."
    throw new Error(errorMessage) // Ném ra lỗi để hàm gọi xử lý
  }
}
