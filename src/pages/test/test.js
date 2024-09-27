import React, { useEffect } from "react"
import { getProducts } from "../../api/ProductAPI"

const Test = () => {
  useEffect(() => {
    const testApi = async () => {
      try {
        // Lấy danh sách sản phẩm
        const products = await getProducts()
        console.log("Danh sách sản phẩm:", products)
      } catch (error) {
        console.error("Lỗi trong quá trình kiểm tra API:", error)
      }
    }
    testApi()
  }, [])

  return (
    <div>Kiểm tra API đã hoàn tất. Xem console để biết thêm thông tin.</div>
  )
}

export default Test
