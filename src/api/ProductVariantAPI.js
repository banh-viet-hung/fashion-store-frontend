import axios from "axios"

const BASE_URL = "http://localhost:8080/product-variant"

// Lấy số lượng sản phẩm theo ID, màu sắc và kích thước
export const getProductQuantity = async (
  productId,
  colorName = "",
  sizeName = ""
) => {
  try {
    const response = await axios.get(`${BASE_URL}/quantity`, {
      params: {
        productId: productId,
        colorName: colorName,
        sizeName: sizeName,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching product quantity:", error)
    throw error
  }
}
