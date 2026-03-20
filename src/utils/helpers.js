// Helper functions - Vietnam timezone (UTC+7)
const VIETNAM_TZ = 'Asia/Ho_Chi_Minh';

// If backend serializes datetime without timezone info (no `Z`/offset),
// JS will interpret it as device local time, which can cause a 7-hour shift.
// Here we normalize timezone-less strings as Vietnam local time.
const parseDateInVietnam = (dateString) => {
    if (!dateString) return null;
    if (dateString instanceof Date) return isNaN(dateString.getTime()) ? null : dateString;

    if (typeof dateString === 'number') {
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? null : d;
    }

    const s = String(dateString).trim();
    if (!s) return null;

    const hasTz =
        s.endsWith('Z') ||
        /[+-]\d{2}:?\d{2}$/.test(s) ||
        /[+-]\d{2}$/.test(s);

    const d = new Date(s);
    if (hasTz) return isNaN(d.getTime()) ? null : d;
    if (!isNaN(d.getTime())) {
        // We still want to interpret as Vietnam local time.
    }

    const m = s.match(
        /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?/
    );
    if (!m) return isNaN(d.getTime()) ? null : d;

    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    const hour = Number(m[4]);
    const minute = Number(m[5]);
    const second = m[6] != null ? Number(m[6]) : 0;

    // Backend datetime values are stored/serialized as UTC.
    // When timezone is missing, interpret as UTC.
    const utcMs = Date.UTC(year, month - 1, day, hour, minute, second);
    const instant = new Date(utcMs);
    return isNaN(instant.getTime()) ? null : instant;
};

export const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = parseDateInVietnam(dateString);
        return date.toLocaleString('vi-VN', {
            timeZone: VIETNAM_TZ,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Ngày không hợp lệ';
    }
};

export const formatDate = (dateString, simple = false) => {
    if (!dateString) return 'N/A';
    try {
        const date = parseDateInVietnam(dateString);
        const options = simple
            ? { timeZone: VIETNAM_TZ, month: '2-digit', day: '2-digit' }
            : { timeZone: VIETNAM_TZ, year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('vi-VN', options);
    } catch {
        return 'Ngày không hợp lệ';
    }
};

export const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = parseDateInVietnam(dateString);
        return date.toLocaleString('vi-VN', {
            timeZone: VIETNAM_TZ,
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
    } catch {
        return 'Ngày không hợp lệ';
    }
};
