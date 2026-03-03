/**
 * Image utilities - Ảnh chuẩn cho Parking Lots, Users
 * Dùng ảnh thật từ API khi có, fallback placeholder đẹp
 */

const API_URL = (import.meta.env.VITE_APP_API_URL || 'https://smartparkingexe.azurewebsites.net').replace(/\/$/, '');

// Placeholder ảnh bãi xe - Unsplash (free, stable URLs)
const PARKING_IMAGES = [
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&q=80&w=800',
];

/**
 * Lấy ảnh bãi xe - ưu tiên imageUrl từ API, fallback placeholder
 * @param {Object} lot - parking lot { imageUrl, parkingLotId, name }
 * @param {number} index - index trong list (để chọn placeholder đa dạng)
 */
export const getParkingLotImage = (lot, index = 0) => {
    const url = lot?.imageUrl?.trim();
    if (url) {
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return `${API_URL}${url}`;
        return `${API_URL}/${url}`;
    }
    const idx = index % PARKING_IMAGES.length;
    return PARKING_IMAGES[idx];
};

/**
 * Lấy avatar user - ưu tiên avatarUrl từ API, fallback chữ cái đầu
 * @param {Object} user - { avatarUrl, fullName, email }
 */
export const getUserAvatarUrl = (user) => {
    const url = user?.avatarUrl?.trim();
    if (url) {
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return `${API_URL}${url}`;
        return `${API_URL}/${url}`;
    }
    return null;
};

/**
 * Lấy chữ cái đầu cho avatar fallback
 */
export const getUserInitials = (user) => {
    const name = user?.fullName?.trim();
    if (name) {
        const parts = name.split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    }
    const email = user?.email?.trim();
    if (email) return email[0].toUpperCase();
    return 'U';
};
