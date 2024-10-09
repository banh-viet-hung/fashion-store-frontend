import axios from "axios";

const BASE_URL = "http://localhost:8080/user";

// Đăng ký người dùng mới
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
  }
};

// Bạn có thể thêm các API khác như login, get user info, v.v.
