class Feature {
  constructor({
    id = null,
    name = "",
    description = "",
    products = [], // Danh sách các sản phẩm có tính năng này
  }) {
    this.id = id // Mã định danh của tính năng
    this.name = name // Tên của tính năng
    this.description = description // Mô tả của tính năng
    this.products = products // Danh sách các sản phẩm liên quan đến tính năng này
  }
}

export default Feature
