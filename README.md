# MktMetrics Pro

MktMetrics Pro é uma aplicação completa para gestão e análise de métricas de marketing digital. Focada em infoprodutores e gestores de tráfego, ela permite consolidar dados de diversas fontes para visualizar ROI, taxas de conversão e saúde financeira de campanhas.

## Principais Funcionalidades

- **Dashboard Executivo**: Visualização imediata de Receita, ROI, Lucro e Ticket Médio.
- **Gráficos Dinâmicos**: Acompanhamento temporal de Receita vs Investimento e Funil de Vendas.
- **Gestão de Dados**: CRUD (Criação, Leitura, Atualização e Deleção) de períodos de tráfego.
- **Relatório Mensal**: Agrupamento inteligente de dados por mês calendário.
- **Análise de Abandono**: Cálculo automático de desistência no checkout.
- **Modo Escuro/Claro**: Interface adaptável para melhor conforto visual.
- **Backup Local**: Exportação e Importação de dados via JSON.

## Tecnologias Utilizadas

- **HTML5/CSS3**: Estrutura e estilização moderna com variáveis CSS.
- **JavaScript (ES6+)**: Lógica de negócio modular.
- **Chart.js**: Renderização de gráficos de alta performance.
- **LocalStorage**: Persistência de dados local no navegador do usuário.

## Como Executar o Projeto

1.  Certifique-se de que os arquivos estão organizados na seguinte estrutura:
    - `index.html`
    - `css/style.css`
    - `js/app.js`
    - `js/state.js`
    - `js/calculator.js`
    - `js/charts.js`

2.  Como o projeto utiliza **Módulos ES6** (`import/export`), você precisa de um servidor local para rodar. Você pode:
    - Usar a extensão **Live Server** do VS Code.
    - Usar o Python: `python -m http.server` na pasta raiz.
    - Usar o Node.js: `npx serve`.

3.  Abra o navegador no endereço indicado (geralmente `http://localhost:5500` ou `http://localhost:8000`).

## Guia de Uso

1.  **Inserindo Dados**: Vá em "Gerenciar Dados", clique em "+ Novo Período" e preencha as métricas das suas campanhas (ex: de segunda a domingo).
2.  **Análise**: Volte ao Dashboard para ver os gráficos atualizados.
3.  **Fechamento Mensal**: Clique em "Relatório Mensal" para ver quanto cada mês rendeu de forma consolidada.
4.  **Backup**: Use o botão "Exportar Dados" periodicamente para salvar seus registros em um arquivo externo.

## Solução de Problemas

- **Os gráficos não aparecem**: Verifique se você está acessando via `http://` e não abrindo o arquivo `file://` diretamente, pois módulos JS requerem um servidor.
- **Dados sumiram**: Os dados ficam salvos no cache do seu navegador (LocalStorage). Se você limpar os dados do navegador, precisará importar o backup JSON.
