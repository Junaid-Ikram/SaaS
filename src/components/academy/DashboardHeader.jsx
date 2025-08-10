import React from 'react';

const DashboardHeader = ({ academyData }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{academyData.name}</h1>
          <p className="text-sm text-gray-500">Academy ID: {academyData.id} • Created on {new Date(academyData.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {academyData.subscription.plan} Plan
          </span>
          <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;