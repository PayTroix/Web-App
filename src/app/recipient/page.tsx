'use client';

import React from 'react';
import Layout from '@/components/recipient-components/RecipientSidebar';
import { RecipientDashboardContent } from './_components';

function RecipientDashboard() {
  return (
    <Layout>
      <RecipientDashboardContent />
    </Layout>
  );
}

export default RecipientDashboard;
