import { getUserFromLocalStorage } from "../utils/authUtils" // Kiểm tra xem người dùng đã đăng nhập hay chưa
import { addToCart, removeFromCart, updateCart } from "../api/CartAPI"

// Hàm xóa sản phẩm khỏi giỏ hàng
export const removeCartItem = async (product) => {
  const user = getUserFromLocalStorage() // Kiểm tra xem người dùng đã đăng nhập chưa

  if (user) {
    try {
      await removeFromCart(
        product.productId,
        product.size || null, // Truyền null nếu size không có giá trị
        product.color || null, // Truyền null nếu color không có giá trị
        user.token
      )
      console.log("Sản phẩm đã được xóa khỏi giỏ hàng trên server.")
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng trên server:", error)
    }
  } else {
    // Nếu chưa đăng nhập, xóa sản phẩm khỏi localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [] // Lấy giỏ hàng từ localStorage
    const filteredCart = cart.filter(
      (x) =>
        x.productId !== product.productId ||
        x.size !== product.size ||
        x.color !== product.color // Loại bỏ sản phẩm khỏi giỏ hàng theo id, size và color
    )
    localStorage.setItem("cart", JSON.stringify(filteredCart)) // Cập nhật giỏ hàng vào localStorage
    console.log("Sản phẩm đã được xóa khỏi giỏ hàng trong localStorage.")
  }
}

// Hàm thêm sản phẩm vào giỏ hàng
export const addCartItem = async (product) => {
  const user = getUserFromLocalStorage() // Kiểm tra xem người dùng đã đăng nhập chưa

  const finalProduct = {
    ...product,
    quantity: parseInt(product.quantity, 10), // Gán số lượng cho sản phẩm
    size: product.size || null, // Gán size nếu có
    color: product.color || null, // Gán color nếu có
  }

  if (user) {
    try {
      await addToCart(finalProduct, user.token)
      console.log("Sản phẩm đã được thêm vào giỏ hàng trên server.")
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng trên server:", error)
    }
  } else {
    // Nếu chưa đăng nhập, lưu sản phẩm vào localStorage
    const oldCart = localStorage.getItem("cart") // Lấy giỏ hàng từ localStorage
    const cart = oldCart ? JSON.parse(oldCart) : [] // Nếu không có giỏ hàng, tạo mảng rỗng

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === finalProduct.productId &&
        item.size === finalProduct.size &&
        item.color === finalProduct.color
    )

    if (existingItemIndex >= 0) {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      cart[existingItemIndex].quantity += finalProduct.quantity
    } else {
      // Nếu chưa có, thêm sản phẩm vào giỏ hàng
      cart.push(finalProduct)
    }

    localStorage.setItem("cart", JSON.stringify(cart)) // Cập nhật giỏ hàng vào localStorage
    console.log("Sản phẩm đã được thêm vào giỏ hàng trong localStorage.")
  }
}

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (product) => {
  const user = getUserFromLocalStorage() // Kiểm tra xem người dùng đã đăng nhập chưa

  const finalProduct = {
    ...product,
    quantity: parseInt(product.quantity, 10), // Gán số lượng cho sản phẩm
    size: product.size || null, // Gán size nếu có
    color: product.color || null, // Gán color nếu có
  }

  if (user) {
    try {
      console.log("finalProduct", finalProduct)
      await updateCart(finalProduct, user.token)
      console.log(
        "Số lượng sản phẩm trong giỏ hàng đã được cập nhật trên server."
      )
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng trên server:",
        error
      )
    }
  } else {
    // Nếu chưa đăng nhập, cập nhật số lượng sản phẩm trong localStorage
    const oldCart = JSON.parse(localStorage.getItem("cart")) || [] // Lấy giỏ hàng từ localStorage
    const existingItemIndex = oldCart.findIndex(
      (item) =>
        item.productId === finalProduct.productId &&
        item.size === finalProduct.size &&
        item.color === finalProduct.color
    ) // Tìm index của sản phẩm cần cập nhật

    if (existingItemIndex >= 0) {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      oldCart[existingItemIndex].quantity = finalProduct.quantity
      localStorage.setItem("cart", JSON.stringify(oldCart)) // Cập nhật giỏ hàng vào localStorage
      console.log(
        "Số lượng sản phẩm trong giỏ hàng đã được cập nhật trong localStorage."
      )
    }
  }
}
