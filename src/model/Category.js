class Category {
  constructor({
    id = null,
    name = "",
    description = "",
    createdAt = new Date(),
    updatedAt = new Date(),
    image = "",
    products = [], // Danh sách sản phẩm thuộc danh mục này
  }) {
    this.id = id
    this.name = name // Tên danh mục
    this.description = description // Mô tả danh mục
    this.createdAt = createdAt // Ngày tạo danh mục
    this.updatedAt = updatedAt // Ngày cập nhật danh mục
    this.image = image // Hình ảnh đại diện cho danh mục
    this.products = products // Danh sách sản phẩm liên quan
  }
}

export default Category
