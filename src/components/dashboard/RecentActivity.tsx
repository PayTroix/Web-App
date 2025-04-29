import React from 'react';
import Link from 'next/link';

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-black border border-[#2C2C2C] rounded-lg p-6 col-span-2">
      <h2 className="text-white text-lg font-medium mb-6">Recent Activity</h2>
      
      <div className="space-y-6">
        {activities.length > 0 ? (
          activities.map(activity => (
            <div key={activity.id} className="flex gap-4">
              {activity.icon}
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