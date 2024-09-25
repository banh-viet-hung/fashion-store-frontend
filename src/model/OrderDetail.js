class OrderDetail {
  constructor({
    id = null,
    product = null, // Sản phẩm trong chi tiết đơn hàng
    quantity = 0, // Số lượng sản phẩm
    size = "", // Size sản phẩm
    color = "", // Màu sản phẩm
    order = null, // Đơn hàng thuộc về
    totalPrice = 0, // Giá sản phẩm
  }) {
    this.id = id // Mã định danh của chi tiết đơn hàng
    this.product = product // Sản phẩm trong chi tiết đơn hàng
    this.quantity = quantity // Số lượng sản phẩm
    this.size = size // Size sản phẩm
    this.color = color // Màu sản phẩm
    this.order = order // Đơn hàng thuộc về
    this.totalPrice = totalPrice // Giá sản phẩm
  }
}

export default OrderDetail
