import React, { createContext, useReducer } from "react"

// Tạo CartContext
const CartContext = createContext({})

// Initial state của giỏ hàng (empty array)
const initialState = []

// Tạo reducer cho CartContext
const reducer = (state, action) => {
  // Final product để có thể thêm vào giỏ hàng hoặc cập nhật số lượng
  const finalProduct = action.payload?.quantity
    ? {
        ...action.payload,
        quantity: parseInt(action.payload.quantity, 10),
        size: action.payload?.size || null, // Cập nhật size nếu có
        color: action.payload?.color || null, // Cập nhật color nếu có
      }
    : action.payload

  switch (action.type) {
    case "reset":
      return initialState // Reset giỏ hàng về trạng thái ban đầu
    case "add":
      // Kiểm tra nếu sản phẩm đã có trong giỏ hàng hay chưa (so sánh theo id, size, và color)
      const existingItemIndex = state.findIndex(
        (item) =>
          item.productId === finalProduct.productId &&
          item.size === finalProduct.size &&
          item.color === finalProduct.color
      )

      if (existingItemIndex >= 0) {
        // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        const updatedState = [...state]
        updatedState[existingItemIndex].quantity += finalProduct.quantity
        return updatedState
      } else {
        // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
        return [...state, finalProduct]
      }
    case "remove":
      // Xóa sản phẩm khỏi giỏ hàng dựa trên id, size, và color
      return state.filter(
        (item) =>
          !(
            item.productId === finalProduct.productId &&
            item.size === finalProduct.size &&
            item.color === finalProduct.color
          )
      )
    case "update":
      // Cập nhật số lượng sản phẩm trong giỏ hàng dựa trên id, size, và color
      const updatedState = state.map((item) => {
        if (
          item.productId === finalProduct.productId &&
          item.size === finalProduct.size &&
          item.color === finalProduct.color
        ) {
          item.quantity = finalProduct.quantity
        }
        return item
      })
      return updatedState

    default:
      return state
  }
}

// CartProvider dùng để bao bọc các component cần sử dụng CartContext
const CartProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <CartContext.Provider value={[state, dispatch]}>
      {props.children}
    </CartContext.Provider>
  )
}

export { CartContext, CartProvider }
