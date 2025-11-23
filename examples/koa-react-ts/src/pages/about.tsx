import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-8 font-medium"
        >
          ← Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            ℹ️ About Vont Framework
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What is Vont Framework?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                A full-stack framework that combines the power of Koa.js (backend) and React
                (frontend) into a single, unified development experience. It's designed to be
                similar to Next.js but without SSR, allowing you to build both API routes and
                frontend pages in a single codebase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Key Features
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">✓</span>
                  <div>
                    <strong className="text-gray-900">File-based Routing:</strong>
                    <span className="text-gray-700"> Your file structure automatically becomes your API and page routes</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">✓</span>
                  <div>
                    <strong className="text-gray-900">TypeScript Support:</strong>
                    <span className="text-gray-700"> Full type safety across your entire application stack</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">✓</span>
                  <div>
                    <strong className="text-gray-900">Zero Configuration:</strong>
                    <span className="text-gray-700"> Convention over configuration means you can start building immediately</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">✓</span>
                  <div>
                    <strong className="text-gray-900">Hot Module Replacement:</strong>
                    <span className="text-gray-700"> See your changes instantly during development</span>
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Tech Stack
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
                  <p className="text-gray-700">Koa 2.x</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
                  <p className="text-gray-700">React 18 + Router 6</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Build Tool</h3>
                  <p className="text-gray-700">Vite 5</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Language</h3>
                  <p className="text-gray-700">TypeScript</p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Why Vont?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vont simplifies full-stack development by providing a unified framework
                that handles both backend and frontend concerns. With file-based routing,
                TypeScript support, and hot module replacement, you can focus on building
                features instead of configuring tools.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Whether you're building a simple API or a complex web application,
                Vont provides the structure and tools you need to get started quickly
                and scale with confidence.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
