'use client';

import React from 'react';
import Layout from '@/components/RecipientSidebar';
import SalaryAdvance from '@/components/SalaryAdvance';

function Dashboard() {
  return (
    <Layout>
      <SalaryAdvance />
    </Layout>
  );
}

export default Dashboard;