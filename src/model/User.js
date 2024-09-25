class User {
  constructor({
    id = null,
    fullName = "", // Họ và tên
    phoneNumber = "", // Số điện thoại
    gender = "", // Giới tính
    dateOfBirth = null, // Ngày sinh
    height = 0, // Chiều cao
    weight = 0, // Cân nặng
    email = "", // Email đăng nhập
    password = "", // Mật khẩu
    avatar = "", // Avatar
    addresses = [], // Danh sách địa chỉ
    feedback = [], // Danh sách phản hồi
    orders = [], // Danh sách đơn hàng
    roles = [], // Danh sách vai trò
    favoriteProducts = [], // Danh sách sản phẩm yêu thích
    cartProducts = [], // Danh sách sản phẩm trong giỏ hàng
    staffOrders = [], // Danh sách đơn hàng do nhân viên quản lý
  }) {
    this.id = id // Mã định danh người dùng
    this.fullName = fullName // Họ và tên
    this.phoneNumber = phoneNumber // Số điện thoại
    this.gender = gender // Giới tính
    this.dateOfBirth = dateOfBirth // Ngày sinh
    this.height = height // Chiều cao
    this.weight = weight // Cân nặng
    this.email = email // Email đăng nhập
    this.password = password // Mật khẩu
    this.avatar = avatar // Avatar
    this.addresses = addresses // Danh sách địa chỉ
    this.feedback = feedback // Danh sách phản hồi
    this.orders = orders // Danh sách đơn hàng
    this.roles = roles // Danh sách vai trò
    this.favoriteProducts = favoriteProducts // Danh sách sản phẩm yêu thích
    this.cartProducts = cartProducts // Danh sách sản phẩm trong giỏ hàng
    this.staffOrders = staffOrders // Danh sách đơn hàng do nhân viên quản lý
  }
}

export default User
