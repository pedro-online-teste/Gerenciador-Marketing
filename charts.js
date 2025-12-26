export const chartManager = {
    main: null,
    conv: null,

    init(data) {
        this.update(data);
    },

    update(data) {
        const labels = data.map(d => d.startDate);
        const revenues = data.map(d => parseFloat(d.revenue));
        const spends = data.map(d => parseFloat(d.spend));
        const convs = data.map(d => {
            const s = parseInt(d.sales) || 0;
            const c = parseInt(d.clicks) || 0;
            return c > 0 ? ((s / c) * 100).toFixed(2) : 0;
        });

        this.renderMainChart(labels, revenues, spends);
        this.renderConvChart(labels, convs);
    },

    renderMainChart(labels, revenues, spends) {
        const ctx = document.getElementById('mainChart').getContext('2d');
        if (this.main) this.main.destroy();

        this.main = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Receita',
                        data: revenues,
                        borderColor: '#4361ee',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Investimento',
                        data: spends,
                        borderColor: '#ee5d50',
                        backgroundColor: 'rgba(238, 93, 80, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    },

    renderConvChart(labels, convData) {
        const ctx = document.getElementById('convChart').getContext('2d');
        if (this.conv) this.conv.destroy();

        this.conv = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Taxa de Conversão (%)',
                    data: convData,
                    backgroundColor: '#05cd99',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        ticks: { callback: value => value + '%' }
                    }
                }
            }
        });
    }
};
