# OCT - OpsControl Tower

Sistema de monitoramento e gestão de estações de trabalho e filiais.

## 🚀 Features Recentes

### 1. Monitoramento em Tempo Real
- Dashboard interativo com mapa de filiais (Leaflet)
- Status de saúde das estações (Online, Warning, Critical, Offline)
- Métricas de performance (CPU, RAM, Disco, Rede)

### 2. Panic Mode (Simulação de Desastre)
- Botão de pânico global para simular queda massiva de agentes
- Feedback visual imediato em todas as telas
- Interceptação de chamadas de API para simular falhas de rede

### 3. Relatórios Gerenciais
- Dashboard de métricas históricas
- Gráficos de disponibilidade (Uptime)
- Análise de incidentes por categoria

### 4. Design System Enterprise
- Interface moderna e profissional
- Modo Dark/Light (preparado)
- Componentes reutilizáveis (Cards, Badges, Tabelas)

## 🛠️ Stack Tecnológico

- **Frontend**: React + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Gráficos**: Recharts
- **Mapas**: React Leaflet
- **Notificações**: React Hot Toast
- **Ícones**: Lucide React

## 📦 Como Rodar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   # ou
   pnpm install
   ```
3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
