import axios from "axios"

const API_URL = "http://localhost:8080/category?page=0&size=100"

class CategoryAPI {
  // Get all categories
  static async getAllCategories() {
    try {
      const response = await axios.get(API_URL)
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

  // Create a new category
  static async createCategory(categoryData) {
    try {
      const response = await axios.post(API_URL, categoryData)
      return response.data
    } catch (error) {
      console.error("Error creating category:", error)
      throw error
    }
  }

  // Update an existing category
  static async updateCategory(id, categoryData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, categoryData)
      return response.data
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error)
      throw error
    }
  }

  // Delete a category
  static async deleteCategory(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error)
      throw error
    }
  }
}

export default CategoryAPI
