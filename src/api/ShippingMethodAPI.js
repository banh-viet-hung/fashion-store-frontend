import axios from "axios"

const BASE_URL = "http://localhost:8080/shippingMethod"

// Lấy danh sách phương thức giao hàng với tham số page và size
export const getShippingMethodsWithPagination = async (page = 0, size = 5) => {
  try {
    const response = await axios.get(`${BASE_URL}?page=${page}&size=${size}`)
    return response.data
  } catch (error) {
    console.error("Error fetching shipping methods:", error)
    throw error
  }
}

// Lấy phương thức giao hàng theo ID
export const getShippingMethodById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching shipping method:", error)
    throw error
  }
}

// Lấy thông tin order của phương thức giao hàng theo ID
export const getOrderByShippingMethodId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}/order`)
    return response.data
  } catch (error) {
    console.error("Error fetching order for shipping method:", error)
    throw error
  }
}
