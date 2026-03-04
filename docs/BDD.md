# Critérios de Aceite (BDD)

## Funcionalidade: Monitoramento de Saúde da Estação

### Cenário: Estação saudável enviando telemetria
**Dado** que a estação "EST-001" está registrada e ativa
**Quando** a estação envia um payload de telemetria com CPU em 40% e RAM em 50%
**Então** o sistema deve registrar a telemetria com sucesso
**E** o status de saúde da estação deve ser atualizado para "healthy"
**E** nenhum evento de alerta deve ser gerado

### Cenário: Estação com uso crítico de recursos
**Dado** que a estação "EST-002" está registrada
**Quando** a estação envia um payload de telemetria com CPU em 98%
**Então** o sistema deve registrar a telemetria
**E** o status de saúde da estação deve ser atualizado para "critical"
**E** um evento do tipo "health_check_failed" deve ser criado com severidade "critical"
**E** um chamado deve ser aberto automaticamente no ITSM

## Funcionalidade: Monitoramento de API

### Cenário: API Crítica Indisponível
**Dado** que a API "Gateway de Pagamento" está cadastrada como crítica
**Quando** o monitor verifica a disponibilidade e recebe status 500
**Então** um registro de check deve ser criado com sucesso=false
**E** se for a 3ª falha consecutiva (simulado), um evento crítico deve ser gerado
**E** um alerta deve ser exibido no dashboard principal

## Funcionalidade: Silenciamento de Alertas em Horário Fechado

### Cenário: Estação offline fora do horário de funcionamento
**Dado** que a filial "Filial Centro" tem horário de funcionamento das 08:00 às 18:00
**E** o horário atual é 22:00 (loja fechada)
**Quando** a estação "CX-01" da filial deixa de enviar heartbeat por 15 minutos
**Então** o status da estação muda para "offline"
**Mas** o evento gerado deve ter severidade "info" ou ser silenciado
**E** nenhum chamado deve ser aberto no ITSM
