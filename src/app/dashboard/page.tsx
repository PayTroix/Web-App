'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Sidebar';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const DashboardContent = dynamic(
  () => import('@/components/dashboard/dashboardContent'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

function Dashboard() {
  return (
    <Layout>
      <DashboardContent />
    </Layout>
  );
}

export default Dashboard;