class ShippingMethod {
  constructor({
    id = null,
    name = "", // Tên phương thức vận chuyển
    description = "", // Mô tả phương thức vận chuyển
    fee = 0, // Phí vận chuyển
    orders = [], // Danh sách đơn hàng sử dụng phương thức này
  }) {
    this.id = id // Mã định danh của phương thức vận chuyển
    this.name = name // Tên phương thức vận chuyển
    this.description = description // Mô tả phương thức vận chuyển
    this.fee = fee // Phí vận chuyển
    this.orders = orders // Danh sách đơn hàng sử dụng phương thức này
  }
}

export default ShippingMethod
