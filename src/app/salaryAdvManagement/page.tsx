'use client';

import React from 'react';
import Layout from '@/components/Sidebar';
import SalaryAdvManagement from '@/components/dashboard/SalaryAdvManagement';

function Employees() {
  return (
    <Layout>
     <SalaryAdvManagement/>
    </Layout>
  );
}

export default Employees;
