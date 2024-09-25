class Image {
  constructor({
    id = null,
    isThumbnail = false, // Là thumbnail hay không
    url = "", // Dữ liệu ảnh
    altText = "", // Văn bản thay thế cho ảnh
    createdAt = new Date(), // Ngày tạo ảnh
    updatedAt = new Date(), // Ngày cập nhật ảnh
    product = null, // Sản phẩm liên quan
  }) {
    this.id = id // Mã định danh của ảnh
    this.isThumbnail = isThumbnail // Xác định xem ảnh có phải là thumbnail không
    this.url = url // Đường dẫn đến ảnh
    this.altText = altText // Văn bản thay thế cho ảnh
    this.createdAt = createdAt // Ngày tạo
    this.updatedAt = updatedAt // Ngày cập nhật
    this.product = product // Sản phẩm mà ảnh này thuộc về
  }
}

export default Image
