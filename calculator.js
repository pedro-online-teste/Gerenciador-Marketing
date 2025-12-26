export const calculator = {
    profit: (rev, spend) => {
        const r = parseFloat(rev) || 0;
        const s = parseFloat(spend) || 0;
        return r - s;
    },
    
    roi: (rev, spend) => {
        const r = parseFloat(rev) || 0;
        const s = parseFloat(spend) || 0;
        if (s <= 0) return r > 0 ? "∞" : "0.00";
        return (r / s).toFixed(2);
    },
    
    cac: (spend, sales) => {
        const s = parseFloat(spend) || 0;
        const q = parseInt(sales) || 0;
        if (q <= 0) return "0.00";
        return (s / q).toFixed(2);
    },
    
    conv: (sales, clicks) => {
        const s = parseInt(sales) || 0;
        const c = parseInt(clicks) || 0;
        if (c <= 0) return "0.00";
        return ((s / c) * 100).toFixed(2);
    },
    
    ticket: (rev, sales) => {
        const r = parseFloat(rev) || 0;
        const q = parseInt(sales) || 0;
        if (q <= 0) return "0.00";
        return (r / q).toFixed(2);
    },
    
    abandonmentRate: (checkouts, sales) => {
        const c = parseInt(checkouts) || 0;
        const s = parseInt(sales) || 0;
        if (c <= 0) return "0.00";
        const diff = Math.max(0, c - s);
        return ((diff / c) * 100).toFixed(2);
    },
    
    unfinishedCount: (checkouts, sales) => {
        const c = parseInt(checkouts) || 0;
        const s = parseInt(sales) || 0;
        return Math.max(0, c - s);
    }
};
