import axios from "axios"

const BASE_URL = "http://localhost:8080/address/user" // Địa chỉ API của bạn

// Lấy danh sách địa chỉ của người dùng
export const getUserAddresses = async (token) => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    })
    return response.data // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error fetching user addresses:", error)
    throw error // Ném lỗi để xử lý ở nơi khác nếu cần
  }
}

// Thêm hoặc cập nhật địa chỉ người dùng
export const createOrUpdateAddress = async (token, addressData) => {
  try {
    const response = await axios.post(BASE_URL+"/address", addressData, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header
      },
    })
    return response.data // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error creating or updating address:", error)
    throw error // Ném lỗi để xử lý ở nơi khác nếu cần
  }
}
