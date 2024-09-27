import axios from "axios"

const BASE_URL = "http://localhost:8080/product"

// Lấy danh sách sản phẩm
export const getProducts = async () => {
  try {
    const response = await axios.get(BASE_URL)
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
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

// Thêm sản phẩm mới
export const createProduct = async (product) => {
  try {
    const response = await axios.post(BASE_URL, product)
    return response.data
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

// Cập nhật sản phẩm
export const updateProduct = async (id, product) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, product)
    return response.data
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

// Xóa sản phẩm
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`)
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}
