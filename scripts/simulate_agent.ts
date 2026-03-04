import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const stationData = {
  branch_id: 'uuid-of-branch', // You need to create a branch first and put ID here, or script creates one
  hostname: `SIMULATED-AGENT-${Date.now()}`,
  type: 'checkout',
  health_status: 'healthy'
};

async function main() {
  try {
    // 1. Get or Create Branch (Simplified: assume one exists or create one)
    console.log('Fetching branches...');
    let branches = (await axios.get(`${API_URL}/branches`)).data;
    
    let branchId;
    if (branches.length === 0) {
      console.log('No branches found. Creating one...');
      const branch = await axios.post(`${API_URL}/branches`, {
        name: 'Filial Simulação',
        state: 'SP',
        city: 'São Paulo',
        timezone: 'America/Sao_Paulo',
        is_open: true
      });
      branchId = branch.data.id;
    } else {
      branchId = branches[0].id;
    }

    // 2. Create Station
    console.log(`Registering station linked to branch ${branchId}...`);
    const station = await axios.post(`${API_URL}/stations`, {
      ...stationData,
      branch_id: branchId
    });
    const stationId = station.data.id;
    console.log(`Station registered with ID: ${stationId}`);

    // 3. Send Telemetry Loop
    console.log('Starting telemetry loop...');
    let counter = 0;
    setInterval(async () => {
      counter++;
      const cpu = 30 + Math.random() * 20; // Random CPU 30-50%
      const ram = 40 + Math.random() * 10;
      
      const payload = {
        cpu_usage: cpu,
        ram_usage: ram,
        disk_usage: { total: 500, free: 200 },
        smart_data: { status: 'OK' },
        network_latency: Math.floor(Math.random() * 50),
        packet_loss: 0,
        connected_devices: ['scanner'],
        app_versions: { v: '1.0' }
      };

      try {
        await axios.post(`${API_URL}/telemetry/${stationId}`, payload);
        console.log(`[${counter}] Telemetry sent: CPU=${cpu.toFixed(1)}%`);
      } catch (err: any) {
        console.error('Failed to send telemetry:', err.message);
      }
    }, 5000);

  } catch (error: any) {
    console.error('Simulation failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

main();
