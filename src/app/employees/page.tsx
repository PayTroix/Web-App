'use client';

import React from 'react';
import Layout from '@/components/Sidebar';
import { EmployeesContent } from './_components/EmployeesContent';

function Employees() {
  return (
    <Layout>
      <EmployeesContent />
    </Layout>
  );
}

export default Employees;
