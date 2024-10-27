// context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("email")
    const role = localStorage.getItem("role")
    const expiration = localStorage.getItem("expiration")

    if (token && email && role && expiration) {
      const currentTime = Math.floor(Date.now() / 1000) // Thời gian hiện tại (giây)
      console.log(currentTime)
      console.log(expiration)

      // Kiểm tra xem token có hết hạn không
      if (expiration > currentTime) {
        setUser({ token, email, role, expiration })
      } else {
        logout() // Token đã hết hạn, đăng xuất
      }
    }
  }, [])

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
