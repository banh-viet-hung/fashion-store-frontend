import axios from "axios"

const BASE_URL = "http://localhost:8080/cart"

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (cartProductDTO, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/add`, cartProductDTO, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    })
    return response.data // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCart = async (cartProductDTO, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/update`, cartProductDTO, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    })
    return response.data // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error updating cart:", error)
    throw error
  }
}

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (productId, size, color, token) => {
  try {
    // Nếu size và color là null, thay vì để chuỗi rỗng, bạn truyền null.
    const response = await axios.delete(
      `${BASE_URL}/remove/${productId}/${size || "null"}/${color || "null"}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    )
    return response.data // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw error
  }
}

// Lấy giỏ hàng của người dùng
export const getCart = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    })
    return response.data // Trả về dữ liệu giỏ hàng từ API
  } catch (error) {
    console.error("Error fetching cart:", error)
    throw error
  }
}
