class Feedback {
  constructor({
    id = null,
    rating = 0, // Đánh giá từ 1 đến 5
    comment = "", // Bình luận
    createdAt = new Date(), // Ngày tạo feedback
    updatedAt = new Date(), // Ngày cập nhật feedback
    product = null, // Sản phẩm mà feedback này thuộc về
    user = null, // Người dùng đã tạo feedback
  }) {
    this.id = id // Mã định danh của feedback
    this.rating = rating // Đánh giá
    this.comment = comment // Bình luận
    this.createdAt = createdAt // Ngày tạo
    this.updatedAt = updatedAt // Ngày cập nhật
    this.product = product // Sản phẩm liên quan
    this.user = user // Người dùng liên quan
  }
}

export default Feedback
