class Product {
  constructor({
    id = null,
    name = "",
    price = 0,
    salePrice = 0,
    averageRating = 0,
    description = "",
    quantity = 0,
    sizes = [],
    colors = [],
    brand = "",
    detail = "",
    createdAt = new Date(),
    updatedAt = new Date(),
    images = [],
    categories = [],
    feedbacks = [],
    orderDetails = [],
    favoriteProducts = [],
    cartProducts = [],
    relatedProducts = [],
    features = [],
  } = {}) {
    this.id = id
    this.name = name
    this.price = price
    this.salePrice = salePrice
    this.averageRating = averageRating
    this.description = description
    this.quantity = quantity
    this.sizes = sizes
    this.colors = colors
    this.brand = brand
    this.detail = detail
    this.createdAt = new Date(createdAt)
    this.updatedAt = new Date(updatedAt)
    this.images = images
    this.categories = categories
    this.feedbacks = feedbacks
    this.orderDetails = orderDetails
    this.favoriteProducts = favoriteProducts
    this.cartProducts = cartProducts
    this.relatedProducts = relatedProducts
    this.features = features
  }
}

export default Product
