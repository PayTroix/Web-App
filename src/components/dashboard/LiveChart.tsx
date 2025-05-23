'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine, TooltipProps } from 'recharts';
import { useState, useEffect } from 'react';
import { payrollService } from '@/services/api';
import { getToken } from '@/utils/token';
import { ethers } from 'ethers';

interface MonthlyData {
  name: string;
  payroll: number;
}

interface Payroll {
  amount: string;
  date: string;
  // ...other fields
}

// Generate empty data for months with no payroll
const generateEmptyData = (): MonthlyData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    name: month,
    payroll: 0
  }));
};

const formatPayrollData = (payrolls: Payroll[]): MonthlyData[] => {
  const emptyData = generateEmptyData();

  if (!payrolls || payrolls.length === 0) {
    return emptyData;
  }

  // Create a map to store total payroll by month
  const monthlyTotals = new Map<number, number>();

  // Calculate total payroll for each month
  payrolls.forEach(payroll => {
    const date = new Date(payroll.date);
    const month = date.getMonth(); // 0-11
    // Format amount using ethers.formatUnits with 6 decimals
    const amount = parseFloat(ethers.formatUnits(payroll.amount, 6));

    if (!isNaN(amount)) {
      const currentTotal = monthlyTotals.get(month) || 0;
      monthlyTotals.set(month, currentTotal + amount);
    }
  });

  // Merge payroll data with empty months
  return emptyData.map((item, index) => ({
    name: item.name,
    payroll: monthlyTotals.get(index) || 0
  }));
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const value = payload[0].value as number;
    return (
      <div className="bg-blue-600 text-white text-xs px-3 py-2 rounded shadow-lg">
        <p className="font-medium">Payroll Amount</p>
        <p className="text-sm">{value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} USDT</p>
      </div>
    );
  }
  return null;
};

const CustomizedDot = ({ cx, cy, index, isActive }: { cx: number; cy: number; index: number; isActive: boolean }) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isActive ? 6 : 4}
      fill="#3b82f6"
      stroke="white"
      strokeWidth={2}
    />
  );
};

const LoadingState = () => (
  <div className="h-[280px] flex items-center justify-center">
    <div className="text-gray-400">Loading chart data...</div>
  </div>
);

const ErrorState = () => (
  <div className="h-[280px] flex items-center justify-center">
    <div className="text-red-400">Failed to load chart data</div>
  </div>
);

const EmptyState = () => (
  <div className="h-[280px] flex items-center justify-center">
    <div className="text-gray-400">No payroll data available</div>
  </div>
);

interface DotProps {
  cx: number;
  cy: number;
  index: number;
  payload: MonthlyData;
  stroke: string;
  strokeWidth: number;
  fill: string;
  value: number;
}

const LiveLineChart = () => {
  const [activeDataIndex, setActiveDataIndex] = useState<number | null>(null);
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get all payrolls
        const payrolls = await payrollService.listPayrolls(token);

        // Filter payrolls for current year
        const currentYearPayrolls = payrolls.filter(payroll => {
          const payrollYear = new Date(payroll.date).getFullYear();
          return payrollYear === currentYear;
        });

        const formattedData = formatPayrollData(currentYearPayrolls);
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
        setError('Failed to load payroll data');
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [currentYear]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (chartData.length === 0 || chartData.every(item => item.payroll === 0)) {
    return <EmptyState />;
  }

  const maxPayroll = Math.max(...chartData.map(item => item.payroll));
  const yAxisDomain = [0, Math.ceil(maxPayroll * 1.2)]; // Add 20% padding to max value

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-white text-lg font-medium">Annual Payroll Reports</h2>
          <span className="ml-2 text-blue-500 text-sm">{currentYear}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
          onMouseMove={(e) => {
            setActiveDataIndex(e.activeTooltipIndex ?? null);
          }}
          onMouseLeave={() => setActiveDataIndex(null)}
        >
          <defs>
            <linearGradient id="colorPayroll" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
            domain={yAxisDomain}
            tick={{ fill: '#6B7280', fontSize: 10 }}
            tickFormatter={(value) => value.toLocaleString()}
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
            dot={(props: DotProps) => (
              <CustomizedDot
                {...props}
                isActive={props.index === activeDataIndex}
              />
            )}
            activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveLineChart;
