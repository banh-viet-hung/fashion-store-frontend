class Address {
  constructor({
    id = null,
    fullName = "",
    phoneNumber = "",
    address = "",
    city = "",
    district = "",
    ward = "",
    type = "",
    user = null,
    orders = [],
  }) {
    this.id = id
    this.fullName = fullName
    this.phoneNumber = phoneNumber
    this.address = address
    this.city = city
    this.district = district
    this.ward = ward
    this.type = type
    this.user = user // user có thể là một đối tượng User hoặc null
    this.orders = orders // orders là một mảng các đối tượng Order
  }
}

export default Address
