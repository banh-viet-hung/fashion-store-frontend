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
