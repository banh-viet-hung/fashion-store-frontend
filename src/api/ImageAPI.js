import axios from "axios"

const BASE_URL = "http://localhost:8080"

// Lấy danh sách hình ảnh theo sản phẩm
export const getImagesByProductId = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${productId}/images`)
    return response.data._embedded.image
  } catch (error) {
    console.error("Error fetching images:", error)
    throw error
  }
}

// Thêm hình ảnh mới cho sản phẩm
export const createImage = async (productId, image) => {
  try {
    const response = await axios.post(`${BASE_URL}/product/${productId}`, image)
    return response.data
  } catch (error) {
    console.error("Error creating image:", error)
    throw error
  }
}

// Cập nhật hình ảnh
export const updateImage = async (imageId, image) => {
  try {
    const response = await axios.put(`${BASE_URL}/${imageId}`, image)
    return response.data
  } catch (error) {
    console.error("Error updating image:", error)
    throw error
  }
}

// Xóa hình ảnh
export const deleteImage = async (imageId) => {
  try {
    await axios.delete(`${BASE_URL}/${imageId}`)
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}
