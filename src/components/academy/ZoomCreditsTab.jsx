import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaFilter, FaDownload, FaShoppingCart, FaHistory } from 'react-icons/fa';

const ZoomCreditsTab = ({ zoomCredits }) => {
  const [filterType, setFilterType] = useState('all');

  // Filter credit history based on type
  const filteredHistory = zoomCredits.history.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Credit Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Zoom Credits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Available Credits</h4>
            <div className="text-3xl font-bold text-green-600">{zoomCredits.available}</div>
            <p className="text-sm text-gray-500 mt-1">Minutes available for classes</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Used Credits</h4>
            <div className="text-3xl font-bold text-blue-600">{zoomCredits.used}</div>
            <p className="text-sm text-gray-500 mt-1">Minutes used in classes</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Total Credits</h4>
            <div className="text-3xl font-bold text-purple-600">{zoomCredits.available + zoomCredits.used}</div>
            <p className="text-sm text-gray-500 mt-1">Total minutes purchased</p>
          </div>
        </div>
      </div>
      
      {/* Purchase Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Purchase Credits</h4>
            <p className="text-gray-600">Buy more credits for your academy's online classes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-300 hover:border-green-300">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-medium text-gray-900">Basic</h5>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Popular</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$49.99</div>
            <p className="text-gray-500 mb-4">100 Credits</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-600">100 minutes of class time</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-600">Up to 100 participants</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-600">Basic recording features</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-600">7-day recording storage</span>
              </li>
            </ul>
            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <FaShoppingCart className="mr-2" /> Purchase
            </button>
          </div>
          
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-300 hover:border-blue-300">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-medium text-gray-900">Standard</h5>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Best Value</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$99.99</div>
            <p className="text-gray-500 mb-4">250 Credits</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600">250 minutes of class time</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600">Up to 250 participants</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600">Advanced recording features</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600">30-day recording storage</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-600">Priority support</span>
              </li>
            </ul>
            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FaShoppingCart className="mr-2" /> Purchase
            </button>
          </div>
          
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-300 hover:border-purple-300">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-medium text-gray-900">Premium</h5>
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">Unlimited</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$199.99</div>
            <p className="text-gray-500 mb-4">600 Credits</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-gray-600">600 minutes of class time</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-gray-600">Unlimited participants</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-gray-600">Premium recording features</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-gray-600">Unlimited cloud storage</span>
              </li>
              <li className="flex items-center">
                <FaCheck className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-gray-600">Priority support</span>
              </li>
            </ul>
            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              <FaShoppingCart className="mr-2" /> Purchase
            </button>
          </div>
        </div>
      </div>
      
      {/* Credit History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Credit History</h4>
            <p className="text-gray-600">View your credit purchase and usage history</p>
          </div>
          <div className="flex space-x-2">
            <select
              className="block pl-3 pr-10 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((item) => (
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
                    {item.type === 'purchase' ? 
                      `Credit purchase (Transaction ID: ${item.transactionId})` : 
                      `Used for class: ${item.className}`}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ZoomCreditsTab;