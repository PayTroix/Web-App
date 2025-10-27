'use client';

import React from 'react';
import Layout from '@/components/Sidebar';
import { DashboardContent } from './_components/DashboardContent';

function Dashboard() {
  return (
    <Layout>
      <DashboardContent />
    </Layout>
  );
}

export default Dashboard;