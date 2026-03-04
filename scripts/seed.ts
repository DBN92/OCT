
import { supabase } from '../api/config/supabase';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('Starting seed process...');

  try {
    // Clear existing data (optional, but good for idempotent runs)
    console.log('Cleaning up existing data...');
    const { error: eventError } = await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (eventError) console.warn('Error clearing events:', eventError.message);

    const { error: telError } = await supabase.from('telemetry').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (telError) console.warn('Error clearing telemetry:', telError.message);

    const { error: stationError } = await supabase.from('stations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (stationError) console.warn('Error clearing stations:', stationError.message);
    
    const { error: branchError } = await supabase.from('branches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (branchError) console.warn('Error clearing branches:', branchError.message);

    const { error: apiError } = await supabase.from('api_monitors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (apiError) console.warn('Error clearing api_monitors:', apiError.message);


    // 1. Create Branches
    console.log('Creating branches...');
    const branches = [
      {
        name: 'Matriz - São Paulo',
        state: 'SP',
        city: 'São Paulo',
        address: 'Av. Paulista, 1000',
        timezone: 'America/Sao_Paulo',
        is_open: true,
        operating_hours: { monday: '08:00-18:00', tuesday: '08:00-18:00', wednesday: '08:00-18:00', thursday: '08:00-18:00', friday: '08:00-18:00', saturday: '08:00-14:00', sunday: 'closed' }
      },
      {
        name: 'Filial - Rio de Janeiro',
        state: 'RJ',
        city: 'Rio de Janeiro',
        address: 'Av. Atlântica, 500',
        timezone: 'America/Sao_Paulo',
        is_open: true,
        operating_hours: { monday: '09:00-19:00', tuesday: '09:00-19:00', wednesday: '09:00-19:00', thursday: '09:00-19:00', friday: '09:00-19:00', saturday: 'closed', sunday: 'closed' }
      },
      {
        name: 'Filial - Curitiba',
        state: 'PR',
        city: 'Curitiba',
        address: 'Rua XV de Novembro, 200',
        timezone: 'America/Sao_Paulo',
        is_open: true,
        operating_hours: { monday: '08:30-17:30', tuesday: '08:30-17:30', wednesday: '08:30-17:30', thursday: '08:30-17:30', friday: '08:30-17:30', saturday: '09:00-13:00', sunday: 'closed' }
      }
    ];

    const { data: createdBranches, error: branchCreateError } = await supabase
      .from('branches')
      .insert(branches)
      .select();

    if (branchCreateError) throw branchCreateError;
    console.log(`Created ${createdBranches.length} branches.`);

    // 2. Create Stations
    console.log('Creating stations...');
    const stations = [];
    const stationTypes = ['desktop', 'laptop', 'kiosk'];
    const healthStatuses = ['healthy', 'healthy', 'healthy', 'warning', 'critical', 'offline'];
    
    for (const branch of createdBranches) {
      for (let i = 1; i <= 5; i++) {
        const type = stationTypes[Math.floor(Math.random() * stationTypes.length)];
        const status = healthStatuses[Math.floor(Math.random() * healthStatuses.length)];
        
        stations.push({
          branch_id: branch.id,
          hostname: `${branch.city.substring(0, 3).toUpperCase()}-${type.substring(0, 3).toUpperCase()}-${i.toString().padStart(3, '0')}`,
          serial_number: uuidv4().substring(0, 12).toUpperCase(),
          asset_tag: `PAT-${uuidv4().substring(0, 8).toUpperCase()}`,
          type: type,
          tags: ['sales', 'front-desk'],
          health_status: status,
          last_seen: new Date().toISOString(),
          ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          operating_system: 'Windows 11 Pro'
        });
      }
    }

    const { data: createdStations, error: stationCreateError } = await supabase
      .from('stations')
      .insert(stations)
      .select();

    if (stationCreateError) throw stationCreateError;
    console.log(`Created ${createdStations.length} stations.`);

    // 3. Create Telemetry (for healthy stations)
    console.log('Creating telemetry...');
    const telemetryEntries = [];
    
    for (const station of createdStations) {
      if (station.health_status !== 'offline') {
        // Randomly simulate missing components for warning/critical stations
        let connectedDevices = ['mouse', 'keyboard', 'printer', 'scanner'];
        
        if (station.health_status === 'warning' || station.health_status === 'critical') {
           // Remove random devices to simulate issues
           connectedDevices = connectedDevices.filter(() => Math.random() > 0.3);
        }

        telemetryEntries.push({
          station_id: station.id,
          recorded_at: new Date().toISOString(),
          cpu_usage: Math.floor(Math.random() * 60) + 10,
          ram_usage: Math.floor(Math.random() * 70) + 20,
          disk_usage: { c_drive: { total: 500, used: 250, free: 250 } },
          smart_data: { status: 'OK' },
          network_latency: Math.floor(Math.random() * 50) + 5,
          packet_loss: 0,
          connected_devices: connectedDevices,
          app_versions: { chrome: '120.0.6099.109', agent: '1.0.0' }
        });
      }
    }

    const { error: telCreateError } = await supabase
      .from('telemetry')
      .insert(telemetryEntries);

    if (telCreateError) throw telCreateError;
    console.log(`Created ${telemetryEntries.length} telemetry entries.`);

    // 4. Create API Monitors
    console.log('Creating API monitors...');
    const apiMonitors = [
      {
        name: 'ITSM Gateway',
        url: 'https://api.itsm-provider.com/health',
        criticality: 'critical',
        timeout_seconds: 30,
        scope: 'external',
        is_active: true
      },
      {
        name: 'ERP Integration',
        url: 'https://erp.internal/api/ping',
        criticality: 'high',
        timeout_seconds: 10,
        scope: 'internal',
        is_active: true
      },
      {
        name: 'Holiday API',
        url: 'https://brasilapi.com.br/api/feriados/v1/2024',
        criticality: 'low',
        timeout_seconds: 60,
        scope: 'external',
        is_active: true
      }
    ];

    const { error: apiCreateError } = await supabase
      .from('api_monitors')
      .insert(apiMonitors);

    if (apiCreateError) throw apiCreateError;
    console.log('Created API monitors.');

    // 5. Create Events
    console.log('Creating events...');
    const events = [];
    const criticalStations = createdStations.filter(s => s.health_status === 'critical');
    
    for (const station of criticalStations) {
      events.push({
        station_id: station.id,
        branch_id: station.branch_id,
        source: 'agent',
        type: 'high_cpu_usage',
        severity: 'critical',
        status: 'open',
        payload: { cpu: 95, threshold: 90 },
        correlation_id: uuidv4()
      });
    }

    if (events.length > 0) {
      const { error: eventCreateError } = await supabase
        .from('events')
        .insert(events);
      
      if (eventCreateError) throw eventCreateError;
      console.log(`Created ${events.length} events.`);
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  }
}

seed();
