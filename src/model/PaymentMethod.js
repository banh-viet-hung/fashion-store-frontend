class PaymentMethod {
  constructor({
    id = null,
    name = "", // Tên hình thức thanh toán
    description = "", // Mô tả về hình thức thanh toán
    orders = [], // Danh sách đơn hàng liên quan
  }) {
    this.id = id // Mã định danh của phương thức thanh toán
    this.name = name // Tên hình thức thanh toán
    this.description = description // Mô tả về hình thức thanh toán
    this.orders = orders // Danh sách đơn hàng liên quan
  }
}

export default PaymentMethod
