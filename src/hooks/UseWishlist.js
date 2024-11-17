import { getUserFromLocalStorage } from "../utils/authUtils";  // Đảm bảo import đúng file chứa hàm getUserFromLocalStorage
import { addToFavorites, removeFromFavorites } from "../api/UserAPI";   // Đảm bảo import đúng các hàm API tương ứng

// Hàm xóa sản phẩm khỏi wishlist
export const removeWishlistItem = async (product) => {
  const user = getUserFromLocalStorage();  // Kiểm tra xem người dùng đã đăng nhập chưa
  
  if (user) {
    // Nếu đã đăng nhập, gọi API để xóa sản phẩm khỏi wishlist
    try {
      await removeFromFavorites(user.token, product.id);  // Gọi API để xóa sản phẩm theo product.id
      console.log('Sản phẩm đã được xóa khỏi wishlist trên server.');
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi wishlist:', error);
    }
  } else {
    // Nếu chưa đăng nhập, xóa sản phẩm khỏi localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const filteredWishlist = wishlist.filter(id => id !== product.id);  // Lọc sản phẩm bằng id
    localStorage.setItem('wishlist', JSON.stringify(filteredWishlist));
    console.log('Sản phẩm đã được xóa khỏi wishlist trong localStorage.');
  }
}

// Hàm thêm sản phẩm vào wishlist
export const addWishlistItem = async (product) => {
  const user = getUserFromLocalStorage();  // Kiểm tra xem người dùng đã đăng nhập chưa

  if (user) {
    // Nếu đã đăng nhập, gọi API để thêm sản phẩm vào wishlist
    try {
      await addToFavorites(user.token, product.id);  // Gọi API để thêm sản phẩm theo product.id
      console.log('Sản phẩm đã được thêm vào wishlist trên server.');
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào wishlist:', error);
    }
  } else {
    // Nếu chưa đăng nhập, lưu sản phẩm vào localStorage
    const oldWishlist = localStorage.getItem('wishlist');  // Lấy wishlist từ localStorage
    const wishlist = oldWishlist ? JSON.parse(oldWishlist) : [];  // Nếu có wishlist, parse nó, nếu không thì khởi tạo mảng rỗng

    if (!wishlist.includes(product.id)) {
      const newWishlist = [...wishlist, product.id];  // Thêm id sản phẩm vào danh sách
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));  // Lưu lại wishlist mới vào localStorage
      console.log('Sản phẩm đã được thêm vào wishlist trong localStorage.');
    }
  }
}
