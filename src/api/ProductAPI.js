import axios from "axios"

const BASE_URL = "http://localhost:8080/product"

const BASE_URL2 = "http://localhost:8080/products"

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

// Lấy size của sản phẩm theo ID
export const getSizesByProductId = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${productId}/sizes`)
    return response.data._embedded.size // Trả về thông tin về size
  } catch (error) {
    console.error("Error fetching sizes:", error)
    throw error
  }
}

// Lấy color của sản phẩm theo ID
export const getColorsByProductId = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${productId}/colors`)
    return response.data._embedded.color // Trả về thông tin về color
  } catch (error) {
    console.error("Error fetching colors:", error)
    throw error
  }
}

// Lấy danh sách sản phẩm theo bộ lọc với các tham số
export const getFilteredProducts = async ({
  categorySlugs = [], // Mảng category, mặc định là []
  sizeNames = [], // Mảng size, mặc định là []
  colorNames = [], // Mảng color, mặc định là []
  minPrice = 0, // Giá trị minPrice mặc định là 0
  maxPrice = 5000000, // Giá trị maxPrice mặc định là 5000000
  page = 0, // Trang mặc định là 0
  size = 16, // Kích thước trang mặc định là 16
  sortBy = null, // Sắp xếp mặc định là null
} = {}) => {
  try {
    const response = await axios.post(`${BASE_URL2}/filter`, {
      categorySlugs: categorySlugs.length > 0 ? categorySlugs : null,
      sizeNames: sizeNames.length > 0 ? sizeNames : null,
      colorNames: colorNames.length > 0 ? colorNames : null,
      minPrice,
      maxPrice,
      page, 
      size,
      sortBy,
    })
    return response.data
  } catch (error) {
    console.error("Error fetching filtered products:", error)
    throw error
  }
}
