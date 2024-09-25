class FavoriteProduct {
  constructor({
    id = null,
    size = "",
    color = "",
    user = null, // Tham chiếu đến người dùng
    product = null, // Tham chiếu đến sản phẩm
  }) {
    this.id = id // Mã định danh của sản phẩm yêu thích
    this.size = size // Kích thước của sản phẩm yêu thích
    this.color = color // Màu sắc của sản phẩm yêu thích
    this.user = user // Tham chiếu đến đối tượng User
    this.product = product // Tham chiếu đến đối tượng Product
  }
}

export default FavoriteProduct
