import axios from "axios"

const BASE_URL = "http://localhost:8080/product"

// Lấy danh sách sản phẩm với tham số page và size
export const getProductsWithPagination = async (page = 0, size = 5) => {
  try {
    const response = await axios.get(`${BASE_URL}?page=${page}&size=${size}`)
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

// Lấy danh sách hình ảnh theo sản phẩm
export const getImagesByProductId = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${productId}/images`)
    return response.data._embedded.image
  } catch (error) {
    console.error("Error fetching images:", error)
    throw error
  }
}

// Lấy sản phẩm theo ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error("Error fetching product:", error)
    throw error
  }
}

// Lấy feedback của sản phẩm theo ID
export const getFeedbackByProductId = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${productId}/feedbacks`)
    return response.data._embedded.feedback // Chỉnh sửa để trả về đúng định dạng
  } catch (error) {
    console.error("Error fetching feedback:", error)
    throw error
  }
}
