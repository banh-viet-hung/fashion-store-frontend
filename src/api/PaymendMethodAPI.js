import axios from "axios"

const BASE_URL = "http://localhost:8080/paymentMethod"

// Lấy danh sách phương thức thanh toán với tham số page và size
export const getPaymentMethodsWithPagination = async (page = 0, size = 5) => {
  try {
    const response = await axios.get(`${BASE_URL}?page=${page}&size=${size}`)
    return response.data
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    throw error
  }
}

// Lấy phương thức thanh toán theo ID
export const getPaymentMethodById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching payment method:", error)
    throw error
  }
}

// Lấy thông tin order của phương thức thanh toán theo ID
export const getOrderByPaymentMethodId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}/order`)
    return response.data
  } catch (error) {
    console.error("Error fetching order for payment method:", error)
    throw error
  }
}
