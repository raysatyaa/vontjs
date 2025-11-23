import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎉 Welcome to Vont React Example
          </h1>
          <p className="text-xl text-gray-600">
            A full-stack framework combining Koa and React
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ⚡ File-based Routing
            </h3>
            <p className="text-gray-600">
              Automatic API and page routes based on file structure
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              🔧 TypeScript Support
            </h3>
            <p className="text-gray-600">
              Full-stack type safety with complete TypeScript integration
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              🚀 Zero Configuration
            </h3>
            <p className="text-gray-600">
              Convention over configuration - get started immediately
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              🔄 HMR Support
            </h3>
            <p className="text-gray-600">
              Hot module replacement for instant development feedback
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <Link
            to="/users"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            👥 View Users
          </Link>
          <Link
            to="/about"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            ℹ️ About
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Start:
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Create files in <code className="bg-gray-100 px-2 py-1 rounded text-sm">demo/api/</code> for backend routes
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Create files in <code className="bg-gray-100 px-2 py-1 rounded text-sm">demo/pages/</code> for frontend pages
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Use <code className="bg-gray-100 px-2 py-1 rounded text-sm">import &#123; get, post &#125; from '@/lib/api'</code> to call APIs
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
