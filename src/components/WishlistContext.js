import React from "react"

// Tạo WishlistContext
const WishlistContext = React.createContext({})

const initialState = []

// Tạo reducer cho WishlistContext
const reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState

    case "add":
      // Kiểm tra xem sản phẩm có id này đã tồn tại chưa trong wishlist, nếu chưa thì thêm
      return !state.includes(action.payload)
        ? [...state, action.payload]
        : [...state]

    case "remove":
      // Lọc ra các id không phải là id của sản phẩm cần xoá
      return state.filter((id) => id !== action.payload)

    default:
      return state
  }
}

const WishlistProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return (
    <WishlistContext.Provider value={[state, dispatch]}>
      {props.children}
    </WishlistContext.Provider>
  )
}

export { WishlistContext, WishlistProvider }
