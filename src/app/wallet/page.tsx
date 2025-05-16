'use client';

import React from 'react';
import Layout from '@/components/recipient-components/RecipientSidebar';
import WalletDashboard from '@/components/recipient-components/RecipientWallet';

function Dashboard() {
  return (
    <Layout>
        <WalletDashboard />
    </Layout>
  );
}

export default Dashboard;