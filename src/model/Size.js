class Size {
  constructor({
    id = null,
    name = "", // Tên kích thước (ví dụ: "S", "M", "L", "XL")
    description = "", // Mô tả về kích thước
    products = [], // Danh sách sản phẩm thuộc kích thước này
  }) {
    this.id = id // Mã định danh của kích thước
    this.name = name // Tên kích thước
    this.description = description // Mô tả về kích thước
    this.products = products // Danh sách sản phẩm thuộc kích thước này
  }
}

export default Size
