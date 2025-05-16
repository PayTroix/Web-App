'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine, TooltipProps } from 'recharts';
import { useState } from 'react';

// Define the chart data
const chartData = [
  { name: '12/24', payroll: 40 },
  { name: '01/25', payroll: 25 },
  { name: '02/25', payroll: 55 },
  { name: '03/25', payroll: 35 },
  { name: '04/25', payroll: 45 },
  { name: '05/25', payroll: 15 },
  { name: '06/25', payroll: 30 },
  { name: '07/25', payroll: 65 },
  { name: '08/25', payroll: 45 },
  { name: '09/25', payroll: 70 },
  { name: '10/25', payroll: 55 },
];

type DotProps = {
  cx: number;
  cy: number;
  index: number;
  key?: string | number;
  value?: number;
  dataKey?: string;
  payload?: { name: string; payroll: number };
  points?: Array<{ x: number; y: number }>;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded text-center">
        Payroll<br/>{payload[0].value}
      </div>
    );
  }
  return null;
};

const LiveLineChart = () => {
  const [activeDataIndex, setActiveDataIndex] = useState<number | null>(4);

  const CustomizedDot = ({ cx, cy, index }: Omit<DotProps, 'key'>) => {
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={index === activeDataIndex ? 6 : 4} 
        fill="#3b82f6"
        stroke="white"
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-20">
        <div className="flex items-center">
          <h2 className="text-white text-lg font-medium">Annual Payroll Reports</h2>
          <span className="ml-2 text-blue-500 text-sm">2024-2025</span>
        </div>
        <button className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <LineChart 
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
          onMouseMove={(e) => {
            if (e.activeTooltipIndex !== undefined) {
              setActiveDataIndex(e.activeTooltipIndex);
            }
          }}
        >
          <defs>
            <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid stroke="#2C2C2C" vertical={false} />
          
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 10 }}
            tickMargin={10}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickCount={6}
            domain={[0, 100]}
            tick={{ fill: '#6B7280', fontSize: 10 }}
            tickFormatter={(value) => `${value}`}
          />
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={false}
          />
          
          {activeDataIndex !== null && (
            <ReferenceLine 
              x={chartData[activeDataIndex].name} 
              stroke="#3b82f6" 
              strokeDasharray="5 5"
            />
          )}
          
          <Line 
              type="monotone" 
              dataKey="payroll" 
              stroke="#3b82f6" 
              strokeWidth={3}
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
              dot={(props: DotProps) => {
                const { key, ...restProps } = props;
                return <CustomizedDot key={key} {...restProps} />;
              }}
              isAnimationActive={true}
            />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveLineChart;
