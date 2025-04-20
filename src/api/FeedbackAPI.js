import axios from "axios"

const BASE_URL = "http://localhost:8080/feedback"

export const getUserByFeedbackId = async (feedbackId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${feedbackId}/user`)
    return response.data
  } catch (error) {
    console.error("Error fetching user for feedback:", error)
    throw error
  }
}

// Lấy danh sách đánh giá của người dùng hiện tại
export const getUserFeedbacks = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching user feedbacks:", error)
    throw error
  }
}

// Hàm thống nhất để cập nhật và tạo đánh giá
export const updateFeedback = async (token, feedbackId, feedbackData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/update/${feedbackId}`,
      feedbackData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Error updating/creating feedback:", error)
    throw error
  }
}
