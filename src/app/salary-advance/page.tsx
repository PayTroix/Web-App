'use client';

import React from 'react';
import Layout from '@/components/recipient-components/RecipientSidebar';
import SalaryAdvance from '@/components/recipient-components/SalaryAdvance';

function Dashboard() {
  return (
    <Layout>
      <SalaryAdvance />
    </Layout>
  );
}

export default Dashboard;