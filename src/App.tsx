
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import BranchList from './pages/BranchList';
import BranchDashboard from './pages/BranchDashboard';
import StationsList from './pages/StationsList';
import StationDetails from './pages/StationDetails';
import ApiMonitoring from './pages/ApiMonitoring';
import Events from './pages/Events';
import Settings from './pages/Settings';
import ChaosDashboard from './pages/ChaosDashboard';

const App = () => {
  return (
    <>
      <Toaster 
        position="top-right"
        containerStyle={{
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
            zIndex: 99999,
          },
        }}
      />
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="branches" element={<BranchList />} />
          <Route path="branches/:id" element={<BranchDashboard />} />
          <Route path="stations" element={<StationsList />} />
          <Route path="stations/:id" element={<StationDetails />} />
          <Route path="api-monitoring" element={<ApiMonitoring />} />
          <Route path="events" element={<Events />} />
          <Route path="settings" element={<Settings />} />
          <Route path="chaos" element={<ChaosDashboard />} />
          <Route path="*" element={<div className="p-6">404 - Not Found</div>} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
