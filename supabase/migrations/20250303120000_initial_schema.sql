-- Branches Table (branches)
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address TEXT,
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    operating_hours JSONB DEFAULT '{"monday":"08:00-18:00","tuesday":"08:00-18:00","wednesday":"08:00-18:00","thursday":"08:00-18:00","friday":"08:00-18:00","saturday":"08:00-14:00","sunday":"closed"}',
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_branches_state ON branches(state);
CREATE INDEX idx_branches_city ON branches(city);
CREATE INDEX idx_branches_is_open ON branches(is_open);

GRANT SELECT ON branches TO anon;
GRANT ALL PRIVILEGES ON branches TO authenticated;

-- Stations Table (stations)
CREATE TABLE stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    hostname VARCHAR(255) UNIQUE NOT NULL,
    serial_number VARCHAR(255),
    asset_tag VARCHAR(255),
    type VARCHAR(50) NOT NULL,
    tags JSONB DEFAULT '[]',
    health_status VARCHAR(20) DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'warning', 'critical', 'offline')),
    last_seen TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    operating_system VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stations_branch_id ON stations(branch_id);
CREATE INDEX idx_stations_health_status ON stations(health_status);
CREATE INDEX idx_stations_last_seen ON stations(last_seen);
CREATE INDEX idx_stations_type ON stations(type);

GRANT SELECT ON stations TO anon;
GRANT ALL PRIVILEGES ON stations TO authenticated;

-- Telemetry Table (telemetry)
CREATE TABLE telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID NOT NULL REFERENCES stations(id),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cpu_usage DECIMAL(5,2) CHECK (cpu_usage >= 0 AND cpu_usage <= 100),
    ram_usage DECIMAL(5,2) CHECK (ram_usage >= 0 AND ram_usage <= 100),
    disk_usage JSONB DEFAULT '{}',
    smart_data JSONB DEFAULT '{}',
    network_latency INTEGER,
    packet_loss DECIMAL(5,2) CHECK (packet_loss >= 0 AND packet_loss <= 100),
    connected_devices JSONB DEFAULT '[]',
    app_versions JSONB DEFAULT '{}'
);

CREATE INDEX idx_telemetry_station_id ON telemetry(station_id);
CREATE INDEX idx_telemetry_recorded_at ON telemetry(recorded_at DESC);
CREATE INDEX idx_telemetry_station_recorded ON telemetry(station_id, recorded_at DESC);

GRANT SELECT ON telemetry TO anon;
GRANT ALL PRIVILEGES ON telemetry TO authenticated;

-- API Monitors Table (api_monitors)
CREATE TABLE api_monitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    criticality VARCHAR(20) DEFAULT 'medium' CHECK (criticality IN ('low', 'medium', 'high', 'critical')),
    timeout_seconds INTEGER DEFAULT 30,
    scope VARCHAR(50) DEFAULT 'internal',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_api_monitors_criticality ON api_monitors(criticality);
CREATE INDEX idx_api_monitors_is_active ON api_monitors(is_active);

GRANT SELECT ON api_monitors TO anon;
GRANT ALL PRIVILEGES ON api_monitors TO authenticated;

-- Events Table (events)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID REFERENCES stations(id),
    branch_id UUID REFERENCES branches(id),
    source VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved')),
    payload JSONB DEFAULT '{}',
    correlation_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_station_id ON events(station_id);
CREATE INDEX idx_events_branch_id ON events(branch_id);
CREATE INDEX idx_events_severity ON events(severity);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_correlation ON events(correlation_id);

GRANT SELECT ON events TO anon;
GRANT ALL PRIVILEGES ON events TO authenticated;
