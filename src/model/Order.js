class Order {
  constructor({
    id = null,
    orderDate = new Date(), // Ngày đặt hàng
    status = "", // Trạng thái đơn hàng
    shippingAddress = null, // Địa chỉ giao hàng
    totalProductPrice = 0, // Tổng tiền sản phẩm
    shippingFee = 0, // Chi phí vận chuyển
    tax = 0, // Thuế
    total = 0, // Tổng tiền
    user = null, // Người dùng đặt hàng
    paymentMethod = null, // Hình thức thanh toán
    shippingMethod = null, // Hình thức vận chuyển
    orderDetails = [], // Danh sách chi tiết đơn hàng
    staff = null, // Nhân viên quản lý đơn hàng
  }) {
    this.id = id // Mã định danh của đơn hàng
    this.orderDate = orderDate // Ngày đặt hàng
    this.status = status // Trạng thái đơn hàng
    this.shippingAddress = shippingAddress // Địa chỉ giao hàng
    this.totalProductPrice = totalProductPrice // Tổng tiền sản phẩm
    this.shippingFee = shippingFee // Chi phí vận chuyển
    this.tax = tax // Thuế
    this.total = total // Tổng tiền
    this.user = user // Người dùng đặt hàng
    this.paymentMethod = paymentMethod // Hình thức thanh toán
    this.shippingMethod = shippingMethod // Hình thức vận chuyển
    this.orderDetails = orderDetails // Danh sách chi tiết đơn hàng
    this.staff = staff // Nhân viên quản lý đơn hàng
  }
}

export default Order
