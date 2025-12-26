import { state } from './state.js';
import { calculator } from './calculator.js';
import { chartManager } from './charts.js';

const ui = {
    views: document.querySelectorAll('.view-section'),
    navBtns: document.querySelectorAll('.nav-btn'),
    viewTitle: document.getElementById('view-title'),
    table: document.getElementById('table-body'),
    form: document.getElementById('metrics-form'),
    modal: document.getElementById('modal-form'),
    reportGrid: document.getElementById('report-grid'),
    themeToggle: document.getElementById('theme-toggle'),
    importInput: document.getElementById('import-json')
};

// --- Navegação ---
ui.navBtns.forEach(btn => {
    btn.onclick = () => {
        const viewId = btn.dataset.view;
        
        ui.navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        ui.views.forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');
        
        ui.viewTitle.innerText = btn.innerText.replace(/[^\w\s]/gi, '').trim();
        
        if(viewId === 'report') renderReport();
        if(viewId === 'dashboard') chartManager.update(state.data);
    };
});


// --- UI Updates ---
function refreshUI() {
    renderTable();
    updateKPIs();
    chartManager.update(state.data);
}

function updateKPIs() {
    const t = state.getTotals();
    
    document.getElementById('kpi-revenue').innerText = t.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('kpi-spend').innerText = t.spend.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('kpi-roi').innerText = `${calculator.roi(t.revenue, t.spend)}x`;
    document.getElementById('kpi-profit').innerText = calculator.profit(t.revenue, t.spend).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('kpi-ticket').innerText = `R$ ${calculator.ticket(t.revenue, t.sales)}`;
    document.getElementById('kpi-conv').innerText = `${calculator.conv(t.sales, t.clicks)}%`;
}

function renderTable() {
    ui.table.innerHTML = state.data.map(item => `
        <tr>
            <td>${new Date(item.startDate).toLocaleDateString('pt-BR')}</td>
            <td>${new Date(item.endDate).toLocaleDateString('pt-BR')}</td>
            <td>R$ ${parseFloat(item.revenue).toFixed(2)}</td>
            <td>R$ ${parseFloat(item.spend).toFixed(2)}</td>
            <td>${item.sales}</td>
            <td style="font-weight: bold; color: var(--primary)">${calculator.roi(item.revenue, item.spend)}x</td>
            <td>
                <button class="btn-delete" onclick="window.deleteItem('${item.id}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function renderReport() {
    const months = {};
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    state.data.forEach(d => {
        const date = new Date(d.startDate);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        
        if(!months[key]) months[key] = { label, rev: 0, spend: 0, sales: 0, checkouts: 0, clicks: 0 };
        
        months[key].rev += parseFloat(d.revenue) || 0;
        months[key].spend += parseFloat(d.spend) || 0;
        months[key].sales += parseInt(d.sales) || 0;
        months[key].checkouts += parseInt(d.checkouts || 0);
        months[key].clicks += parseInt(d.clicks || 0);
    });

    ui.reportGrid.innerHTML = Object.entries(months).map(([k, data]) => `
        <div class="report-card">
            <h3>${data.label}</h3>
            <div class="report-item"><span>Receita Total:</span> <b>R$ ${data.rev.toFixed(2)}</b></div>
            <div class="report-item"><span>Investimento:</span> <b>R$ ${data.spend.toFixed(2)}</b></div>
            <div class="report-item"><span>Lucro Líquido:</span> <b>R$ ${(data.rev - data.spend).toFixed(2)}</b></div>
            <div class="report-item"><span>Vendas:</span> <b>${data.sales}</b></div>
            <div class="report-item"><span>Taxa Conv:</span> <b>${calculator.conv(data.sales, data.clicks)}%</b></div>
            <div class="report-item"><span>Abandono:</span> <b style="color: var(--danger)">${calculator.abandonmentRate(data.checkouts, data.sales)}%</b></div>
            <div class="report-item"><span>ROI Mensal:</span> <b style="color: var(--primary)">${calculator.roi(data.rev, data.spend)}x</b></div>
        </div>
    `).join('');
}

// --- Eventos ---

// Modal Control
document.getElementById('btn-new').onclick = () => ui.modal.classList.add('active');
document.querySelectorAll('.btn-close').forEach(b => b.onclick = () => ui.modal.classList.remove('active'));

// Form Submission
ui.form.onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(ui.form);
    const item = Object.fromEntries(fd);
    state.save(item);
    ui.modal.classList.remove('active');
    ui.form.reset();
    refreshUI();
};

// Delete
window.deleteItem = (id) => {
    if(confirm('Tem certeza que deseja excluir este período?')) {
        state.delete(id);
        refreshUI();
    }
};

// Theme
ui.themeToggle.onchange = (e) => {
    document.body.className = e.target.checked ? 'dark-theme' : 'light-theme';
};

// Export/Import
document.getElementById('export-json').onclick = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mkt_metrics_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

document.getElementById('import-trigger').onclick = () => ui.importInput.click();

ui.importInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        if(state.import(e.target.result)) {
            alert('Dados importados com sucesso!');
            refreshUI();
        } else {
            alert('Erro ao importar arquivo. Verifique o formato.');
        }
    };
    reader.readAsText(file);
};

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!menuToggle || !sidebar || !overlay) return;

    function openMenu() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }

    function closeMenu() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    menuToggle.addEventListener('click', () => {
        sidebar.classList.contains('active') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
});

// Inicialização
refreshUI();
