-- API Checks Table (api_checks)
CREATE TABLE api_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_id UUID NOT NULL REFERENCES api_monitors(id) ON DELETE CASCADE,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_ok BOOLEAN NOT NULL,
    status_code INTEGER,
    latency_ms INTEGER,
    error_message TEXT
);

CREATE INDEX idx_api_checks_api_id ON api_checks(api_id);
CREATE INDEX idx_api_checks_checked_at ON api_checks(checked_at DESC);
CREATE INDEX idx_api_checks_api_checked ON api_checks(api_id, checked_at DESC);

GRANT SELECT ON api_checks TO anon;
GRANT ALL PRIVILEGES ON api_checks TO authenticated;

-- Tickets Table (tickets)
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    itsm_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(20) DEFAULT 'medium',
    responsible_team VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_itsm_id ON tickets(itsm_id);
CREATE INDEX idx_tickets_status ON tickets(status);

GRANT SELECT ON tickets TO anon;
GRANT ALL PRIVILEGES ON tickets TO authenticated;
