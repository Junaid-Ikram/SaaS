import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaFilter, FaDownload, FaShoppingCart } from 'react-icons/fa';

const PLANS = [
  { id: 'basic', name: 'Basic', amount: 100, price: '$49.99', accent: 'green' },
  { id: 'standard', name: 'Standard', amount: 250, price: '$99.99', accent: 'blue' },
  { id: 'pro', name: 'Professional', amount: 500, price: '$189.99', accent: 'purple' },
];

const accentClass = {
  green: {
    badge: 'bg-green-100 text-green-800',
    button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  },
  blue: {
    badge: 'bg-blue-100 text-blue-800',
    button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  },
  purple: {
    badge: 'bg-purple-100 text-purple-800',
    button: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
  },
};

const planFeatures = (amount) => [
  `${amount} minutes of class time`,
  'Supports up to 100 participants',
  'Recording included',
  'Priority support',
];

const ZoomCreditsTab = ({ zoomCredits, onPurchaseCredits }) => {
  const [filterType, setFilterType] = useState('all');
  const [processingPlan, setProcessingPlan] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const filteredHistory = (zoomCredits?.history ?? []).filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const handlePurchase = async (plan) => {
    if (!onPurchaseCredits) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setProcessingPlan(plan.id);
      const result = await onPurchaseCredits(plan.amount);
      if (result?.success === false) {
        setError(result.error ?? 'Unable to complete purchase.');
      } else {
        setSuccess(`${plan.amount} credits added successfully.`);
      }
    } finally {
      setProcessingPlan(null);
    }
  };

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  const summary = {
    available: zoomCredits?.available ?? 0,
    used: zoomCredits?.used ?? 0,
    total: zoomCredits?.totalCredited ?? (zoomCredits?.available ?? 0) + (zoomCredits?.used ?? 0),
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Zoom Credits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Available Credits</h4>
            <div className="text-3xl font-bold text-green-600">{summary.available}</div>
            <p className="text-sm text-gray-500 mt-1">Minutes ready for upcoming classes</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Used Credits</h4>
            <div className="text-3xl font-bold text-blue-600">{summary.used}</div>
            <p className="text-sm text-gray-500 mt-1">Minutes consumed in scheduled sessions</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Total Credits</h4>
            <div className="text-3xl font-bold text-purple-600">{summary.total}</div>
            <p className="text-sm text-gray-500 mt-1">Lifetime allocation across your academy</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Purchase Credits</h4>
            <p className="text-gray-600">Choose a package to instantly add credits to your balance.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const accent = accentClass[plan.accent];
            const isProcessing = processingPlan === plan.id;
            return (
              <div key={plan.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-300 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-lg font-medium text-gray-900">{plan.name}</h5>
                  <span className={`${accent.badge} text-xs font-semibold px-2.5 py-0.5 rounded`}>{plan.price}</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{plan.amount}</div>
                <p className="text-gray-500 mb-4">Credits</p>
                <ul className="space-y-2 mb-6">
                  {planFeatures(plan.amount).map((feature) => (
                    <li key={feature} className="flex items-center">
                      <FaCheck className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePurchase(plan)}
                  disabled={isProcessing}
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${accent.button} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60`}
                >
                  <FaShoppingCart className="mr-2" />
                  {isProcessing ? 'Processing…' : 'Purchase'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Credit History</h4>
            <p className="text-gray-600">Track purchases and usage over time.</p>
          </div>
          <div className="flex space-x-2">
            <select
              className="block pl-3 pr-10 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="purchase">Purchases Only</option>
              <option value="usage">Usage Only</option>
            </select>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <FaFilter className="mr-1.5" /> Filter
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <FaDownload className="mr-1.5" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-sm text-gray-500 text-center">
                    No transactions to display.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.type === 'purchase' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Purchase
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Usage
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.type === 'purchase'
                        ? `Credit purchase (Transaction ID: ${item.transactionId})`
                        : `Used for class: ${item.className}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.type === 'purchase' ? (
                        <span className="text-green-600">+{item.amount}</span>
                      ) : (
                        <span className="text-red-600">-{item.amount}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ZoomCreditsTab;
