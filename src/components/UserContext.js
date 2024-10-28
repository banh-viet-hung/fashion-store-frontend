import React, { createContext, useContext, useState, useEffect } from "react"
import { getUserFromLocalStorage } from "../utils/authUtils"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (userData) {
      setUser(userData)
    } else {
      logout() // Token đã hết hạn, đăng xuất
    }
  }, []) // Chạy một lần khi component mount

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("token", userData.token)
    localStorage.setItem("email", userData.email)
    localStorage.setItem("role", userData.role)
    localStorage.setItem("expiration", userData.expiration) // Lưu trữ thời gian hết hạn
  }

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
