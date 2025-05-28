import React from 'react';
import Link from 'next/link';

// Define standard notification types and their icons
const NotificationIcons = {
  RECIPIENT_ADDED: (
    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    </div>
  ),
  RECIPIENT_REMOVED: (
    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    </div>
  ),
  ORGANIZATION_RELATED: (
    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    </div>
  ),
  PAYROLL_RELATED: (
    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    </div>
  ),
  LOGIN: (
    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    </div>
  ),
  DEFAULT: (
    <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    </div>
  )
};

const getIconByType = (type: string): React.ReactNode => {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes('recipient') && normalizedType.includes('add')) {
    return NotificationIcons.RECIPIENT_ADDED;
  }
  if (normalizedType.includes('recipient') && normalizedType.includes('remove')) {
    return NotificationIcons.RECIPIENT_REMOVED;
  }
  if (normalizedType.includes('organization')) {
    return NotificationIcons.ORGANIZATION_RELATED;
  }
  if (normalizedType.includes('payroll')) {
    return NotificationIcons.PAYROLL_RELATED;
  }
  if (normalizedType.includes('login')) {
    return NotificationIcons.LOGIN;
  }
  return NotificationIcons.DEFAULT;
};

interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
  icon?: React.ReactNode; // Make icon optional
}

interface RecentActivityProps {
  activities?: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [] }) => {
  return (
    <div className="bg-black border border-[#2C2C2C] rounded-lg p-6 col-span-2">
      <h2 className="text-white text-lg font-medium mb-6">Recent Activity</h2>

      <div className="space-y-6">
        {activities.length > 0 ? (
          activities.map(activity => (
            <div key={activity.id} className="flex gap-4">
              {activity.icon || getIconByType(activity.type)}
              <div>
                <h3 className="text-white text-sm font-medium">{activity.type}</h3>
                <p className="text-gray-400 text-sm">{activity.message}</p>
                <span className="text-gray-500 text-xs">{activity.time}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No recent activities</p>
        )}
      </div>

      <div className="mt-6 pt-4">
        <Link href="/activity" className="text-blue-500 text-sm flex items-center">
          View all activity
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default RecentActivity;