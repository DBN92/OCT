/**
 * local server entry file, for local development
 */
import app from './app.js';
import { ApiMonitorService } from './services/api_monitor.service.ts';

/**
 * start server with port
 */
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
  
  // Start scheduled tasks
  const monitorService = new ApiMonitorService();
  console.log('Starting API Monitor scheduler...');
  setInterval(() => {
    monitorService.checkAll().catch(err => console.error('Scheduled API check failed:', err));
  }, 60000); // 1 minute
});

/**
 * close server
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;