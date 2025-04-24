'use client';

import React from 'react';
import Layout from '@/components/Sidebar';
import { DashboardContent } from '@/components/dashboard/dashboardContent';

function Dashboard() {
  return (
    <Layout>
      <DashboardContent />
    </Layout>
  );
}

export default Dashboard;