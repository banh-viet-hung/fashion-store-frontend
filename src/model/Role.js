class Role {
  constructor({
    id = null,
    name = "", // Tên vai trò
    users = [], // Danh sách người dùng có vai trò này
  }) {
    this.id = id // Mã định danh của vai trò
    this.name = name // Tên vai trò
    this.users = users // Danh sách người dùng có vai trò này
  }
}

export default Role
