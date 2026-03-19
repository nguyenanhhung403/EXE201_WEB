/**
 * Dịch các thông báo lỗi từ API/tiếng Anh sang tiếng Việt cho người dùng.
 */
const API_ERROR_MAP = {
    'Invalid email or password': 'Email hoặc mật khẩu không đúng',
    'Invalid response': 'Phản hồi không hợp lệ',
    'Network error': 'Lỗi kết nối mạng',
    'No parking lots found': 'Không tìm thấy bãi xe nào',
    'No refresh': 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
};

export const translateApiError = (msg) => {
    if (!msg || typeof msg !== 'string') return msg;
    const trimmed = msg.trim();
    for (const [en, vi] of Object.entries(API_ERROR_MAP)) {
        if (trimmed.toLowerCase().includes(en.toLowerCase())) return vi;
    }
    return msg;
};
