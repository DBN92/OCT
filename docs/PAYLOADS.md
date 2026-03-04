# Exemplos de Payloads

## 1. Cadastro de Estação
**Endpoint:** `POST /api/stations`

```json
{
  "branch_id": "uuid-da-filial",
  "hostname": "CX-001-SP",
  "serial_number": "SN12345678",
  "asset_tag": "PAT-98765",
  "type": "checkout",
  "tags": ["frente-de-loja", "pdv"],
  "ip_address": "192.168.1.100",
  "operating_system": "Windows 10 IoT"
}
```

## 2. Envio de Telemetria (Heartbeat)
**Endpoint:** `POST /api/telemetry/:station_id`

```json
{
  "cpu_usage": 45.5,
  "ram_usage": 60.2,
  "disk_usage": {
    "total": 500,
    "free": 200,
    "percent": 60
  },
  "smart_data": {
    "status": "OK",
    "temperature": 35
  },
  "network_latency": 15,
  "packet_loss": 0,
  "connected_devices": ["scanner", "printer", "pinpad"],
  "app_versions": {
    "app_vendas": "2.1.0",
    "antivirus": "10.5.2"
  }
}
```

## 3. Cadastro de Monitor de API
**Endpoint:** `POST /api/api-monitors`

```json
{
  "name": "Gateway de Pagamento",
  "url": "https://api.pagamentos.com/health",
  "criticality": "critical",
  "timeout_seconds": 5,
  "scope": "external",
  "is_active": true
}
```

## 4. Evento de Alerta (Gerado Internamente)
**Exemplo de objeto Event:**

```json
{
  "id": "uuid-evento",
  "station_id": "uuid-estacao",
  "branch_id": "uuid-filial",
  "source": "telemetry_agent",
  "type": "health_check_failed",
  "severity": "critical",
  "status": "open",
  "payload": {
    "cpu": 98.5,
    "reason": "CPU critical"
  },
  "correlation_id": "health-check-fail-station-123",
  "created_at": "2025-10-25T14:30:00Z"
}
```
