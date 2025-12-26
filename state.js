export const state = {
    data: JSON.parse(localStorage.getItem('mkt_data')) || [],
    
    save(item) {
        if(item.id) {
            const idx = this.data.findIndex(i => i.id === item.id);
            if (idx !== -1) this.data[idx] = item;
        } else {
            item.id = Date.now().toString();
            this.data.push(item);
        }
        // Ordenar por data
        this.data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        this.persist();
    },
    
    delete(id) {
        this.data = this.data.filter(i => i.id !== id);
        this.persist();
    },
    
    persist() {
        localStorage.setItem('mkt_data', JSON.stringify(this.data));
    },
    
    getTotals() {
        return this.data.reduce((acc, curr) => {
            acc.revenue += parseFloat(curr.revenue) || 0;
            acc.spend += parseFloat(curr.spend) || 0;
            acc.sales += parseInt(curr.sales) || 0;
            acc.checkouts += parseInt(curr.checkouts || 0);
            acc.clicks += parseInt(curr.clicks || 0);
            return acc;
        }, { revenue: 0, spend: 0, sales: 0, checkouts: 0, clicks: 0 });
    },

    import(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if(Array.isArray(imported)) {
                this.data = imported;
                this.persist();
                return true;
            }
            return false;
        } catch (e) {
            console.error("Erro na importação:", e);
            return false;
        }
    }
};
