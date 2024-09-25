class Color {
  constructor({
    id = null,
    name = "",
    code = "",
    image = "",
    description = "",
    products = [], // Danh sách sản phẩm thuộc màu này
  }) {
    this.id = id
    this.name = name // Tên màu
    this.code = code // Mã màu (hex hoặc rgb)
    this.image = image // Hình ảnh liên quan đến màu
    this.description = description // Mô tả về màu
    this.products = products // Danh sách sản phẩm có màu này
  }
}

export default Color
