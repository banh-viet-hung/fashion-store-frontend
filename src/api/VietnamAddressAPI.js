import axios from "axios";

// Sử dụng API của hanhchinhvn.xyz để lấy dữ liệu hành chính Việt Nam
const BASE_URL = "https://provinces.open-api.vn/api";

// Lấy danh sách tất cả các tỉnh/thành phố
export const getProvinces = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/p`);
        return response.data; // Trả về danh sách các tỉnh/thành phố
    } catch (error) {
        console.error("Error fetching provinces:", error);
        return [];
    }
};

// Lấy danh sách quận/huyện theo mã tỉnh/thành phố
export const getDistrictsByProvinceCode = async (provinceCode) => {
    if (!provinceCode) return [];
    try {
        const response = await axios.get(`${BASE_URL}/p/${provinceCode}?depth=2`);
        return response.data.districts || [];
    } catch (error) {
        console.error(`Error fetching districts for province ${provinceCode}:`, error);
        return [];
    }
};

// Lấy danh sách phường/xã theo mã quận/huyện
export const getWardsByDistrictCode = async (districtCode) => {
    if (!districtCode) return [];
    try {
        const response = await axios.get(`${BASE_URL}/d/${districtCode}?depth=2`);
        return response.data.wards || [];
    } catch (error) {
        console.error(`Error fetching wards for district ${districtCode}:`, error);
        return [];
    }
}; 