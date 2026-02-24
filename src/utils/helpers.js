// Helper functions - Vietnam timezone (UTC+7)
const VIETNAM_TZ = 'Asia/Ho_Chi_Minh';

export const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            timeZone: VIETNAM_TZ,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Invalid Date';
    }
};

export const formatDate = (dateString, simple = false) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        const options = simple
            ? { timeZone: VIETNAM_TZ, month: '2-digit', day: '2-digit' }
            : { timeZone: VIETNAM_TZ, year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('vi-VN', options);
    } catch {
        return 'Invalid Date';
    }
};

export const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            timeZone: VIETNAM_TZ,
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
    } catch {
        return 'Invalid Date';
    }
};
