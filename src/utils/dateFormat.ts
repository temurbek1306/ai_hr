/**
 * Sana formatlash helper - barcha sana ko'rsatishlarda ishlating
 */
export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return '—';
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return String(date);
        const months = [
            'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
            'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
        ];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day} ${month} ${year}, ${hours}:${minutes}`;
    } catch {
        return String(date);
    }
};

export const formatDateShort = (date: string | Date | null | undefined): string => {
    if (!date) return '—';
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return String(date);
        const months = [
            'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn',
            'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'
        ];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
        return String(date);
    }
};

export const formatRelative = (date: string | Date | null | undefined): string => {
    if (!date) return '—';
    try {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHour = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);
        if (diffMin < 1) return 'Hozirgina';
        if (diffMin < 60) return `${diffMin} daqiqa oldin`;
        if (diffHour < 24) return `${diffHour} soat oldin`;
        if (diffDay < 7) return `${diffDay} kun oldin`;
        return formatDateShort(date);
    } catch {
        return String(date);
    }
};
