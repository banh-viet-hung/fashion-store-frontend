import React, { createContext, useContext, useState, useEffect } from "react"
import { getUserFromLocalStorage } from "../utils/authUtils"
import { toast } from "react-toastify"
import axios from "axios"
const BASE_URL = "http://localhost:8080/user" // Đảm bảo đúng URL API của bạn

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (userData) {
      // Kiểm tra trạng thái tài khoản khi có user
      const checkStatus = async () => {
        try {
          // Gửi yêu cầu GET để kiểm tra trạng thái tài khoản
          const response = await axios.get(
            `${BASE_URL}/check-status?username=${userData?.email}`
          )

          if (response.data.success) {
            // Nếu tài khoản đang hoạt động, lưu vào state
            setUser(userData)
          } else {
            // Nếu tài khoản bị khóa
            toast.error(response.data.message) // Hiển thị thông báo tài khoản bị khóa
            logout() // Đăng xuất nếu tài khoản bị khóa
          }
        } catch (error) {
          // Xử lý lỗi khi không thể kiểm tra trạng thái tài khoản (lỗi mạng, API)
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Không thể kiểm tra trạng thái tài khoản."
          toast.error(
            "Không thể kiểm tra trạng thái tài khoản: " + errorMessage
          ) // Hiển thị thông báo lỗi
          logout() // Đăng xuất nếu có lỗi
        }
      }
      checkStatus() // Gọi hàm kiểm tra trạng thái tài khoản
    } else {
      logout() // Nếu không có userData (token hết hạn), đăng xuất
    }
  }, []) // Chạy một lần khi component mount

  // Hàm login
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("token", userData.token)
    localStorage.setItem("email", userData.email)
    localStorage.setItem("role", userData.role)
    localStorage.setItem("expiration", userData.expiration) // Lưu trữ thời gian hết hạn
  }

  // Hàm logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    localStorage.removeItem("role")
    localStorage.removeItem("expiration")
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
