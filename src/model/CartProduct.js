class CartProduct {
  constructor({
    id = null,
    product = null, // product có thể là một đối tượng Product hoặc null
    quantity = 0,
    size = "",
    color = "",
    user = null, // user có thể là một đối tượng User hoặc null
    totalPrice = 0.0,
  }) {
    this.id = id
    this.product = product // Đối tượng Product
    this.quantity = quantity // Số lượng sản phẩm
    this.size = size // Kích thước sản phẩm
    this.color = color // Màu sắc sản phẩm
    this.user = user // Đối tượng User
    this.totalPrice = totalPrice // Giá tổng
  }
}

export default CartProduct
