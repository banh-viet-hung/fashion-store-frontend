import axios from "axios"

const BASE_URL = "http://localhost:8080/product/search"

// Tìm kiếm sản phẩm theo tên
export const searchProductsByName = async (name, page = 0, size = 5) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/findByNameContainingIgnoreCase?name=${encodeURIComponent(
        name
      )}&page=${page}&size=${size}`
    )
    return response.data
  } catch (error) {
    console.error("Error searching products:", error)
    throw error
  }
}
