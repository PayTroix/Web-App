'use client';

import React from 'react';
import Layout from '@/components/recipient-components/RecipientSidebar';
import { WalletContent } from './_components';

function Dashboard() {
  return (
    <Layout>
      <WalletContent />
    </Layout>
  );
}

export default Dashboard;