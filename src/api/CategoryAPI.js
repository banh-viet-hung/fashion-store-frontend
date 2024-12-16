import axios from "axios"

const API_URL = "http://localhost:8080/category"
const PRODUCT_API_URL =
  "http://localhost:8080/category/search/findProductsByCategorySlug" // URL cho phân trang sản phẩm theo slug

const API_URL2 = "http://localhost:8080/categories"

class CategoryAPI {
  // Get all categories
  static async getAllCategories() {
    try {
      const response = await axios.get(API_URL + "?page=0&size=100")
      return response.data
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  }

  // Get category by ID
  static async getCategoryById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error)
      throw error
    }
  }

  // Get products by category slug with pagination
  static async getProductsByCategorySlug(slug, page = 0, size = 16) {
    try {
      const response = await axios.get(
        `${PRODUCT_API_URL}?slug=${slug}&page=${page}&size=${size}`
      )
      return response.data // Trả về kết quả tìm kiếm sản phẩm theo slug
    } catch (error) {
      console.error(`Error fetching products for slug ${slug}:`, error)
      throw error
    }
  }

  // Get child categories by parent category slug
  static async getChildCategoriesBySlug(slug) {
    try {
      const response = await axios.get(`${API_URL2}/children/${slug}`)
      return response.data // Trả về kết quả danh sách danh mục con
    } catch (error) {
      console.error(`Error fetching child categories for slug ${slug}:`, error)
      throw error
    }
  }
}

export default CategoryAPI
