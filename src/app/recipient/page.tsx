'use client';

import React from 'react';
import Layout from '@/components/RecipientSidebar';


function RecipientDashboard() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Welcome to your dashboard</p>
      </div>
    </Layout>
  );
}

export default RecipientDashboard;