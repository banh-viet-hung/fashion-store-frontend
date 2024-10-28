// utils/authUtils.js

export const getUserFromLocalStorage = () => {
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const role = localStorage.getItem("role")
  const expiration = localStorage.getItem("expiration")

  if (token && email && role && expiration) {
    const currentTime = Math.floor(Date.now() / 1000) // Thời gian hiện tại (giây)

    // Kiểm tra xem token có hết hạn không
    if (expiration > currentTime) {
      return { token, email, role, expiration }
    }
  }

  return null // Không có thông tin người dùng hợp lệ
}
